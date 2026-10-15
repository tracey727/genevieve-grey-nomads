import assert from 'node:assert/strict';
import {build} from 'esbuild';
import * as runtime from 'miniflare';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../',import.meta.url));
const source=`import {hashPassword,verifyPassword,createSessionToken,verifySessionToken} from './lib/auth.js';
export default {async fetch(){
 const password='synthetic-workers-password-probe';
 const hash=await hashPassword(password);
 const token=await createSessionToken({sub:'synthetic-only'},'synthetic-test-secret',60);
 return Response.json({passwordVerified:await verifyPassword(password,hash),
   wrongPasswordRejected:!(await verifyPassword('wrong-password',hash)),
   sessionVerified:Boolean(await verifySessionToken(token,'synthetic-test-secret')),
   appendedSegmentRejected:(await verifySessionToken(token+'.extra','synthetic-test-secret'))===null});
}};`;
const result=await build({stdin:{contents:source,resolveDir:root},bundle:true,write:false,format:'esm',platform:'browser',external:['node:*']});
const options={script:result.outputFiles[0].text,modules:true,compatibilityDate:'2026-08-19',compatibilityFlags:['nodejs_compat']};
const mf=new runtime.Miniflare(typeof runtime.convertV4MiniflareOptions==='function'?runtime.convertV4MiniflareOptions(options):options);
try {
 const response=await mf.dispatchFetch('http://synthetic-runtime.test/');
 assert.equal(response.status,200);
 const result=await response.json();
 assert.deepEqual(result,{passwordVerified:true,wrongPasswordRejected:true,sessionVerified:true,appendedSegmentRejected:true});
 console.log('PASS: password hashing and session verification in the production Workers runtime configuration');
}finally {await mf.dispose();}
