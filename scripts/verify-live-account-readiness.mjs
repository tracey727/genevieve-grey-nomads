import assert from 'node:assert/strict';
const origin='https://genevieve-grey-nomads.positivity864.workers.dev';
async function get(path,limit=16384){
 const response=await fetch(new URL(path,origin),{method:'GET',redirect:'manual',signal:AbortSignal.timeout(15000),headers:{accept:'application/json'}});
 const reader=response.body?.getReader();let bytes=0;const parts=[];
 if(reader)try{for(;;){const {done,value}=await reader.read();if(done)break;bytes+=value.byteLength;if(bytes>limit)throw Error('Verification response too large');parts.push(value);}}finally{await reader.cancel().catch(()=>{});reader.releaseLock();}
 const body=Buffer.concat(parts).toString('utf8');
 return {status:response.status,type:response.headers.get('content-type')||'',body};
}
let readiness;
for(let attempt=0;attempt<40;attempt++){
 try{
  const response=await get('/api/readiness');
  if(response.status===200&&response.type.includes('application/json')){
   const value=JSON.parse(response.body);
   if(value.service==='genevieve-grey-nomads'&&value.mode==='READ_ONLY_ACCOUNT_READINESS'){readiness=value;break;}
  }
 }catch{}
 if(attempt<39)await new Promise(resolve=>setTimeout(resolve,5000));
}
assert.ok(readiness,'Reconciled readiness route was not observed');
assert.equal(readiness.ok,true);
assert.equal(readiness.database,'connected');
assert.ok(['ORIGINAL_GREY_NOMADS','CLEAN_GREY_NOMADS'].includes(readiness.target),'Database target remains unverified');
assert.equal(readiness.branchVerified,true,'Runtime branch or database differs from the reviewed destination');
const health=await get('/api/health');
assert.equal(health.status,200);
const identity=JSON.parse(health.body);
assert.equal(identity.service,'genevieve-grey-nomads');assert.equal(identity.database,'connected');
const billing=await get('/billing',1024*1024);
assert.equal(billing.status,200);
assert.match(billing.type,/text\/html/i);
for(const type of ['email','password']){
 const input=billing.body.match(new RegExp('<input\\b[^>]*\\btype="'+type+'"[^>]*>','i'))?.[0];
 assert.ok(input,'Account input is not rendered: '+type);
 assert.doesNotMatch(input,/\bdisabled(?:=|\s|>)/i,'Account field must be enabled before submission');
}
const signedOut=await get('/api/auth/session');
assert.equal(signedOut.status,401,'No anonymous account session may be accepted');
console.log(JSON.stringify({state:'READ_ONLY_TARGET_VERIFIED',databaseTarget:readiness.target,branchVerified:true,
 sessionConfigured:readiness.sessionConfigured===true,schemaReady:readiness.schemaReady===true,
 permissionsReady:readiness.permissionsReady===true,runtimeRoleRestricted:readiness.runtimeRoleRestricted===true,
 accountInfrastructureReady:readiness.accountInfrastructureReady===true,accountFieldsRendered:true,
 anonymousSessionRejected:true,authenticatedWorkflowVerified:false,checkedAt:new Date().toISOString()}));
