// Chatbot 24h grátis (Cloudflare Workers). Guia completo: docs/GUIA-BOT-24H.md
// Variáveis (Settings → Variables and Secrets): TG_TOKEN, TG_SECRET, META_TOKEN, VERIFY_TOKEN
const SYS='Você atende as redes sociais de uma agência de marketing de conteúdo. Responda em português do Brasil, em até 3 frases, de forma simpática e objetiva. Se pedirem preço ou proposta, peça o nome e o objetivo do cliente.';
const FALLBACK='Obrigado pela mensagem! Já vamos te responder em detalhes.';
const ia=async m=>{try{const r=await fetch('https://text.pollinations.ai/openai',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({model:'openai',messages:[{role:'system',content:SYS},{role:'user',content:m}]})});return(await r.json()).choices[0].message.content}catch{return FALLBACK}};
const post=(u,b)=>fetch(u,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(b)});
export default{async fetch(req,env){const u=new URL(req.url);
if(req.method=='GET')return new Response(u.searchParams.get('hub.verify_token')==env.VERIFY_TOKEN?u.searchParams.get('hub.challenge'):'ok');
const b=await req.json();
if(b.message?.text){
 if(env.TG_SECRET&&req.headers.get('x-telegram-bot-api-secret-token')!==env.TG_SECRET)return new Response('forbidden',{status:403});
 const t=b.message.text,a=t=='/start'?'Olá! Sou o assistente virtual. Como posso ajudar?':await ia(t);
 await post(`https://api.telegram.org/bot${env.TG_TOKEN}/sendMessage`,{chat_id:b.message.chat.id,text:a})}
const ev=b.entry?.[0]?.messaging?.[0];
if(ev?.message?.text&&!ev.message.is_echo)await post(`https://graph.facebook.com/v19.0/me/messages?access_token=${env.META_TOKEN}`,{recipient:{id:ev.sender.id},message:{text:await ia(ev.message.text)}});
return new Response('ok')}}
