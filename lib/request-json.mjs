export async function readRequestJson(request,maxBytes) {
  const reader=request.body?.getReader();
  if(!reader)throw Object.assign(Error('Invalid JSON body.'),{status:400});
  const parts=[];let bytes=0;
  try {
    for(;;){const {done,value}=await reader.read();if(done)break;
      bytes+=value.byteLength;
      if(bytes>maxBytes)throw Object.assign(Error('Request is too large.'),{status:413});
      parts.push(value);
    }
    const content=new Uint8Array(bytes);let offset=0;
    for(const part of parts){content.set(part,offset);offset+=part.length;}
    const body=JSON.parse(new TextDecoder().decode(content));
    if(!body||typeof body!=='object'||Array.isArray(body))throw Object.assign(Error('Invalid JSON body.'),{status:400});
    return body;
  } finally {await reader.cancel().catch(()=>{});reader.releaseLock();}
}
