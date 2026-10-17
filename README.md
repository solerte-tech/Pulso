# Pulso · Agência de conteúdo viral

App web 100% gratuito (HTML + CSS + JS, sem servidor): escolha um nicho, veja 3 assuntos em alta, gere o post, receba a nota de potencial viral, crie imagens/carrossel e vídeos, publique e responda mensagens com um chatbot.

## Publicar no GitHub (grátis)
1. Crie um repositório novo e envie **o conteúdo** deste zip (arquivos na raiz).
2. Em **Settings → Pages → Source**, escolha **GitHub Actions** (o workflow já está incluso).
3. Faça push na branch `main`. O app abre em `https://SEU-USUARIO.github.io/NOME-DO-REPO/`.
Para testar local: abra `index.html` no navegador.

## Recursos gratuitos usados
- **Tendências:** notícias recentes do Google Notícias (qualquer assunto) e “em alta agora” do Google Tendências, via RSS.
- **IA (opcional):** chave grátis do Google Gemini (aistudio.google.com/apikey), guardada só no seu navegador. Sem chave, o app usa modelos locais de texto.
- **Imagens/vídeo:** Canvas + MediaRecorder do navegador (sem upload para servidores).
- **Publicação:** links de compartilhamento das redes + Web Share (celular) + webhook para Make/Zapier/n8n (planos grátis).

## Limites
- Postar automaticamente exige OAuth e backend de cada rede. Aqui o texto vai pronto para a rede (ou para seu webhook).
- Nota viral é uma heurística de boas práticas, não garante alcance.
- Vídeo sai em MP4 ou WebM conforme o navegador; a edição grava em tempo real.

## Novidades (v2)
- **App instalável (PWA):** Android (Chrome ⋮ → Instalar app) e iPhone (Safari → Compartilhar → Adicionar à Tela de Início). Ícone, tela cheia e uso offline do app.
- **IA gratuita sem chave:** textos via Pollinations; imagem gerada por IA conforme o assunto; fotos livres via Openverse e Wikimedia Commons. Chave Gemini é opcional.
- **Agentes:** a pasta `agentes/` traz instruções do repositório agency-agents (Content Creator, Social Media Strategist, Video Optimization, Support Responder, Image Prompt Engineer) usadas como base da IA.
- **Análise automática** ao escolher o assunto: termos de pesquisa, melhor horário, melhorias, legenda de anúncio e dica de vídeo.
- **Legendas chamativas** (7 fontes, cor e contorno) em imagens e vídeos; **tema claro/escuro** e cor de destaque.
- **Chatbot nas redes:** Telegram direto no app (com ele aberto) e `automacao/cloudflare-worker.js` para responder 24h.

## v3
- **Análise de vídeo por IA:** ao subir um vídeo, o app extrai 6 quadros, mede brilho e movimento, envia à IA (Pollinations ou Gemini) e devolve nota, avaliação do gancho, ritmo, qualidade, corte ideal, legenda e título. Corte e legenda são aplicados sozinhos.

## v4
- **Piloto automático**, atalhos de nicho, **3 ganchos com nota** (a IA escolhe o melhor), contador de caracteres por rede, copiar, **biblioteca de posts** e memória do último trabalho.
- Logo e ícone novos. Guia do bot 24h em `docs/GUIA-BOT-24H.md`.

## v5 · imagens por IA
- Fila automática respeitando o limite gratuito (1 imagem a cada ~15 s sem chave). Com chave grátis em enter.pollinations.ai (use a chave pública `pk_`), a espera some.
- Prompt editável, 6 estilos, **4 variações**, **imagem diferente em cada slide do carrossel**, texto sobre a imagem opcional e **zoom animado (Ken Burns)** nos vídeos.

## v6 · pesquisa ampla e IA à escolha
- Qualquer assunto: pesquisa no Google Notícias dos últimos 7 dias, agrupa as manchetes parecidas e ranqueia por cobertura e recência. Campo vazio = o que está em alta no Brasil agora.
- **Provedor de IA à escolha** em Ajustes: gratuito sem chave, Gemini, OpenAI, Claude, Groq, OpenRouter, Mistral, DeepSeek ou qualquer API compatível com OpenAI (inclusive local, como Ollama).
- Proxy de busca opcional no Worker (`/search`) para deixar a pesquisa mais estável.
