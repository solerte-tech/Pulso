const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const st={get:(k,d)=>{try{return JSON.parse(localStorage.getItem('pulso_'+k))??d}catch{return d}},set:(k,v)=>localStorage.setItem('pulso_'+k,JSON.stringify(v))};
const S={niche:'',topic:null,fmt:[1080,1350],th:0,sl:0};
const DR='oi,olá,ola,bom dia,boa tarde => Olá! Obrigado por falar com a gente. Como posso ajudar?\npreço,valor,quanto => Os valores variam conforme o projeto. Me conta o que você precisa e envio uma proposta.\ncomo funciona,serviço => Criamos conteúdo, analisamos o potencial viral e publicamos por você. Quer ver um exemplo?\nobrigado,valeu => Por nada! Qualquer dúvida é só chamar.';
const cfg=()=>({key:'',model:'gemini-2.0-flash',handle:'@seuperfil',hook:'',rules:DR,...st.get('cfg',{})});
const TH=[['#FF3D81','#5B2BFF'],['#29E0FF','#1B1464'],['#FFC857','#FF3D81']];
function toast(t){const e=$('#toast');e.textContent=t;e.classList.add('on');setTimeout(()=>e.classList.remove('on'),2200)}
function go(v){$$('section').forEach(s=>s.classList.toggle('on',s.id==v));$$('nav button').forEach(b=>b.classList.toggle('on',b.dataset.v==v));scrollTo(0,0);if(v=='i')drawImg()}
$$('nav button').forEach(b=>b.onclick=()=>go(b.dataset.v));
async function ai(p,json){const c=cfg(),r=await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${c.model}:generateContent?key=${c.key}`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({contents:[{parts:[{text:p}]}],generationConfig:json?{responseMimeType:'application/json'}:{}})});if(!r.ok)throw 0;const x=(await r.json()).candidates[0].content.parts[0].text;return json?JSON.parse(x):x}

/* 1. Tendências */
$('#go').onclick=async()=>{const n=$('#niche').value.trim();if(!n)return toast('Digite um nicho');S.niche=n;const box=$('#topics');box.innerHTML='<p class="mut">Buscando o que está em alta…</p>';let t=[];
try{const since=Math.floor(Date.now()/1e3)-7*86400,r=await fetch(`https://hn.algolia.com/api/v1/search?tags=story&query=${encodeURIComponent(n)}&numericFilters=created_at_i>${since},points>20&hitsPerPage=50`),d=await r.json();
t=d.hits.map(h=>({title:h.title,url:h.url,sc:h.points+2*h.num_comments})).sort((a,b)=>b.sc-a.sc).slice(0,3).map(h=>({...h,heat:Math.min(98,Math.round(Math.log10(h.sc+1)*32)),src:'Hacker News'}))}catch{}
if(t.length<3)t=[...t,...[`O erro nº 1 que iniciantes em ${n} cometem`,`${n}: 5 ferramentas grátis que parecem trapaça`,`O que ninguém conta sobre começar em ${n}`].map((x,i)=>({title:x,heat:72-i*4,src:'Ângulo viral'}))].slice(0,3);
box.innerHTML='';t.forEach(x=>{const e=document.createElement('div');e.className='topic';e.innerHTML=`<b></b><button class="pri">Usar</button><span class="mut sm">${x.src} · calor ${x.heat}/100</span><div class="heat"><i style="width:${x.heat}%"></i></div>`;e.querySelector('b').textContent=x.title;e.querySelector('button').onclick=()=>{S.topic=x;$('#ctitle').textContent='Assunto: '+x.title;go('c');gen()};box.append(e)})};

/* 2. Conteúdo + nota viral */
const loc=(t,n)=>{const h=[`Pare de rolar: ${t.title.slice(0,50)}`,`3 coisas sobre ${n} que ninguém te contou`,`Isso muda o jogo em ${n}?`][Math.floor(Math.random()*3)];return{hook:h,points:[`O que está acontecendo: ${t.title}`,`Por que importa para quem trabalha com ${n}`,`O que você pode fazer hoje a respeito`],cta:'Comente “EU QUERO” e salve este post!',tags:[n.replace(/\W/g,''),'viral','dicas']}};
async function gen(){if(!S.topic)return toast('Escolha um assunto antes');const c=cfg();let p;$('#post').value='Gerando…';
if(c.key)try{p=await ai(`Você é estrategista de redes sociais. Nicho: ${S.niche}. Assunto: "${S.topic.title}". Responda JSON {"hook":"","points":["","",""],"cta":"","tags":["","",""]} em português do Brasil. Gancho até 70 caracteres, tom viral, frases curtas, 1-2 emojis.`,true)}catch{toast('IA indisponível, usei o modelo local')}
p=p||loc(S.topic,S.niche);S.p=p;$('#post').value=`${p.hook}\n\n${p.points.map(x=>'• '+x).join('\n')}\n\n${p.cta}\n\n${p.tags.map(x=>'#'+x).join(' ')}`;rate()}
function rate(){const tx=$('#post').value,pf=$('#pf').value,h=tx.split('\n')[0]||'',w=tx.split(/\s+/).filter(Boolean).length,tg=(tx.match(/#\p{L}+/gu)||[]).length,em=(tx.match(/\p{Extended_Pictographic}/gu)||[]).length;
const R={ig:[40,120],tt:[20,60],x:[15,40],li:[80,200]}[pf],sn=tx.split(/[.!?\n]+/).filter(Boolean),avg=w/Math.max(1,sn.length);
const ck=[['Gancho curto (até 70 caracteres)',15,h.length>0&&h.length<=70,'Encurte a primeira linha'],['Gancho com gatilho (número, pergunta, “erro”, “ninguém”)',20,/\d|\?|pare|ninguém|segredo|erro|grátis|nunca|verdade/i.test(h),'Abra com número, pergunta ou quebra de padrão'],[`Tamanho ideal (${R[0]}–${R[1]} palavras)`,15,w>=R[0]&&w<=R[1],'Ajuste o tamanho para a rede'],['1 a 4 emojis',10,em>=1&&em<=4,'Use de 1 a 4 emojis'],['Hashtags na medida',10,pf=='x'?tg>=1&&tg<=2:tg>=3&&tg<=6,pf=='x'?'Use 1 ou 2 hashtags':'Use de 3 a 6 hashtags'],['Chamada para ação',15,/comente|salve|compartilh|siga|marque|envie|me conta|link/i.test(tx),'Peça comentar, salvar ou compartilhar'],['Gera conversa (pergunta)',10,/\?/.test(tx),'Termine com uma pergunta'],['Frases curtas',5,avg<=18,'Quebre frases longas']];
const sc=ck.reduce((a,c)=>a+(c[2]?c[1]:0),0);$('#num').textContent=sc;$('#ring').style.strokeDashoffset=327*(1-sc/100);
$('#tips').innerHTML=ck.map(c=>`<li class="${c[2]?'ok':'no'}">${c[2]?'✓':'✗'} ${c[2]?c[0]:c[3]}</li>`).join('')}
$('#gen').onclick=gen;$('#post').oninput=rate;$('#pf').onchange=rate;

/* 3. Imagens */
const lines=()=>{const p=S.p||{hook:S.niche||'Seu gancho aqui',points:['Ponto 1','Ponto 2','Ponto 3'],cta:'Siga para mais!'};return[p.hook,...p.points,p.cta]};
function wrap(x,t,w){const o=[];let l='';t.split(' ').forEach(s=>{if(x.measureText(l+' '+s).width>w&&l){o.push(l);l=s}else l=l?l+' '+s:s});o.push(l);return o}
function slide(x,W,H,txt,sub,k=1,th=S.th){const[a,b]=TH[th],g=x.createLinearGradient(0,0,W,H);g.addColorStop(0,a);g.addColorStop(1,b);x.fillStyle=g;x.fillRect(0,0,W,H);x.fillStyle='rgba(255,255,255,.12)';x.beginPath();x.arc(W*.88,H*.1,W*.36,0,7);x.fill();
x.save();x.globalAlpha=Math.min(1,k*2.5);x.translate(W/2,H/2);const s=.94+.06*k;x.scale(s,s);x.fillStyle='#fff';x.textAlign='center';const fs=W*(txt.length>70?.06:.08);x.font=`800 ${fs}px Unbounded,Arial Black,sans-serif`;const ls=wrap(x,txt,W*.8);ls.forEach((l,i)=>x.fillText(l,0,(i-(ls.length-1)/2)*fs*1.3));x.restore();
x.fillStyle='rgba(255,255,255,.9)';x.textAlign='center';x.font=`700 ${W*.034}px Figtree,sans-serif`;x.fillText(sub,W/2,H*.95)}
function drawImg(){const c=$('#cv');[c.width,c.height]=S.fmt;const L=lines();slide(c.getContext('2d'),c.width,c.height,L[S.sl]||L[0],cfg().handle);
$('#slides').innerHTML='';L.forEach((_,i)=>{const b=document.createElement('button');b.className='chip'+(i==S.sl?' on':'');b.textContent=i?(i==L.length-1?'CTA':i):'Capa';b.onclick=()=>{S.sl=i;drawImg()};$('#slides').append(b)})}
$('#themes').innerHTML=TH.map((t,i)=>`<button class="sw${i?'':' on'}" style="background:linear-gradient(135deg,${t[0]},${t[1]})" aria-label="Tema ${i+1}" data-i="${i}"></button>`).join('');
$$('.sw').forEach(b=>b.onclick=()=>{S.th=+b.dataset.i;$$('.sw').forEach(x=>x.classList.toggle('on',x==b));drawImg()});
$('#fmt').onchange=e=>{S.fmt=e.target.value.split(',').map(Number);drawImg()};
const save=(blob,n)=>{const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=n;a.click()};
$('#dl').onclick=()=>$('#cv').toBlob(b=>save(b,`pulso-slide-${S.sl+1}.png`));
$('#dla').onclick=()=>{const o=S.sl;lines().forEach((_,i)=>setTimeout(()=>{S.sl=i;drawImg();$('#cv').toBlob(b=>save(b,`pulso-slide-${i+1}.png`))},i*400));setTimeout(()=>{S.sl=o;drawImg()},lines().length*400+200)};

/* 4. Vídeo */
function rec(c,draw,dur,vid){return new Promise(res=>{const s=c.captureStream(30);if(vid)try{vid.captureStream().getAudioTracks().forEach(t=>s.addTrack(t))}catch{}
const mt=['video/mp4;codecs=avc1','video/webm;codecs=vp9','video/webm'].find(m=>MediaRecorder.isTypeSupported(m)),r=new MediaRecorder(s,{mimeType:mt,videoBitsPerSecond:5e6}),ch=[];
r.ondataavailable=e=>ch.push(e.data);r.onstop=()=>res({blob:new Blob(ch,{type:mt.split(';')[0]}),ext:mt.includes('mp4')?'mp4':'webm'});r.start();const t0=performance.now();(function f(){const t=(performance.now()-t0)/1000;draw(t);t<dur?requestAnimationFrame(f):r.stop()})()})}
function show({blob,ext}){const u=URL.createObjectURL(blob);$('#vout').innerHTML=`<video controls playsinline src="${u}"></video><div><a href="${u}" download="pulso-video.${ext}"><button class="pri">Baixar vídeo</button></a></div>`;toast('Vídeo pronto')}
$('#mk').onclick=async()=>{const c=$('#vc'),x=c.getContext('2d'),L=lines(),D=2.5;toast('Gravando…');show(await rec(c,t=>{const i=Math.min(L.length-1,Math.floor(t/D));slide(x,1080,1920,L[i],cfg().handle,Math.min(1,(t%D)/.5))},L.length*D))};
$('#file').onchange=e=>{const v=$('#vin');v.src=URL.createObjectURL(e.target.files[0]);v.onloadedmetadata=()=>{$('#ee').value=Math.min(60,Math.floor(v.duration))}};
$('#ed').onclick=async()=>{const v=$('#vin');if(!v.src)return toast('Escolha um vídeo');const c=$('#vc'),x=c.getContext('2d'),a=+$('#ss').value,b=+$('#ee').value,cap=$('#cap').value;
v.currentTime=a;await new Promise(r=>v.onseeked=r);v.muted=false;toast('Gravando (o som toca durante o corte)…');v.play();
const out=await rec(c,()=>{const k=Math.max(1080/v.videoWidth,1920/v.videoHeight),w=v.videoWidth*k,h=v.videoHeight*k;x.fillStyle='#000';x.fillRect(0,0,1080,1920);x.drawImage(v,(1080-w)/2,(1920-h)/2,w,h);
if(cap){x.font='800 64px Figtree,sans-serif';x.textAlign='center';const ls=wrap(x,cap,900);x.fillStyle='rgba(0,0,0,.55)';x.fillRect(0,1500,1080,ls.length*80+40);x.fillStyle='#fff';ls.forEach((l,i)=>x.fillText(l,540,1565+i*80))}},b-a,v);v.pause();show(out)};

/* 5. Publicar */
const txt=()=>$('#post').value||lines().join('\n'),q=encodeURIComponent;
const NET=[['X',()=>`https://twitter.com/intent/tweet?text=${q(txt())}`],['Threads',()=>`https://www.threads.net/intent/post?text=${q(txt())}`],['Bluesky',()=>`https://bsky.app/intent/compose?text=${q(txt())}`],['WhatsApp',()=>`https://wa.me/?text=${q(txt())}`],['Telegram',()=>`https://t.me/share/url?url=${q(location.href)}&text=${q(txt())}`],['LinkedIn',()=>'https://www.linkedin.com/feed/'],['Instagram',()=>'https://www.instagram.com/'],['TikTok',()=>'https://www.tiktok.com/upload']];
NET.forEach(([n,u])=>{const b=document.createElement('button');b.textContent=n;b.onclick=async()=>{await navigator.clipboard?.writeText(txt());toast('Texto copiado');window.open(u(),'_blank')};$('#pubs').append(b)});
const sh=document.createElement('button');sh.className='pri';sh.textContent='Compartilhar (celular)';sh.onclick=()=>{go('i');$('#cv').toBlob(async b=>{const f=new File([b],'pulso.png',{type:'image/png'});try{navigator.canShare?.({files:[f]})?await navigator.share({files:[f],text:txt()}):await navigator.share({text:txt()})}catch{toast('Compartilhamento indisponível neste aparelho')};go('p')})};$('#pubs').prepend(sh);
$('#hook').onclick=async()=>{const u=cfg().hook;if(!u)return toast('Defina o webhook em Ajustes');try{await fetch(u,{method:'POST',mode:'no-cors',headers:{'Content-Type':'text/plain'},body:JSON.stringify({text:txt(),niche:S.niche,topic:S.topic?.title,platform:$('#pf').value})});toast('Enviado ao webhook')}catch{toast('Falha ao enviar')}};

/* 6. Chatbot */
function bub(t,c){const e=document.createElement('div');e.className='bub '+c;e.textContent=t;$('#chat').append(e)}
async function reply(m){const c=cfg(),l=m.toLowerCase();for(const r of c.rules.split('\n')){const[k,a]=r.split('=>');if(a&&k.split(',').some(w=>w.trim()&&l.includes(w.trim().toLowerCase())))return a.trim()}
if(c.key)try{return await ai(`Você atende as redes sociais de uma agência de conteúdo sobre ${S.niche||'marketing'} (${c.handle}). Responda em português, curto e simpático, a esta mensagem: "${m}"`)}catch{}
return 'Obrigado pela mensagem! Já vamos te responder em detalhes. 😊'}
$('#send').onclick=async()=>{const m=$('#msg').value.trim();if(!m)return;bub(m,'me');$('#msg').value='';bub('…','bot');const r=await reply(m);$('#chat').lastChild.textContent=r};
$('#msg').onkeydown=e=>{if(e.key=='Enter')$('#send').click()};

/* 7. Ajustes */
const c0=cfg();$('#k').value=c0.key;$('#m').value=c0.model;$('#h').value=c0.handle;$('#w').value=c0.hook;$('#r').value=c0.rules;
$('#save').onclick=()=>{st.set('cfg',{key:$('#k').value.trim(),model:$('#m').value.trim()||'gemini-2.0-flash',handle:$('#h').value.trim(),hook:$('#w').value.trim(),rules:$('#r').value});toast('Salvo')};
$('#niche').onkeydown=e=>{if(e.key=='Enter')$('#go').click()};rate();
