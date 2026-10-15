import {randomUUID,randomBytes} from 'node:crypto';
const origin='https://genevieve-grey-nomads.positivity864.workers.dev';
const run=randomUUID(),deviceA=randomUUID(),deviceB=randomUUID();
let phase='readiness';
const fixtures=[];
function requireCondition(value,label){if(!value)throw Error(label);}
async function api(path,{method='GET',token,body}={}){
 const headers={accept:'application/json'};
 if(token)headers.authorization='Bearer '+token;
 if(body)headers['content-type']='application/json';
 const response=await fetch(new URL(path,origin),{method,headers,redirect:'manual',
   body:body?JSON.stringify(body):undefined,signal:AbortSignal.timeout(20000)});
 const reader=response.body?.getReader();let size=0;const parts=[];
 if(reader)try{for(;;){const {done,value}=await reader.read();if(done)break;size+=value.byteLength;if(size>65536)throw Error('Response limit');parts.push(value);}}finally{await reader.cancel().catch(()=>{});reader.releaseLock();}
 return {status:response.status,value:JSON.parse(Buffer.concat(parts).toString('utf8'))};
}
async function account(label){
 const email='audit-'+label+'-'+run+'@example.invalid',password=randomBytes(24).toString('base64url');
 const signup=await api('/api/auth/signup',{method:'POST',body:{email,password}});
 requireCondition(signup.status===201&&typeof signup.value.token==='string','Synthetic signup');
 const bad=await api('/api/auth/login',{method:'POST',body:{email,password:'wrong-synthetic-password'}});
 requireCondition(bad.status===401,'Incorrect password rejection');
 const login=await api('/api/auth/login',{method:'POST',body:{email,password}});
 requireCondition(login.status===200&&typeof login.value.token==='string','Synthetic login');
 const session=await api('/api/auth/session',{token:login.value.token});
 requireCondition(session.status===200&&session.value.user?.email===email,'Authenticated session');
 return {token:login.value.token,email,password};
}
const plan={origin:'Synthetic QA origin',destination:'Synthetic QA destination',totalBudget:100,routeDistanceKm:25,
 result:{totalBudget:100,totalDistanceKm:25,status:'on-budget'},syntheticVerification:true};
async function save(name,deviceId,token){
 const result=await api('/api/trips',{method:'POST',token,body:{deviceId,name,plan,userId:'ignored-untrusted-owner'}});
 requireCondition(result.status===201&&typeof result.value.trip?.public_id==='string','Save synthetic journey');
 const fixture={id:result.value.trip.public_id,deviceId,token};fixtures.push(fixture);return fixture;
}
async function trips(deviceId,token){const r=await api('/api/trips?deviceId='+deviceId,{token});requireCondition(r.status===200&&Array.isArray(r.value.trips),'Read journeys');return r.value.trips;}
try{
 const readiness=await api('/api/readiness');
 requireCondition(readiness.status===200&&readiness.value.service==='genevieve-grey-nomads'&&readiness.value.accountInfrastructureReady===true,'Account infrastructure gate');
 phase='synthetic signup and login';
 const a=await account('a'),b=await account('b');
 console.log('PASS: two synthetic accounts, incorrect-password rejection, login and authenticated session');
 phase='account journey persistence';
 const own=await save('Synthetic account journey '+run,deviceA,a.token);
 const fresh=await api('/api/auth/login',{method:'POST',body:{email:a.email,password:a.password}});
 requireCondition(fresh.status===200&&typeof fresh.value.token==='string','New login after save');
 requireCondition((await trips(deviceB,fresh.value.token)).some(t=>t.public_id===own.id),'Persistence on another device with a new session');
 console.log('PASS: account journey persists across a new login and another device');
 phase='owner and signed-out boundaries';
 requireCondition(!(await trips(deviceA,b.token)).some(t=>t.public_id===own.id),'Other account cannot read shared-device journey');
 requireCondition(!(await trips(deviceA)).some(t=>t.public_id===own.id),'Signed-out device cannot read account journey');
 const signedOut=await api('/api/auth/session');requireCondition(signedOut.status===401,'No signed-out session');
 const invalid=await api('/api/trips?deviceId='+deviceA,{token:a.token+'.extra'});requireCondition(invalid.status===401,'Malformed token cannot fall back');
 const crossDelete=await api('/api/trips?deviceId='+deviceA+'&tripId='+own.id,{method:'DELETE',token:b.token});requireCondition(crossDelete.status===404,'Other account cannot delete');
 requireCondition((await trips(deviceB,a.token)).some(t=>t.public_id===own.id),'Rejected cross-owner delete preserves journey');
 console.log('PASS: another account and signed-out device cannot read/delete the account journey; malformed token rejected');
 phase='anonymous-device compatibility';
 const anonymous=await save('Synthetic device journey '+run,deviceA);
 requireCondition((await trips(deviceA)).some(t=>t.public_id===anonymous.id),'Anonymous device journey saved');
 requireCondition(!(await trips(deviceB)).some(t=>t.public_id===anonymous.id),'Different device cannot read anonymous journey');
 requireCondition(!(await trips(deviceA,a.token)).some(t=>t.public_id===anonymous.id),'Account store does not claim anonymous journey');
 console.log('PASS: existing device journey flow remains separate from account journeys');
 phase='fixture cleanup';
 for(const fixture of fixtures){const r=await api('/api/trips?deviceId='+fixture.deviceId+'&tripId='+fixture.id,{method:'DELETE',token:fixture.token});requireCondition(r.status===200,'Owner fixture deletion');fixture.deleted=true;}
 requireCondition(!(await trips(deviceB,a.token)).some(t=>t.public_id===own.id),'Deleted account fixture removed');
 console.log('PASS: owners can delete their own synthetic journeys; both journey fixtures removed');
 console.log(JSON.stringify({state:'SYNTHETIC_ACCOUNT_AND_TRIP_FLOW_VERIFIED',syntheticAccountsRetained:2,
  customerRecordsTouched:false,billingCalled:false,credentialsLogged:false,logoutScope:'SIGNED_OUT_REQUEST_BOUNDARY_ONLY',
  globalSessionRevocationVerified:false,checkedAt:new Date().toISOString()}));
}catch{
 console.error('HOLD: synthetic account/trip verification failed at '+phase+'. No credentials or raw responses logged.');
 process.exitCode=1;
}finally{
 // Only exact journeys created by this run may be removed; no bulk deletion.
 for(const fixture of fixtures.filter(x=>!x.deleted))try{await api('/api/trips?deviceId='+fixture.deviceId+'&tripId='+fixture.id,{method:'DELETE',token:fixture.token});}catch{}
}
