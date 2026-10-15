import test from 'node:test';
import assert from 'node:assert/strict';
import {readRequestJson} from '../lib/request-json.mjs';
test('account body limits apply to streamed requests without trusting Content-Length',async()=>{
 const request=new Request('https://example.test/',{method:'POST',body:JSON.stringify({padding:'x'.repeat(5000)})});
 assert.equal(request.headers.has('content-length'),false);
 await assert.rejects(readRequestJson(request,5000),e=>e.status===413);
});
test('JSON must be an object; valid values are preserved without truncating passwords or emails',async()=>{
 for(const body of ['null','[]','false','bad-json'])await assert.rejects(readRequestJson(new Request('https://example.test/',{method:'POST',body}),5000));
 const value={email:'synthetic@example.invalid',password:'synthetic-password'};
 assert.deepEqual(await readRequestJson(new Request('https://example.test/',{method:'POST',body:JSON.stringify(value)}),5000),value);
});
