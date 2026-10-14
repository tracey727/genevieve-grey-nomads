import test from 'node:test';
import assert from 'node:assert/strict';
import { GET } from '../app/api/health/route.js';

test('health returns exact public identity without a configured database or confidential payload',async()=>{
  const prior=process.env.DATABASE_URL;
  delete process.env.DATABASE_URL;
  try {
    const response=await GET();
    assert.equal(response.status,200);
    const data=await response.json();
    assert.equal(data.service,'genevieve-grey-nomads');
    assert.equal(data.mode,'standalone-traveller-app');
    assert.equal(data.ok,true);
    assert.equal(data.database,'not-configured');
    assert.deepEqual(Object.keys(data).sort(),['service','mode','ok','database'].sort());
  } finally {
    if(prior===undefined)delete process.env.DATABASE_URL;
    else process.env.DATABASE_URL=prior;
  }
});
