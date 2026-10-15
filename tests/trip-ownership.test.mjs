import test from 'node:test';
import assert from 'node:assert/strict';
import {createTripHandlers} from '../lib/trip-storage.mjs';
import {createSessionToken} from '../lib/auth.js';
const secret='synthetic-test-signing-key-only';
const a='11111111-1111-4111-8111-111111111111',b='22222222-2222-4222-8222-222222222222';
const device='shared-device-fixture-1234';
const owned='aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',other='bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb';

function fixture({schema=true}={}) {
  const rows=[{public_id:owned,user_id:1,device_id:device,name:'A journey'},
    {public_id:other,user_id:2,device_id:device,name:'B journey'},
    {public_id:'cccccccc-cccc-4ccc-8ccc-cccccccccccc',user_id:null,device_id:device,name:'Device journey'}];
  const calls=[];
  const sql=async(strings,...values)=>{
    const query=strings.join('?').replace(/\s+/g,' ').trim();calls.push({query,values});
    if(query.includes('FROM users'))return values[0]===a?[{id:1}]:values[0]===b?[{id:2}]:[];
    if(query.includes('information_schema.columns'))return [{available:schema}];
    if(query.startsWith('INSERT INTO trips')){
      const columns=query.match(/trips \(([^)]+)\)/)[1].split(',').map(v=>v.trim());
      const row=Object.fromEntries(columns.map((key,i)=>[key,values[i]]));rows.push(row);return [row];
    }
    const account=query.includes('WHERE user_id =');
    const matches=row=>account?row.user_id===values[0]:row.device_id===values[0]&&(!query.includes('user_id IS NULL')||row.user_id==null);
    if(query.startsWith('SELECT '))return rows.filter(matches);
    if(query.startsWith('DELETE ')){
      const found=rows.find(r=>matches(r)&&r.public_id===values[1]);
      if(!found)return [];
      rows.splice(rows.indexOf(found),1);return [found];
    }
    throw Error('Unexpected query in test');
  };
  return {handlers:createTripHandlers({getSql:()=>sql,getSecret:()=>secret}),calls,rows};
}
async function accountRequest(id,path='',options={}) {
  const token=await createSessionToken({sub:id},secret);
  return new Request('https://test.example/api/trips'+path,{...options,headers:{authorization:'Bearer '+token,'content-type':'application/json'}});
}

test('account journeys remain owned on another device and do not include another account sharing the same device',async()=>{
  const f=fixture();
  const res=await f.handlers.GET(await accountRequest(a,'?deviceId=completely-different-device'));
  assert.equal(res.status,200);
  assert.deepEqual((await res.json()).trips.map(t=>t.public_id),[owned]);
  const foreign=await f.handlers.DELETE(await accountRequest(b,'?deviceId='+device+'&tripId='+owned,{method:'DELETE'}));
  assert.equal(foreign.status,404);
  assert.ok(f.rows.some(t=>t.public_id===owned));
});
test('signed-out device access cannot list or delete account-owned journeys after migration',async()=>{
  const f=fixture();
  const res=await f.handlers.GET(new Request('https://test.example/api/trips?deviceId='+device));
  assert.deepEqual((await res.json()).trips.map(t=>t.name),['Device journey']);
  const deny=await f.handlers.DELETE(new Request('https://test.example/api/trips?deviceId='+device+'&tripId='+owned,{method:'DELETE'}));
  assert.equal(deny.status,404);
});
test('a saved account journey ignores caller-supplied owner IDs',async()=>{
  const f=fixture();
  const res=await f.handlers.POST(await accountRequest(a,'',{method:'POST',body:JSON.stringify({
    deviceId:device,name:'Synthetic save',userId:2,plan:{origin:'Test',destination:'Fixture',totalBudget:100,routeDistanceKm:25}
  })}));
  assert.equal(res.status,201);
  assert.equal((await res.json()).trip.user_id,1);
});
test('invalid or expired authentication never falls back to device access or touches SQL',async()=>{
  const f=fixture();
  for(const token of ['invalid',await createSessionToken({sub:a},secret,-1)]) {
    const res=await f.handlers.GET(new Request('https://test.example/api/trips?deviceId='+device,{headers:{authorization:'Bearer '+token}}));
    assert.equal(res.status,401);
  }
  assert.equal(f.calls.length,0);
});
test('trip payload limit is enforced for chunked requests without content-length',async()=>{
  const f=fixture();
  const res=await f.handlers.POST(new Request('https://test.example/api/trips',{method:'POST',body:JSON.stringify({deviceId:device,name:'Oversized',plan:{padding:'x'.repeat(100_000)}})}));
  assert.equal(res.status,413);
  assert.equal(f.calls.length,0);
});
test('legacy signed-out reads remain available before the additive schema exists',async()=>{
  const f=fixture({schema:false});f.rows.splice(0,2);
  const res=await f.handlers.GET(new Request('https://test.example/api/trips?deviceId='+device));
  assert.equal(res.status,200);
  assert.equal((await res.json()).trips[0].name,'Device journey');
});
