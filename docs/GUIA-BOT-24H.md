# Guia: chatbot 24h no Telegram, Instagram e Messenger

**Como funciona:** a rede social envia a mensagem para um Worker gratuito da Cloudflare, que pede a resposta a uma IA gratuita (Pollinations) e responde ao cliente. Funciona 24h, mesmo com o app fechado.

> Os menus da Cloudflare, do Telegram e da Meta mudam com frequência. Se algum nome for diferente, siga a documentação oficial da plataforma. Este guia não foi testado em contas reais.

## Parte 1 · Telegram (cerca de 10 minutos, sem aprovação)

1. **Criar o bot.** No Telegram, abra **@BotFather**, envie `/newbot`, escolha um nome e um usuário terminado em `bot`. Copie o **token** que ele entrega.
2. **Criar o Worker.** Em dash.cloudflare.com (conta grátis): **Workers & Pages → Create → Create Worker → Deploy**. Clique em **Edit code**, apague tudo, cole o conteúdo de `automacao/cloudflare-worker.js` e clique em **Deploy**. Copie a URL (`https://nome.usuario.workers.dev`).
3. **Guardar os segredos.** No Worker: **Settings → Variables and Secrets → Add** (tipo *Secret*):
   - `TG_TOKEN`: o token do BotFather.
   - `TG_SECRET`: uma senha aleatória qualquer (letras e números).
   - `VERIFY_TOKEN`: outra senha qualquer (usada na Meta).
4. **Ligar o bot ao Worker.** Abra no navegador, trocando os trechos entre `<>`:
   `https://api.telegram.org/bot<TG_TOKEN>/setWebhook?url=<URL_DO_WORKER>&secret_token=<TG_SECRET>`
   A resposta deve conter `"ok":true`.
5. **Testar.** Envie uma mensagem ao seu bot. Se não responder, abra `https://api.telegram.org/bot<TG_TOKEN>/getWebhookInfo` para ver o erro, e veja os **Logs** do Worker.

## Parte 2 · Instagram e Messenger (Meta)

**Requisitos:** conta de Instagram **Profissional** (Comercial ou Criador de conteúdo) ligada a uma **Página do Facebook**, e conta de desenvolvedor em developers.facebook.com.

1. **Criar o app.** Em **Meus apps → Criar app**, tipo *Empresa*. Adicione o produto **Messenger** (e o de mensagens do **Instagram**, se aparecer).
2. **Webhook.** Em *Webhooks*, informe **Callback URL** = URL do Worker e **Verify token** = o valor de `VERIFY_TOKEN`. Clique em verificar e salvar. Assine o campo **messages**.
3. **Token.** Nas configurações do Messenger, gere o **token de acesso da Página** e guarde no Worker como segredo `META_TOKEN`.
4. **Permitir mensagens.** No app do Instagram: **Configurações → Mensagens e respostas de stories → Controles de mensagens conectadas → Permitir acesso a mensagens**.
5. **Testar.** Com o app em modo de desenvolvimento, o bot só responde a quem tem função no app (você e testadores).

**Para responder ao público geral**, a Meta exige **Análise do app** (App Review) com as permissões de mensagens (por exemplo `pages_messaging` e `instagram_manage_messages`) e, em geral, verificação da empresa. Isso depende da Meta, não do Pulso, e pode levar dias.

**WhatsApp** usa a Cloud API, com outro formato de mensagem. O Worker atual não cobre.

## Parte 3 · Ajustes e cuidados
- **Personalidade do bot:** edite a constante `SYS` no Worker (tom, serviços, preços, horário).
- **Segurança:** nunca coloque tokens no código nem no GitHub. Use sempre *Secrets*.
- **Limites:** o plano grátis da Cloudflare tem limite diário de requisições, e a IA gratuita pode ficar lenta ou indisponível. Nesse caso o bot envia uma mensagem padrão.
- **Privacidade:** as mensagens passam por serviços de terceiros (Cloudflare e Pollinations). Avise seus clientes e não trate dados sensíveis pelo bot.
