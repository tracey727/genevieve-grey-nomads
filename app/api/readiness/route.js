import {getSql} from '../../../lib/db.js';
import {accountReadiness} from '../../../lib/account-readiness.mjs';
export const dynamic = 'force-dynamic';
const identity = {service:'genevieve-grey-nomads', mode:'READ_ONLY_ACCOUNT_READINESS'};
const headers = {'cache-control':'no-store'};

export async function GET() {
  const sql = getSql();
  if (!sql) return Response.json({...identity,ok:false,database:'not-configured'},{status:503,headers});
  try {
    const readiness = await accountReadiness(sql,Boolean(process.env.SESSION_SECRET));
    return Response.json({...identity,ok:true,database:'connected',...readiness},{headers});
  } catch {
    return Response.json({...identity,ok:false,database:'unavailable'},{status:503,headers});
  }
}
