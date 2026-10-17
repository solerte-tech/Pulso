// Chatbot 24h grátis (Cloudflare Workers). Variáveis secretas: TG_TOKEN, META_TOKEN, VERIFY_TOKEN.
// Telegram: setWebhook apontando para a URL do Worker. Instagram/Messenger: use a URL como Webhook no app Meta.
// Observação: Meta exige app aprovado para produção; WhatsApp usa outro formato de payload.
const SYS='Você atende as redes sociais de uma agência de marketing. Responda em português, curto e simpático.';
const ia=async m=>(await(await fetch('https://text.pollinations.ai/openai',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({model:'openai',messages:[{role:'system',content:SYS},{role:'user',content:m}]})})).json()).choices[0].message.content;
const post=(u,b)=>fetch(u,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(b)});
export default{async fetch(req,env){const u=new URL(req.url);
if(req.method=='GET')return new Response(u.searchParams.get('hub.verify_token')==env.VERIFY_TOKEN?u.searchParams.get('hub.challenge'):'ok');
const b=await req.json();
if(b.message?.text)await post(`https://api.telegram.org/bot${env.TG_TOKEN}/sendMessage`,{chat_id:b.message.chat.id,text:await ia(b.message.text)});
const ev=b.entry?.[0]?.messaging?.[0];
if(ev?.message?.text)await post(`https://graph.facebook.com/v19.0/me/messages?access_token=${env.META_TOKEN}`,{recipient:{id:ev.sender.id},message:{text:await ia(ev.message.text)}});
return new Response('ok')}}
