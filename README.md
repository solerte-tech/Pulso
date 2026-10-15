# Pulso · Agência de conteúdo viral

App web 100% gratuito (HTML + CSS + JS, sem servidor): escolha um nicho, veja 3 assuntos em alta, gere o post, receba a nota de potencial viral, crie imagens/carrossel e vídeos, publique e responda mensagens com um chatbot.

## Publicar no GitHub (grátis)
1. Crie um repositório novo e envie **o conteúdo** deste zip (arquivos na raiz).
2. Em **Settings → Pages → Source**, escolha **GitHub Actions** (o workflow já está incluso).
3. Faça push na branch `main`. O app abre em `https://SEU-USUARIO.github.io/NOME-DO-REPO/`.
Para testar local: abra `index.html` no navegador.

## Recursos gratuitos usados
- **Tendências:** API pública do Hacker News (sem chave).
- **IA (opcional):** chave grátis do Google Gemini (aistudio.google.com/apikey), guardada só no seu navegador. Sem chave, o app usa modelos locais de texto.
- **Imagens/vídeo:** Canvas + MediaRecorder do navegador (sem upload para servidores).
- **Publicação:** links de compartilhamento das redes + Web Share (celular) + webhook para Make/Zapier/n8n (planos grátis).

## Limites
- Postar automaticamente exige OAuth e backend de cada rede. Aqui o texto vai pronto para a rede (ou para seu webhook).
- Nota viral é uma heurística de boas práticas, não garante alcance.
- Vídeo sai em MP4 ou WebM conforme o navegador; a edição grava em tempo real.
