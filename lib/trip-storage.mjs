import {requireSession} from './auth.js';
import {readRequestJson} from './request-json.mjs';
const uuidPattern=/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const safeText=(value,max=120)=>String(value??'').trim().slice(0,max);
const bad=(message,status=400)=>Response.json({error:message},{status});

export function createTripHandlers({getSql,getSecret=()=>process.env.SESSION_SECRET,verifySession=requireSession}) {
  async function owner(request) {
    if(!request.headers.has('authorization'))return {account:null};
    const secret=getSecret();
    if(!secret)return {error:bad('Accounts are not enabled yet.',503)};
    let session;
    try {session=await verifySession(request,secret);}catch {session=null;}
    if(!uuidPattern.test(session?.sub||''))return {error:bad('Sign in again to access account journeys.',401)};
    return {account:session.sub};
  }
  async function userId(sql,publicId) {
    const rows=await sql`SELECT id FROM users WHERE public_id = ${publicId}::uuid LIMIT 1`;
    return rows[0]?.id??null;
  }
  async function scopedDeviceSchema(sql) {
    const rows=await sql`SELECT EXISTS(SELECT 1 FROM information_schema.columns
      WHERE table_schema='public' AND table_name='trips' AND column_name='user_id') AS available`;
    if(typeof rows[0]?.available!=='boolean')throw Error('Schema metadata unavailable');
    return rows[0].available;
  }
  return {
    async GET(request) {
      const identity=await owner(request);if(identity.error)return identity.error;
      const sql=getSql();if(!sql)return bad('Trip storage is not configured.',503);
      const deviceId=safeText(new URL(request.url).searchParams.get('deviceId'),80);
      if(!identity.account&&deviceId.length<16)return bad('A valid device ID is required.');
      try {
        let trips;
        if(identity.account){
          const id=await userId(sql,identity.account);if(id===null)return bad('Sign in again.',401);
          trips=await sql`SELECT public_id,name,origin,destination,total_budget,route_distance_km,status,updated_at
            FROM trips WHERE user_id = ${id} ORDER BY updated_at DESC,id DESC LIMIT 30`;
        }else if(await scopedDeviceSchema(sql)){
          trips=await sql`SELECT public_id,name,origin,destination,total_budget,route_distance_km,status,updated_at
            FROM trips WHERE device_id = ${deviceId} AND user_id IS NULL ORDER BY updated_at DESC,id DESC LIMIT 30`;
        }else{
          // Preserve the existing signed-out flow until the additive migration is applied.
          trips=await sql`SELECT public_id,name,origin,destination,total_budget,route_distance_km,status,updated_at
            FROM trips WHERE device_id = ${deviceId} ORDER BY updated_at DESC,id DESC LIMIT 30`;
        }
        return Response.json({trips});
      }catch{return bad('Trip storage is temporarily unavailable.',503);}
    },
    async POST(request) {
      const identity=await owner(request);if(identity.error)return identity.error;
      const sql=getSql();if(!sql)return bad('Trip storage is not configured.',503);
      let body;
      try{body=await readRequestJson(request,100_000);}catch(error){return bad(error.status===413?'Request is too large.':'Invalid JSON body.',error.status===413?413:400);}
      const deviceId=safeText(body.deviceId,80),name=safeText(body.name);
      const plan=body.plan&&typeof body.plan==='object'&&!Array.isArray(body.plan)?body.plan:null;
      if(deviceId.length<16||!name||!plan)return bad('Device ID, name and plan are required.');
      const origin=safeText(plan.origin),destination=safeText(plan.destination);
      const totalBudget=Number(plan.result?.totalBudget??plan.totalBudget??0);
      const routeDistanceKm=Number(plan.result?.totalDistanceKm??plan.routeDistanceKm??0);
      if(!Number.isFinite(totalBudget)||totalBudget<0||!Number.isFinite(routeDistanceKm)||routeDistanceKm<0)return bad('Journey budget and distance must be valid non-negative numbers.');
      const status=safeText(plan.result?.status||'planned',24),publicId=crypto.randomUUID();
      try{
        let rows;
        if(identity.account){
          const id=await userId(sql,identity.account);if(id===null)return bad('Sign in again.',401);
          rows=await sql`INSERT INTO trips (public_id,user_id,device_id,name,origin,destination,total_budget,route_distance_km,status,plan)
            VALUES (${publicId}::uuid,${id},${deviceId},${name},${origin},${destination},${totalBudget},${routeDistanceKm},${status},${JSON.stringify(plan)}::jsonb)
            RETURNING public_id,name,updated_at`;
        }else{
          rows=await sql`INSERT INTO trips (public_id,device_id,name,origin,destination,total_budget,route_distance_km,status,plan)
            VALUES (${publicId}::uuid,${deviceId},${name},${origin},${destination},${totalBudget},${routeDistanceKm},${status},${JSON.stringify(plan)}::jsonb)
            RETURNING public_id,name,updated_at`;
        }
        return Response.json({trip:rows[0]},{status:201});
      }catch{return bad('Trip could not be saved.',503);}
    },
    async DELETE(request) {
      const identity=await owner(request);if(identity.error)return identity.error;
      const sql=getSql();if(!sql)return bad('Trip storage is not configured.',503);
      const params=new URL(request.url).searchParams;
      const deviceId=safeText(params.get('deviceId'),80),tripId=safeText(params.get('tripId'),64);
      if(!identity.account&&deviceId.length<16)return bad('A valid device ID is required.');
      if(!uuidPattern.test(tripId))return bad('A valid trip ID is required.');
      try{
        let rows;
        if(identity.account){
          const id=await userId(sql,identity.account);if(id===null)return bad('Sign in again.',401);
          rows=await sql`DELETE FROM trips WHERE user_id = ${id} AND public_id = ${tripId}::uuid RETURNING public_id`;
        }else if(await scopedDeviceSchema(sql)){
          rows=await sql`DELETE FROM trips WHERE device_id = ${deviceId} AND user_id IS NULL AND public_id = ${tripId}::uuid RETURNING public_id`;
        }else{
          rows=await sql`DELETE FROM trips WHERE device_id = ${deviceId} AND public_id = ${tripId}::uuid RETURNING public_id`;
        }
        if(!rows.length)return bad('Journey not found.',404);
        return Response.json({ok:true,deletedTripId:rows[0].public_id});
      }catch{return bad('Journey could not be deleted.',503);}
    }
  };
}
