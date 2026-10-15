import test from 'node:test';
import assert from 'node:assert/strict';
import {accountReadiness} from '../lib/account-readiness.mjs';
const ready = {project_id:'bitter-art-35680057',branch_id:'br-flat-mouse-auo0cs78',
  database_name_verified:true,users_ready:true,trips_ready:true,billing_ready:true,
  account_permissions_ready:true,runtime_role_restricted:true};
const probe = row => async strings => {
  assert.match(strings.join(''), /^\s*SELECT/);
  assert.doesNotMatch(strings.join(''), /\b(?:CREATE|ALTER|INSERT|UPDATE|DELETE)\s+(?:TABLE|INTO|FROM|users|trips)\b/i);
  return [row];
};
test('readiness identifies the exact allowed database using metadata and never relays arbitrary fields',async()=>{
  const value=await accountReadiness(probe({...ready,password:'DO_NOT_RELAY',email:'DO_NOT_RELAY'}),true);
  assert.equal(value.target,'ORIGINAL_GREY_NOMADS');
  assert.equal(value.accountInfrastructureReady,true);
  assert.equal(value.authenticatedWorkflowVerified,false);
  assert.ok(!JSON.stringify(value).includes('DO_NOT_RELAY'));
  assert.ok(!JSON.stringify(value).includes(ready.project_id));
});
test('schema, permission, session and unexpected branch states fail closed',async()=>{
  for(const change of [{users_ready:false},{trips_ready:false},{billing_ready:false},
    {account_permissions_ready:false},{branch_id:'unexpected'},{database_name_verified:false}]) {
    assert.equal((await accountReadiness(probe({...ready,...change}),true)).accountInfrastructureReady,false);
  }
  assert.equal((await accountReadiness(probe(ready),false)).accountInfrastructureReady,false);
  const unknown=await accountReadiness(probe({...ready,project_id:'private-unknown-project',branch_id:'private-unknown-branch'}),true);
  assert.equal(unknown.target,'UNVERIFIED');
  assert.equal(unknown.accountInfrastructureReady,false);
  assert.ok(!JSON.stringify(unknown).includes('private-unknown'));
});
