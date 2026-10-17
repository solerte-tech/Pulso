const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const st={get:(k,d)=>{try{return JSON.parse(localStorage.getItem('pulso_'+k))??d}catch{return d}},set:(k,v)=>localStorage.setItem('pulso_'+k,JSON.stringify(v))};
const S={niche:'',topic:null,fmt:[1080,1350],th:0,sl:0};
const DR='oi,olá,ola,bom dia,boa tarde => Olá! Obrigado por falar com a gente. Como posso ajudar?\npreço,valor,quanto => Os valores variam conforme o projeto. Me conta o que você precisa e envio uma proposta.\ncomo funciona,serviço => Criamos conteúdo, analisamos o potencial viral e publicamos por você. Quer ver um exemplo?\nobrigado,valeu => Por nada! Qualquer dúvida é só chamar.';
const cfg=()=>({key:'',model:'',prov:'',base:'',px:'',handle:'@seuperfil',hook:'',tg:'',pk:'',rules:DR,...st.get('cfg',{})});
const TH=[['#FF3D81','#5B2BFF'],['#29E0FF','#1B1464'],['#FFC857','#FF3D81']];
function toast(t){const e=$('#toast');e.textContent=t;e.classList.add('on');setTimeout(()=>e.classList.remove('on'),2200)}
function go(v){$$('section').forEach(s=>s.classList.toggle('on',s.id==v));$$('nav button').forEach(b=>b.classList.toggle('on',b.dataset.v==v));scrollTo(0,0);if(v=='i')drawImg()}
$$('nav button').forEach(b=>b.onclick=()=>go(b.dataset.v));
/*ai-v2*/
const AG={};async function agent(n){if(AG[n]===undefined)try{const r=await fetch(`agentes/${n}.md`);AG[n]=r.ok?await r.text():''}catch{AG[n]=''}return AG[n]}

/* 1. Tendências */
/*go-v2*/

/* 2. Conteúdo + nota viral */
const loc=(t,n)=>{const h=[`Pare de rolar: ${t.title.slice(0,50)}`,`3 coisas sobre ${n} que ninguém te contou`,`Isso muda o jogo em ${n}?`][Math.floor(Math.random()*3)];return{hook:h,points:[`O que está acontecendo: ${t.title}`,`Por que importa para quem trabalha com ${n}`,`O que você pode fazer hoje a respeito`],cta:'Comente “EU QUERO” e salve este post!',tags:[n.replace(/\W/g,''),'viral','dicas'],alt:[`3 coisas sobre ${n} que ninguém te contou`,`Isso muda o jogo em ${n}?`]}};
async function gen(){if(!S.topic)return toast('Escolha um assunto antes');const c=cfg();let p;$('#post').value='Gerando…';
try{p=await ai(`Você é estrategista de redes sociais. Nicho: ${S.niche}. Assunto: "${S.topic.title}".${S.topic.ctx?" Notícias recentes sobre isso: "+S.topic.ctx+".":""} Responda JSON {"hook":"","points":["","",""],"cta":"","tags":["","",""],"alt":["2 ganchos alternativos"]} em português do Brasil. Gancho até 70 caracteres, tom viral, frases curtas, 1-2 emojis.`,{json:1,sys:await agent('content-creator')})}catch{toast('IA indisponível, usei o modelo local')}
p=p||loc(S.topic,S.niche);S.p=p;$('#post').value=`${p.hook}\n\n${p.points.map(x=>'• '+x).join('\n')}\n\n${p.cta}\n\n${p.tags.map(x=>'#'+x).join(' ')}`;rate();ab();auto()}
function rate(){cnt();const tx=$('#post').value,pf=$('#pf').value,h=tx.split('\n')[0]||'',w=tx.split(/\s+/).filter(Boolean).length,tg=(tx.match(/#\p{L}+/gu)||[]).length,em=(tx.match(/\p{Extended_Pictographic}/gu)||[]).length;
const R={ig:[40,120],tt:[20,60],x:[15,40],li:[80,200]}[pf],sn=tx.split(/[.!?\n]+/).filter(Boolean),avg=w/Math.max(1,sn.length);
const ck=[['Gancho curto (até 70 caracteres)',15,h.length>0&&h.length<=70,'Encurte a primeira linha'],['Gancho com gatilho (número, pergunta, “erro”, “ninguém”)',20,/\d|\?|pare|ninguém|segredo|erro|grátis|nunca|verdade/i.test(h),'Abra com número, pergunta ou quebra de padrão'],[`Tamanho ideal (${R[0]}–${R[1]} palavras)`,15,w>=R[0]&&w<=R[1],'Ajuste o tamanho para a rede'],['1 a 4 emojis',10,em>=1&&em<=4,'Use de 1 a 4 emojis'],['Hashtags na medida',10,pf=='x'?tg>=1&&tg<=2:tg>=3&&tg<=6,pf=='x'?'Use 1 ou 2 hashtags':'Use de 3 a 6 hashtags'],['Chamada para ação',15,/comente|salve|compartilh|siga|marque|envie|me conta|link/i.test(tx),'Peça comentar, salvar ou compartilhar'],['Gera conversa (pergunta)',10,/\?/.test(tx),'Termine com uma pergunta'],['Frases curtas',5,avg<=18,'Quebre frases longas']];
const sc=ck.reduce((a,c)=>a+(c[2]?c[1]:0),0);$('#num').textContent=sc;$('#ring').style.strokeDashoffset=327*(1-sc/100);
$('#tips').innerHTML=ck.map(c=>`<li class="${c[2]?'ok':'no'}">${c[2]?'✓':'✗'} ${c[2]?c[0]:c[3]}</li>`).join('')}
$('#gen').onclick=gen;$('#post').oninput=rate;$('#pf').onchange=rate;

/* 3. Imagens */
const lines=()=>{const p=S.p||{hook:S.niche||'Seu gancho aqui',points:['Ponto 1','Ponto 2','Ponto 3'],cta:'Siga para mais!'};return[p.hook,...p.points,p.cta]};
function wrap(x,t,w){const o=[];let l='';t.split(' ').forEach(s=>{if(x.measureText(l+' '+s).width>w&&l){o.push(l);l=s}else l=l?l+' '+s:s});o.push(l);return o}
function slide(x,W,H,txt,sub,k=1,th=S.th,p=0,im=S.bg){const[a,b]=TH[th],g=x.createLinearGradient(0,0,W,H);g.addColorStop(0,a);g.addColorStop(1,b);x.fillStyle=g;x.fillRect(0,0,W,H);const tx=S.tx!==false;
if(im){const m=Math.max(W/im.width,H/im.height)*(1+.12*p),w=im.width*m,h=im.height*m;x.drawImage(im,(W-w)/2,(H-h)/2,w,h);if(tx){const o=x.createLinearGradient(0,0,0,H);o.addColorStop(0,'rgba(10,8,30,.1)');o.addColorStop(1,'rgba(10,8,30,.7)');x.fillStyle=o;x.fillRect(0,0,W,H)}}else{x.fillStyle='rgba(255,255,255,.12)';x.beginPath();x.arc(W*.88,H*.1,W*.36,0,7);x.fill()}
if(tx){x.save();x.globalAlpha=Math.min(1,k*2.5);x.translate(W/2,im?H*.7:H/2);const s=.94+.06*k;x.scale(s,s);x.textAlign='center';const fs=W*(txt.length>70?.07:.09);x.font=`${S.font=='Unbounded'?800:400} ${fs}px "${S.font}",Arial Black,sans-serif`;x.lineJoin='round';const ls=wrap(x,txt,W*.82);ls.forEach((l,i)=>{const y=(i-(ls.length-1)/2)*fs*1.25;if(S.st){x.lineWidth=fs*.16;x.strokeStyle='#000';x.strokeText(l,0,y)}x.fillStyle=S.col;x.fillText(l,0,y)});x.restore();
x.fillStyle='rgba(255,255,255,.9)';x.textAlign='center';x.font=`700 ${W*.034}px Figtree,sans-serif`;x.fillText(sub,W/2,H*.95)}}
function drawImg(){const c=$('#cv');[c.width,c.height]=S.fmt;const L=lines();slide(c.getContext('2d'),c.width,c.height,L[S.sl]||L[0],cfg().handle,1,S.th,0,S.imgs[S.sl]||S.bg);
$('#slides').innerHTML='';L.forEach((_,i)=>{const b=document.createElement('button');b.className='chip'+(i==S.sl?' on':'');b.textContent=i?(i==L.length-1?'CTA':i):'Capa';b.onclick=()=>{S.sl=i;drawImg()};$('#slides').append(b)})}
$('#themes').innerHTML=TH.map((t,i)=>`<button class="sw${i?'':' on'}" style="background:linear-gradient(135deg,${t[0]},${t[1]})" aria-label="Tema ${i+1}" data-i="${i}"></button>`).join('');
$$('.sw').forEach(b=>b.onclick=()=>{S.th=+b.dataset.i;$$('.sw').forEach(x=>x.classList.toggle('on',x==b));drawImg()});
$('#fmt').onchange=e=>{S.fmt=e.target.value.split(',').map(Number);drawImg()};
const save=(blob,n)=>{const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=n;a.click()};
$('#dl').onclick=()=>{try{$('#cv').toBlob(b=>save(b,`pulso-slide-${S.sl+1}.png`))}catch{const m=S.imgs[S.sl]||S.bg;toast('Esta imagem bloqueia exportar com texto. Abrindo a imagem original.');if(m)window.open(m.src)}};
$('#dla').onclick=()=>{const o=S.sl;lines().forEach((_,i)=>setTimeout(()=>{S.sl=i;drawImg();$('#cv').toBlob(b=>save(b,`pulso-slide-${i+1}.png`))},i*400));setTimeout(()=>{S.sl=o;drawImg()},lines().length*400+200)};

/* 4. Vídeo */
function rec(c,draw,dur,vid){return new Promise(res=>{const s=c.captureStream(30);if(vid)try{vid.captureStream().getAudioTracks().forEach(t=>s.addTrack(t))}catch{}
const mt=['video/mp4;codecs=avc1','video/webm;codecs=vp9','video/webm'].find(m=>MediaRecorder.isTypeSupported(m)),r=new MediaRecorder(s,{mimeType:mt,videoBitsPerSecond:5e6}),ch=[];
r.ondataavailable=e=>ch.push(e.data);r.onstop=()=>res({blob:new Blob(ch,{type:mt.split(';')[0]}),ext:mt.includes('mp4')?'mp4':'webm'});r.start();const t0=performance.now();(function f(){const t=(performance.now()-t0)/1000;draw(t);t<dur?requestAnimationFrame(f):r.stop()})()})}
function show({blob,ext}){const u=URL.createObjectURL(blob);$('#vout').innerHTML=`<video controls playsinline src="${u}"></video><div><a href="${u}" download="pulso-video.${ext}"><button class="pri">Baixar vídeo</button></a></div>`;toast('Vídeo pronto')}
$('#mk').onclick=async()=>{const c=$('#vc'),x=c.getContext('2d'),L=lines(),D=2.5;toast('Gravando…');show(await rec(c,t=>{const i=Math.min(L.length-1,Math.floor(t/D));slide(x,1080,1920,L[i],cfg().handle,Math.min(1,(t%D)/.5),S.th,(t%D)/D,S.imgs[i]||S.bg)},L.length*D))};
$('#file').onchange=e=>{const v=$('#vin');v.src=URL.createObjectURL(e.target.files[0]);v.onloadedmetadata=()=>{$('#ee').value=Math.min(60,Math.floor(v.duration))}};
$('#ed').onclick=async()=>{const v=$('#vin');if(!v.src)return toast('Escolha um vídeo');const c=$('#vc'),x=c.getContext('2d'),a=+$('#ss').value,b=+$('#ee').value,cap=$('#cap').value;
v.currentTime=a;await new Promise(r=>v.onseeked=r);v.muted=false;toast('Gravando (o som toca durante o corte)…');v.play();
const out=await rec(c,()=>{const k=Math.max(1080/v.videoWidth,1920/v.videoHeight),w=v.videoWidth*k,h=v.videoHeight*k;x.fillStyle='#000';x.fillRect(0,0,1080,1920);x.drawImage(v,(1080-w)/2,(1920-h)/2,w,h);
if(cap){x.font=`${S.font=='Unbounded'?800:400} 84px "${S.font}",sans-serif`;x.textAlign='center';x.lineJoin='round';const ls=wrap(x,cap,920);ls.forEach((l,i)=>{const y=1440+i*104;if(S.st){x.lineWidth=16;x.strokeStyle='#000';x.strokeText(l,540,y)}x.fillStyle=S.col;x.fillText(l,540,y)})}},b-a,v);v.pause();show(out)};

/* 5. Publicar */
const txt=()=>$('#post').value||lines().join('\n'),q=encodeURIComponent;
const NET=[['X',()=>`https://twitter.com/intent/tweet?text=${q(txt())}`],['Threads',()=>`https://www.threads.net/intent/post?text=${q(txt())}`],['Bluesky',()=>`https://bsky.app/intent/compose?text=${q(txt())}`],['WhatsApp',()=>`https://wa.me/?text=${q(txt())}`],['Telegram',()=>`https://t.me/share/url?url=${q(location.href)}&text=${q(txt())}`],['LinkedIn',()=>'https://www.linkedin.com/feed/'],['Instagram',()=>'https://www.instagram.com/'],['TikTok',()=>'https://www.tiktok.com/upload']];
NET.forEach(([n,u])=>{const b=document.createElement('button');b.textContent=n;b.onclick=async()=>{await navigator.clipboard?.writeText(txt());toast('Texto copiado');window.open(u(),'_blank')};$('#pubs').append(b)});
const sh=document.createElement('button');sh.className='pri';sh.textContent='Compartilhar (celular)';sh.onclick=()=>{go('i');$('#cv').toBlob(async b=>{const f=new File([b],'pulso.png',{type:'image/png'});try{navigator.canShare?.({files:[f]})?await navigator.share({files:[f],text:txt()}):await navigator.share({text:txt()})}catch{toast('Compartilhamento indisponível neste aparelho')};go('p')})};$('#pubs').prepend(sh);
$('#hook').onclick=async()=>{const u=cfg().hook;if(!u)return toast('Defina o webhook em Ajustes');try{await fetch(u,{method:'POST',mode:'no-cors',headers:{'Content-Type':'text/plain'},body:JSON.stringify({text:txt(),niche:S.niche,topic:S.topic?.title,platform:$('#pf').value})});toast('Enviado ao webhook')}catch{toast('Falha ao enviar')}};

/* 6. Chatbot */
function bub(t,c){const e=document.createElement('div');e.className='bub '+c;e.textContent=t;$('#chat').append(e)}
async function reply(m){const c=cfg(),l=m.toLowerCase();for(const r of c.rules.split('\n')){const[k,a]=r.split('=>');if(a&&k.split(',').some(w=>w.trim()&&l.includes(w.trim().toLowerCase())))return a.trim()}
try{return await ai(`Agência de conteúdo sobre ${S.niche||'marketing'} (${c.handle}). Responda em português, curto e simpático, a esta mensagem: "${m}"`,{sys:await agent('support-responder')})}catch{}
return 'Obrigado pela mensagem! Já vamos te responder em detalhes. 😊'}
$('#send').onclick=async()=>{const m=$('#msg').value.trim();if(!m)return;bub(m,'me');$('#msg').value='';bub('…','bot');const r=await reply(m);$('#chat').lastChild.textContent=r};
$('#msg').onkeydown=e=>{if(e.key=='Enter')$('#send').click()};

/* 7. Ajustes */
const c0=cfg();$('#k').value=c0.key;$('#m').value=c0.model;$('#h').value=c0.handle;$('#w').value=c0.hook;$('#r').value=c0.rules;$('#tg').value=c0.tg;$('#pk').value=c0.pk;
$('#save').onclick=()=>{st.set('cfg',{key:$('#k').value.trim(),model:$('#m').value.trim(),prov:$('#prov').value,base:$('#bu').value.trim(),px:$('#px').value.trim(),handle:$('#h').value.trim(),hook:$('#w').value.trim(),tg:$('#tg').value.trim(),pk:$('#pk').value.trim(),rules:$('#r').value});toast('Salvo')};
$('#niche').onkeydown=e=>{if(e.key=='Enter')$('#go').click()};rate();

/* v2: IA gratuita, imagens, fontes, tema, PWA, Telegram */
Object.assign(S,{font:'Unbounded',col:'#ffffff',st:true,bg:null,a:null});
const FONTS=['Unbounded','Bangers','Anton','Bebas Neue','Permanent Marker','Lilita One','Luckiest Guy'];
$$('.txtbar').forEach(b=>b.innerHTML=`<select class="fsel" aria-label="Fonte da legenda">${FONTS.map(f=>`<option style="font-family:'${f}'">${f}</option>`).join('')}</select><label class="inl">Cor <input type="color" class="fcol" value="#ffffff"></label><label class="inl"><input type="checkbox" class="fst" checked> Contorno</label>`);
document.addEventListener('input',e=>{const t=e.target;if(t.matches('.fsel'))S.font=t.value;else if(t.matches('.fcol'))S.col=t.value;else if(t.matches('.fst'))S.st=t.checked;else return;$$('.fsel').forEach(x=>x.value=S.font);$$('.fcol').forEach(x=>x.value=S.col);$$('.fst').forEach(x=>x.checked=S.st);document.fonts.load(`40px "${S.font}"`).then(drawImg)});
const loadImg=(u,cors=true)=>new Promise(r=>{const i=new Image();if(cors)i.crossOrigin='anonymous';i.taint=!cors;i.onload=()=>r(i);i.onerror=()=>r(null);i.src=u});
async function auto(){const t=S.topic,box=$('#an');S.imgs=[];box.hidden=false;box.innerHTML='<p class="mut">A IA está pesquisando e analisando…</p>';let a;
try{a=await ai(`Assunto: "${t.title}". Nicho: ${S.niche}. Rede: ${$('#pf').value}. Seja objetivo. Responda só JSON: {"kw":["3 termos de pesquisa de fotos em inglês"],"img":"prompt em inglês para gerar imagem sem texto: cena, estilo, luz, composição","hora":"melhor horário no Brasil","melhorar":["2 ações curtas para o post"],"cap":"legenda de anúncio com até 6 palavras em português","vid":"1 dica objetiva de edição de vídeo"}`,{json:1,sys:[await agent('social-media-strategist'),await agent('image-prompt-engineer'),await agent('video-optimization')].join('\n---\n')})}catch{a={kw:[t.title,S.niche],img:`${t.title}, ${S.niche}, modern editorial illustration, vibrant colors, no text`,hora:'18h às 21h',melhorar:['Abra com número ou pergunta','Termine pedindo um comentário'],cap:(S.p?.hook||t.title).slice(0,40),vid:'Mostre o gancho nos primeiros 3 segundos'}}
S.a=a;$('#ip').value=a.img;$('#cap').value=a.cap;box.innerHTML=`<h2>Análise da IA</h2><ul><li>Pesquise por: ${a.kw.join(' · ')}</li><li>Melhor horário: ${a.hora}</li>${a.melhorar.map(x=>`<li>${x}</li>`).join('')}<li>Vídeo: ${a.vid}</li></ul>`;aiImg();photos()}
async function photos(){const k=S.a?.kw?.[0]||S.topic?.title||S.niche;if(!k)return toast('Escolha um assunto antes');let r=[];
try{const d=await(await fetch(`https://api.openverse.org/v1/images/?q=${encodeURIComponent(k)}&page_size=8&license_type=commercial`)).json();r=d.results.map(x=>({u:x.thumbnail||x.url,by:`${x.creator||'autor desconhecido'} (${x.license||'CC'})`}))}catch{}
if(!r.length)try{const d=await(await fetch(`https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrnamespace=6&gsrlimit=8&gsrsearch=${encodeURIComponent(k)}&prop=imageinfo&iiprop=url&iiurlwidth=1080&format=json&origin=*`)).json();r=Object.values(d.query.pages).filter(p=>p.imageinfo?.[0]?.thumburl).map(p=>({u:p.imageinfo[0].thumburl,by:'Wikimedia Commons'}))}catch{}
const g=$('#gal');g.innerHTML=r.length?'':'<span class="mut">Nenhuma foto encontrada.</span>';r.forEach(p=>{const b=document.createElement('button');b.innerHTML=`<img src="${p.u}" alt="${k}" loading="lazy">`;b.onclick=async()=>{const i=await loadImg(p.u);if(i){S.bg=i;S.imgs=[];drawImg();$('#credit').textContent='Foto: '+p.by}else toast('Esta foto não permite edição')};g.append(b)})}
$('#aiimg').onclick=aiImg;$('#ph').onclick=photos;$('#nobg').onclick=()=>{S.bg=null;$('#credit').textContent='';drawImg()};
function theme(t){document.documentElement.dataset.theme=t;st.set('theme',t);$('#th').textContent=t=='light'?'☾ Escuro':'☀ Claro';document.querySelector('meta[name=theme-color]').content=t=='light'?'#F6F2FF':'#12102B'}
$('#th').onclick=()=>theme(document.documentElement.dataset.theme=='light'?'dark':'light');theme(st.get('theme','dark'));
const ac=st.get('ac');if(ac){$('#ac').value=ac;document.documentElement.style.setProperty('--pk',ac)}$('#ac').oninput=e=>{document.documentElement.style.setProperty('--pk',e.target.value);st.set('ac',e.target.value)};
let ip;addEventListener('beforeinstallprompt',e=>{e.preventDefault();ip=e;$('#it').textContent='Abre em tela cheia, como app.';$('#inst').hidden=false});
$('#ib').onclick=async()=>{if(ip){ip.prompt();ip=null;$('#inst').hidden=true}};
if(/iphone|ipad|ipod/i.test(navigator.userAgent)&&!matchMedia('(display-mode: standalone)').matches){$('#it').textContent='Toque em Compartilhar no Safari e depois em “Adicionar à Tela de Início”.';$('#ib').hidden=true;$('#inst').hidden=false}
if('serviceWorker'in navigator)addEventListener('load',()=>navigator.serviceWorker.register('sw.js').catch(()=>{}));
let tgOn=false;$('#tgb').onclick=async()=>{const c=cfg();if(!c.tg)return toast('Cole o token do bot em Ajustes');tgOn=!tgOn;$('#tgb').textContent=tgOn?'Desligar bot Telegram':'Ligar bot Telegram';let off=0;
while(tgOn){try{const d=await(await fetch(`https://api.telegram.org/bot${c.tg}/getUpdates?timeout=25&offset=${off}`)).json();for(const u of d.result||[]){off=u.update_id+1;const m=u.message?.text;if(m){const a=await reply(m);bub(m,'me');bub(a,'bot');await fetch(`https://api.telegram.org/bot${c.tg}/sendMessage`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({chat_id:u.message.chat.id,text:a})})}}}catch{await new Promise(r=>setTimeout(r,3000))}}};

/* v3: análise de vídeo por IA */
async function frames(v,n=6){const c=document.createElement('canvas'),x=c.getContext('2d'),k=512/Math.max(v.videoWidth,v.videoHeight);c.width=Math.round(v.videoWidth*k);c.height=Math.round(v.videoHeight*k);const imgs=[],L=[];let br=0;
for(let i=0;i<n;i++){await new Promise(r=>{v.onseeked=r;v.currentTime=Math.min(v.duration-.1,v.duration*(i+.5)/n)});x.drawImage(v,0,0,c.width,c.height);const d=x.getImageData(0,0,c.width,c.height).data,a=[];for(let p=0;p<d.length;p+=16)a.push(.299*d[p]+.587*d[p+1]+.114*d[p+2]);L.push(a);br+=a.reduce((s,y)=>s+y,0)/a.length;imgs.push(c.toDataURL('image/jpeg',.6))}
let mo=0;for(let i=1;i<n;i++)mo+=L[i].reduce((s,y,j)=>s+Math.abs(y-L[i-1][j]),0)/L[i].length;return{imgs,bright:Math.round(br/n),motion:Math.round(mo/(n-1))}}
async function vAnalyze(){const v=$('#vin'),box=$('#va');if(!v.src||!v.videoWidth)return toast('Escolha um vídeo');box.hidden=false;box.innerHTML='<p class="mut">A IA está assistindo o vídeo…</p>';
const f=await frames(v),dur=Math.round(v.duration),vert=v.videoHeight>v.videoWidth,pf=$('#pf').value;v.currentTime=0;let a;
try{a=await ai(`Analise este vídeo (frames em ordem). Dados: duração ${dur}s, ${v.videoWidth}x${v.videoHeight} (${vert?'vertical':'horizontal'}), brilho médio ${f.bright}/255, movimento entre frames ${f.motion}/255. Rede: ${pf}. Nicho: ${S.niche||'geral'}. Seja objetivo. Responda só JSON: {"nota":0-100,"gancho":"1 frase sobre o início","ritmo":"1 frase","qualidade":"1 frase sobre luz e enquadramento","ini":segundo_inicial_do_corte,"fim":segundo_final_do_corte,"legenda":"até 6 palavras","titulo":"","melhorar":["3 ações curtas"],"tags":["5 hashtags"]}`,{json:1,imgs:f.imgs,sys:[await agent('video-optimization'),await agent('short-video-editing-coach')].join('\n---\n')})}
catch{const n=50+(vert?15:0)+(dur>=7&&dur<=45?15:0)+(f.bright>70&&f.bright<190?10:0)+(f.motion>8?10:0);a={nota:n,gancho:'Análise local (IA indisponível): mostre o momento mais forte nos 3 primeiros segundos.',ritmo:f.motion>8?'Ritmo dinâmico.':'Pouca variação: corte mais vezes.',qualidade:f.bright<70?'Vídeo escuro: aumente a luz.':f.bright>190?'Vídeo estourado: reduza o brilho.':'Iluminação adequada.',ini:0,fim:Math.min(dur,30),legenda:$('#cap').value||S.topic?.title?.slice(0,40)||'Veja isso',titulo:'',melhorar:[vert?'Formato vertical ok':'Grave em vertical 9:16',dur>45?'Reduza para até 45s':'Duração adequada','Adicione legenda grande'],tags:[]}}
const ini=Math.max(0,Math.min(+a.ini||0,dur-1)),fim=Math.max(ini+1,Math.min(+a.fim||dur,dur));$('#ss').value=ini;$('#ee').value=fim;if(a.legenda)$('#cap').value=a.legenda;
box.innerHTML=`<h2>Análise do vídeo: nota ${a.nota}/100</h2><ul><li>${a.gancho}</li><li>${a.ritmo}</li><li>${a.qualidade}</li>${(a.melhorar||[]).map(x=>`<li>${x}</li>`).join('')}</ul><p class="mut sm">Aplicado automaticamente: corte de ${ini}s a ${fim}s e legenda “${a.legenda||''}”.${a.titulo?' Título sugerido: '+a.titulo+'.':''}${a.tags?.length?' '+a.tags.map(t=>'#'+String(t).replace(/^#/,'')).join(' '):''}</p>`}
$('#file').addEventListener('change',()=>$('#vin').addEventListener('loadedmetadata',()=>vAnalyze(),{once:true}));$('#vab').onclick=vAnalyze;

/* v4: piloto automático, ganchos A/B, biblioteca, contador, memória */
['Tecnologia','Inteligência artificial','Fitness','Finanças','Games','Marketing digital','Moda','Culinária'].forEach(n=>{const b=document.createElement('button');b.className='chip';b.textContent=n;b.onclick=()=>{$('#niche').value=n;$('#go').click()};$('#nch').append(b)});
$('#pilot').onclick=async()=>{toast('Piloto automático ligado');await $('#go').onclick();$('#topics .topic button')?.click()};
const build=(p,h)=>`${h}\n\n${p.points.map(x=>'• '+x).join('\n')}\n\n${p.cta}\n\n${p.tags.map(x=>'#'+x).join(' ')}`;
function ab(){const p=S.p;if(!p)return;const hs=[p.hook,...(p.alt||[]).slice(0,2)].filter(Boolean),sc=hs.map(h=>{$('#post').value=build(p,h);rate();return+$('#num').textContent}),best=sc.indexOf(Math.max(...sc)),box=$('#ab');
const pick=i=>{p.hook=hs[i];$('#post').value=build(p,hs[i]);rate();keep();[...box.children].forEach((c,j)=>c.classList.toggle('on',j==i))};box.innerHTML='';
hs.forEach((h,i)=>{const b=document.createElement('button');b.className='chip';b.textContent=`Gancho ${'ABC'[i]} · nota ${sc[i]}`;b.title=h;b.onclick=()=>pick(i);box.append(b)});pick(best);toast(`A IA escolheu o gancho ${'ABC'[best]} (maior nota)`)}
function cnt(){const L={ig:2200,tt:2200,x:280,li:3000}[$('#pf').value],n=$('#post').value.length,e=$('#cnt');e.textContent=`${n}/${L} caracteres`;e.style.color=n>L?'var(--pk)':''}
$('#cp').onclick=()=>{navigator.clipboard?.writeText($('#post').value);toast('Texto copiado')};
const lib=()=>st.get('lib',[]);
function showLib(){const L=lib(),b=$('#lib');b.innerHTML=L.length?'':'<p class="mut">Nada salvo ainda. Gere um post e toque em “Salvar na biblioteca”.</p>';
L.forEach((x,i)=>{const e=document.createElement('div');e.className='topic';e.innerHTML='<b></b><span><button>Abrir</button><button>Excluir</button></span><span class="mut sm"></span>';e.querySelector('b').textContent=x.text.split('\n')[0];e.querySelector('.sm').textContent=`${x.niche||'sem nicho'} · nota ${x.score} · ${x.date}`;const[bo,bd]=e.querySelectorAll('button');
bo.onclick=()=>{S.niche=x.niche;S.p=x.p;S.topic=x.topic;$('#post').value=x.text;$('#ctitle').textContent='Assunto: '+(x.topic?.title||'');rate();toast('Post aberto')};bd.onclick=()=>{L.splice(i,1);st.set('lib',L);showLib()};b.append(e)})}
$('#sv').onclick=()=>{const t=$('#post').value;if(!t.trim())return toast('Gere um post antes');const L=lib();L.unshift({text:t,niche:S.niche,p:S.p,topic:S.topic,score:+$('#num').textContent,date:new Date().toLocaleDateString('pt-BR')});st.set('lib',L.slice(0,50));showLib();toast('Salvo na biblioteca')};showLib();
function keep(){st.set('last',{niche:S.niche,text:$('#post').value,p:S.p,topic:S.topic})}
$('#post').addEventListener('input',keep);
const L0=st.get('last');if(L0?.text){S.niche=L0.niche||'';S.p=L0.p;S.topic=L0.topic;$('#niche').value=S.niche;$('#post').value=L0.text;if(S.topic)$('#ctitle').textContent='Assunto: '+S.topic.title;rate()}

/* v5: imagens por IA dinâmicas (fila, estilos, variações, imagem por slide) */
S.imgs=[];S.tx=true;
const STY={'':'','Fotorrealista':'ultra realistic photo, cinematic lighting, 35mm, sharp focus','Ilustração 3D':'3D render, soft studio lighting, vibrant colors, clay style','Neon cyberpunk':'neon cyberpunk, glowing lights, dark background, futuristic','Minimalista':'minimal flat vector illustration, bold shapes, clean background','Arte digital':'epic digital painting, dramatic lighting, highly detailed','Aquarela':'watercolor illustration, soft pastel colors'};
$('#is').innerHTML=Object.keys(STY).map(k=>`<option value="${k}">${k||'Estilo automático'}</option>`).join('');
$('#tx').onchange=e=>{S.tx=e.target.checked;drawImg()};
const timed=(p,ms)=>Promise.race([p,new Promise(r=>setTimeout(()=>r(null),ms))]);
let lastImg=0,qchain=Promise.resolve();const queue=fn=>{const p=qchain.then(fn,fn);qchain=p.catch(()=>{});return p};
function fetchImg(pr,w,h,seed){const c=cfg(),k=Math.min(1,1024/Math.max(w,h));w=Math.round(w*k);h=Math.round(h*k);
return queue(async()=>{const wait=Math.max(0,lastImg+(c.pk?1500:16500)-Date.now());for(let s=Math.ceil(wait/1000);s>0;s--){$('#imgst').textContent=`Aguardando ${s}s: limite do serviço gratuito (com chave Pollinations não há espera).`;await new Promise(r=>setTimeout(r,1000))}
$('#imgst').textContent='Gerando imagem com IA… pode levar até 40s';lastImg=Date.now();const e=encodeURIComponent(pr),u=(c.pk?`https://gen.pollinations.ai/image/${e}?key=${c.pk}&`:`https://image.pollinations.ai/prompt/${e}?`)+`width=${w}&height=${h}&seed=${seed}&nologo=true&model=flux`;
let i=await timed(loadImg(u),70000);if(!i)i=await timed(loadImg(u,false),70000);$('#imgst').textContent=i?'Imagem pronta.':'Serviço ocupado ou limite atingido. Aguarde alguns segundos e tente de novo.';return i})}
const fullPrompt=()=>[$('#ip').value.trim()||S.a?.img||'',STY[$('#is').value]||''].filter(Boolean).join(', ');
const rnd=()=>Math.floor(Math.random()*1e6);
async function aiImg(){const pr=fullPrompt();if(!pr)return toast('Escolha um assunto ou descreva a imagem');const i=await fetchImg(pr,...S.fmt,rnd());if(i){S.bg=i;S.imgs=[];drawImg();toast('Imagem pronta')}else toast('Não foi possível gerar agora')}
$('#var').onclick=async()=>{const pr=fullPrompt();if(!pr)return toast('Escolha um assunto ou descreva a imagem');const g=$('#gal');g.innerHTML='';
for(let n=0;n<4;n++){$('#credit').textContent=`Variação ${n+1} de 4`;const i=await fetchImg(pr,...S.fmt,rnd());if(!i){toast('Serviço ocupado. Tente de novo em instantes');break}
const b=document.createElement('button');b.innerHTML=`<img src="${i.src}" alt="Variação ${n+1}">`;b.onclick=()=>{S.bg=i;S.imgs=[];drawImg()};g.append(b);if(!n){S.bg=i;S.imgs=[];drawImg()}}$('#credit').textContent='Toque em uma variação para usar.'};
$('#all').onclick=async()=>{const pr=fullPrompt(),L=lines();if(!pr)return toast('Escolha um assunto ou descreva a imagem');S.imgs=[];
for(let n=0;n<L.length;n++){$('#credit').textContent=`Slide ${n+1} de ${L.length}`;const i=await fetchImg(`${pr}, scene inspired by: ${L[n].slice(0,90)}`,...S.fmt,rnd());if(!i){toast('Serviço ocupado. Os demais slides ficam com a imagem principal');break}S.imgs[n]=i;drawImg()}$('#credit').textContent=''};

/* v6: pesquisa ampla (Google Notícias + Tendências) e IA à escolha */
const PROV={pollinations:{n:'Gratuita (sem chave)',m:''},gemini:{n:'Google Gemini',m:'gemini-2.0-flash'},openai:{n:'OpenAI (ChatGPT)',m:'gpt-4o-mini',u:'https://api.openai.com/v1'},anthropic:{n:'Anthropic Claude',m:'claude-haiku-5-5'},groq:{n:'Groq',m:'llama-3.3-70b-versatile',u:'https://api.groq.com/openai/v1'},openrouter:{n:'OpenRouter',m:'meta-llama/llama-3.3-70b-instruct:free',u:'https://openrouter.ai/api/v1'},mistral:{n:'Mistral',m:'mistral-small-latest',u:'https://api.mistral.ai/v1'},deepseek:{n:'DeepSeek',m:'deepseek-chat',u:'https://api.deepseek.com/v1'},custom:{n:'Outra ou local (compatível com OpenAI, ex.: Ollama)',m:''}};
async function ai(p,o={}){const c=cfg(),pv=c.prov||(c.key?'gemini':'pollinations'),sys=o.sys||'',im=o.imgs||[],m=c.model||PROV[pv]?.m||'';let x;
if(pv=='gemini'){const r=await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${m}:generateContent?key=${c.key}`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({contents:[{parts:[{text:sys+'\n\n'+p},...im.map(d=>({inline_data:{mime_type:'image/jpeg',data:d.split(',')[1]}}))]}]})});if(!r.ok)throw 0;x=(await r.json()).candidates[0].content.parts[0].text}
else if(pv=='anthropic'){const r=await fetch('https://api.anthropic.com/v1/messages',{method:'POST',headers:{'Content-Type':'application/json','x-api-key':c.key,'anthropic-version':'2023-06-01','anthropic-dangerous-direct-browser-access':'true'},body:JSON.stringify({model:m,max_tokens:1500,system:sys,messages:[{role:'user',content:[...im.map(d=>({type:'image',source:{type:'base64',media_type:'image/jpeg',data:d.split(',')[1]}})),{type:'text',text:p}]}]})});if(!r.ok)throw 0;x=(await r.json()).content[0].text}
else{const u=pv=='pollinations'?'https://text.pollinations.ai/openai':(PROV[pv].u||c.base||'').replace(/\/$/,'')+'/chat/completions',h={'Content-Type':'application/json'};if(pv!='pollinations'&&c.key)h.Authorization='Bearer '+c.key;
const r=await fetch(u,{method:'POST',headers:h,body:JSON.stringify({model:pv=='pollinations'?'openai':m,messages:[{role:'system',content:sys},{role:'user',content:im.length?[{type:'text',text:p},...im.map(d=>({type:'image_url',image_url:{url:d}}))]:p}]})});if(!r.ok)throw 0;x=(await r.json()).choices[0].message.content}
return o.json?JSON.parse(x.match(/[\[{][\s\S]*[\]}]/)[0]):x}
const STOP=new Set('para como mais pela pelo sobre entre depois apos ainda sobre quando onde seus suas nova novo novos novas with from that this have your what when will after about'.split(' '));
const words=t=>[...new Set(t.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9 ]/g,' ').split(/\s+/).filter(w=>w.length>3&&!STOP.has(w)))];
const jac=(a,b)=>{const s=new Set(a),n=b.filter(w=>s.has(w)).length;return n/Math.max(1,a.length+b.length-n)};
async function feed(q){const c=cfg(),rss=q?`https://news.google.com/rss/search?q=${encodeURIComponent(q+' when:7d')}&hl=pt-BR&gl=BR&ceid=BR:pt-419`:'https://trends.google.com/trending/rss?geo=BR';let it=[];
try{if(c.px)it=(await(await fetch(`${c.px.replace(/\/$/,'')}/search?q=${encodeURIComponent(q)}`)).json()).items||[]}catch{}
if(!it.length)try{it=(await(await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rss)}`)).json()).items||[]}catch{}
return it.map(x=>({title:(x.title||'').replace(/\s+-\s+[^-]+$/,'').trim(),date:Date.parse(x.pubDate)||0})).filter(x=>x.title)}
function rank(items,hasQ){const f={},now=Date.now();items.forEach(i=>{i.w=words(i.title);i.w.forEach(w=>f[w]=(f[w]||0)+1)});
items.forEach((i,k)=>{i.sc=hasQ?i.w.reduce((s,w)=>s+f[w]-1,0)+(i.date?Math.max(0,3-(now-i.date)/864e5):0):100-k});items.sort((a,b)=>b.sc-a.sc);
const out=[];for(const i of items){if(out.every(o=>jac(o.w,i.w)<.4))out.push(i);if(out.length==3)break}const mx=out[0]?.sc||1;
return out.map((i,k)=>({title:i.title,heat:Math.max(55,Math.round(98-k*7-(1-i.sc/mx)*15)),ctx:items.filter(o=>o!==i&&jac(o.w,i.w)>=.2).slice(0,3).map(o=>o.title).join(' | ')}))}
$('#go').onclick=async()=>{const n=$('#niche').value.trim();S.niche=n||'assuntos em alta';const box=$('#topics');box.innerHTML='<p class="mut">Pesquisando o que está em alta…</p>';let t=[];
try{t=rank(await feed(n),!!n)}catch{}
if(t.length<3)try{const a=await ai(`Liste 3 assuntos em alta, com potencial de viralizar, sobre "${n||'qualquer tema popular no Brasil'}". Responda só JSON: {"t":["","",""]}`,{json:1});t=[...t,...a.t.map((x,i)=>({title:x,heat:72-i*4}))].slice(0,3)}catch{}
if(t.length<3)t=[...t,...[`O erro nº 1 que iniciantes em ${S.niche} cometem`,`5 ferramentas grátis em ${S.niche} que parecem trapaça`,`O que ninguém conta sobre ${S.niche}`].map((x,i)=>({title:x,heat:70-i*4}))].slice(0,3);
box.innerHTML='';t.forEach(x=>{const e=document.createElement('div');e.className='topic';e.innerHTML='<b></b><button class="pri">Usar</button><span class="mut sm"></span><div class="heat"><i></i></div>';e.querySelector('b').textContent=x.title;e.querySelector('.sm').textContent=`Potencial viral ${x.heat}/100`;e.querySelector('i').style.width=x.heat+'%';e.querySelector('button').onclick=()=>{S.topic=x;$('#ctitle').textContent='Assunto: '+x.title;go('c');gen()};box.append(e)})};
$('#prov').innerHTML=Object.entries(PROV).map(([k,v])=>`<option value="${k}">${v.n}</option>`).join('');
{const c=cfg();$('#prov').value=c.prov||(c.key?'gemini':'pollinations');$('#bu').value=c.base||'';$('#px').value=c.px||''}
function pvUI(){const v=$('#prov').value;$('#kl').hidden=v=='pollinations';$('#bl').hidden=v!='custom';$('#m').placeholder=PROV[v].m||'nome do modelo'}
$('#prov').onchange=()=>{pvUI();$('#m').value=''};pvUI();
