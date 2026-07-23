# HM Soluções Empresariais — Landing Page + Painel Admin

Landing page de conversão para o Instagram **HM Soluções Empresariais - Assessoria e Consultoria**, com painel administrativo completo para editar todo o conteúdo do site sem precisar mexer em código.

## ✨ Stack utilizada

- **Next.js 14** (App Router) — simples, escalável, SSR + API Routes no mesmo projeto
- **React 18**
- **Tailwind CSS** — estilização rápida e fácil manutenção
- **Framer Motion** — animações e parallax
- **Recharts** — gráficos de área, barra e pizza
- **next-themes** — modo claro/escuro
- **Armazenamento em JSON** (`data/content.json`) — sem necessidade de banco de dados. Simples de hospedar e fazer manutenção. Pode ser migrado para um banco (Postgres, SQLite, etc.) no futuro sem alterar o front-end, bastando trocar as funções em `lib/content.js`.

- **Preview ao vivo no painel**: enquanto o admin edita, um painel lateral mostra a landing page real (via iframe) sendo atualizada em tempo real, com alternância entre visualização mobile e desktop
  - **Introdução em tela cheia (parallax)**: antes do site, uma tela fixa ("pinned") revela frases de impacto conforme o visitante rola a página; ao final, se abre naturalmente para a landing page. Pode ser ligada/desligada pelo admin, e tem um botão discreto de "Pular introdução"
- **Cores realmente dinâmicas**: a cor primária/secundária definida no admin é injetada como variáveis CSS e usada em todo o Tailwind (`bg-primary`, `text-primary`, etc.), então qualquer alteração de cor se propaga para o site inteiro
- **Depoimentos**: grade responsiva (mais colunas em telas grandes), sem carrossel forçado e sem scroll automático — o usuário rola a página normalmente
- **Parallax**: elementos de fundo do Hero, do CTA final e da seção de Serviços se movem em velocidades diferentes do scroll
- **Ilustração do Hero**: leve, feita em CSS/SVG com Framer Motion (sem WebGL/3D), simulando um painel financeiro — mantém a identidade visual sem pesar no carregamento
- **Seção de Serviços com parallax**: mostra as categorias (Consultoria, MEI, Pessoa Física, Empresas) com fundo em camadas que se movem em velocidades diferentes ao rolar a página — 100% editável pelo admin

## 📁 Estrutura principal

```
app/
  layout.js            → layout raiz (fontes, cores dinâmicas, tema)
  page.js              → monta a landing page com todas as seções
  globals.css          → estilos globais e variáveis de tema
  preview/page.js       → página usada dentro do iframe de preview do admin
  admin/
    login/page.js      → tela de login do painel
    page.js             → painel admin (edita TODO o conteúdo + preview ao vivo)
  api/
    content/route.js    → GET/PUT do conteúdo do site
    login/route.js       → autenticação do admin
    logout/route.js
    upload/route.js      → upload de imagens (fotos, avatars, etc.)
components/            → todos os componentes visuais da landing page
components/admin/      → componentes reutilizáveis do formulário do painel
lib/
  content.js            → leitura/escrita do content.json
  auth.js               → autenticação (Web Crypto / HMAC)
  color.js               → gera variações claras/escuras das cores do tema
data/content.json       → TODO o conteúdo editável do site (fonte única de verdade)
middleware.js            → protege as rotas /admin
public/uploads/           → imagens enviadas pelo painel
```

## 🚀 Como rodar localmente

```bash
# 1. instalar dependências
npm install

# 2. copiar variáveis de ambiente
cp .env.example .env.local
# edite o .env.local e troque a senha e o segredo:
#   ADMIN_PASSWORD=sua-senha-forte
#   AUTH_SECRET=uma-string-bem-grande-e-aleatoria

# 3. ambiente de desenvolvimento
npm run dev
# acesse http://localhost:3000

# 4. build de produção (recomendado testar antes de subir)
npm run build
npm run start
```

## 🔐 Painel administrativo

- Acesse **`/admin`** (redireciona para `/admin/login` se não estiver autenticado).
- A senha é definida pela variável de ambiente `ADMIN_PASSWORD` (arquivo `.env.local`).
- No painel é possível editar:
  - **Introdução**: ligar/desligar e editar as frases de impacto
  - **Cores** do tema (dourado e azul-marinho, refletem em claro e escuro automaticamente)
  - **Navbar**: logo, selo, texto do botão, WhatsApp
  - **Hero**: título, destaque, subtítulo, botões, estatísticas
  - **Sobre**: nome, cargo, biografia, foto (upload), selo, estatísticas
  - **Serviços**: eyebrow, título, subtítulo e as categorias (Consultoria, MEI, Pessoa Física, Empresas) com seus itens
  - **Depoimentos**: adicionar/remover/editar clientes, nota e texto
  - **Gráficos**: pontos do gráfico de área, barras e pizza
  - **FAQ**: adicionar/remover perguntas e respostas
  - **CTA final**: título, subtítulo, número e mensagem do WhatsApp
  - **Rodapé**: texto, Instagram, e-mail, cidade
- Tudo é salvo em `data/content.json` e refletido **instantaneamente** no site ao recarregar a página (não precisa rebuild nem redeploy).

> ⚠️ Importante: como o conteúdo é salvo em um arquivo local (`data/content.json`), a hospedagem escolhida precisa ter **sistema de arquivos com escrita persistente** (ex: VPS, Docker, Railway, Render). Plataformas 100% serverless com filesystem somente-leitura (ex: Vercel no plano padrão) não persistem as alterações entre deploys — nesse caso, o próximo passo natural é trocar `lib/content.js` para ler/escrever em um banco de dados (o restante do projeto não muda).

## 🖼️ Upload de imagens

As imagens enviadas pelo painel (fotos de depoimentos, foto do fundador etc.) são salvas em `public/uploads/` e servidas diretamente pelo Next.js. Tipos aceitos: PNG, JPG, WEBP, SVG, GIF — até 5MB.

## 🎨 Identidade visual

- Cor primária (dourado): `#B38C41`
- Cor secundária (azul-marinho): `#011923`
- Tipografia: **Cormorant Garamond** (títulos, elegante e serifada) + **Jost** (texto, moderna e limpa)
- Modo claro e escuro com as mesmas cores de marca, ajustando fundo/contraste automaticamente

## ✅ Seções da landing page

1. Introdução em tela cheia com parallax de frases de impacto (opcional, editável/desligável)
2. Navbar flutuante, mais compacta ao rolar (nunca gruda nas bordas), com modo claro/escuro
3. Hero com gancho + ilustração leve (painel financeiro em CSS/SVG) e parallax
4. Sobre o fundador (foto, badge, estatísticas)
5. Serviços prestados com efeito parallax (Consultoria, MEI, Pessoa Física, Empresas)
6. Depoimentos em grade responsiva, sem carrossel forçado
7. Resultados/Indicadores com gráficos de área, barra e pizza
8. FAQ em acordeão
9. CTA final para WhatsApp com parallax
10. Rodapé
11. Botão flutuante de WhatsApp (bônus, sempre visível)

## 🔧 Deploy sugerido

Qualquer ambiente Node.js com filesystem persistente funciona bem:
- **VPS** (DigitalOcean, Hetzner, etc.) com PM2 ou Docker
- **Railway** / **Render** (com disco persistente habilitado)
- Rodar via `npm run build && npm run start` (porta padrão 3000, use um proxy reverso como Nginx/Caddy com HTTPS na frente)

## 🔒 Segurança

- Senha do admin nunca fica no código, apenas em variável de ambiente
- Sessão via cookie `httpOnly`, assinado com HMAC-SHA256 (Web Crypto API)
- Rotas de API validam a sessão antes de qualquer escrita
- Recomenda-se trocar `ADMIN_PASSWORD` e `AUTH_SECRET` antes de colocar em produção
