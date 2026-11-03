# Deploy — Neon, Render e Vercel

Ordem: **Neon** (banco) → **Render** (API) → **Vercel** (site) → voltar no Render para liberar o CORS.

Antes de começar, o código precisa estar no GitHub (`git push`). Render e Vercel puxam de lá.

---

## 1. Neon (banco PostgreSQL)

1. Crie uma conta em <https://neon.tech> e clique em **New Project**.
2. Nome: `acai-da-orla`. Região: **AWS US East (N. Virginia)** — a mesma região da API no Render, para os dois conversarem rápido.
3. No painel do projeto, clique em **Connect**.
4. **Desligue** a opção **Connection pooling** e copie a URL. Ela tem este formato:
   ```
   postgresql://usuario:senha@ep-xxxx.us-east-1.aws.neon.tech/neondb?sslmode=require
   ```
   Guarde essa URL: ela é o `DATABASE_URL`. Não cole ela em nenhum arquivo do repositório.

> Por que sem pooling? As migrations do Prisma precisam de conexão direta. Para o tamanho deste projeto, a mesma URL direta serve também para a API.

---

## 2. Render (API)

### Opção A — Blueprint (usa o `render.yaml` do repositório)

1. Em <https://render.com>, clique em **New → Blueprint** e escolha o repositório.
2. O Render lê o `render.yaml` e mostra o serviço `acai-da-orla-api`. Ele pede os valores marcados como secretos:
   - `DATABASE_URL` → a URL do Neon.
   - `CORS_ORIGIN` → por enquanto `http://localhost:5173` (troca no passo 4).
   - `JWT_SECRET` → o Render gera sozinho.
3. Clique em **Apply**.

### Opção B — Manual

1. **New → Web Service**, escolha o repositório.
2. Preencha:

   | Campo | Valor |
   |---|---|
   | Root Directory | `api` |
   | Runtime | Node |
   | Region | Virginia (US East) |
   | Build Command | `npm run render:build` |
   | Start Command | `npm run start:prod` |
   | Instance Type | Free |

3. Em **Environment**, adicione:

   | Variável | Valor |
   |---|---|
   | `DATABASE_URL` | URL do Neon |
   | `JWT_SECRET` | rode `openssl rand -base64 48` no terminal e cole o resultado |
   | `JWT_EXPIRES_IN` | `1d` |
   | `CORS_ORIGIN` | `http://localhost:5173` (troca no passo 4) |

4. Em **Settings → Health Check Path**, coloque `/cardapio`.

### O que o build faz

`npm run render:build` = instala as dependências → gera o client do Prisma → compila o Nest → `prisma migrate deploy` (cria as tabelas no Neon). O `migrate deploy` só aplica migrations que faltam; nunca apaga nada.

Quando terminar, abra `https://SEU-SERVICO.onrender.com/docs`. O Swagger deve aparecer (o cardápio ainda vem vazio: o seed é o próximo passo).

### Seed em produção (só uma vez)

O seed **apaga tudo e recria** o cardápio de exemplo e o admin. Por isso ele **não** roda no build. Rode do seu computador, apontando para o Neon:

```bash
cd api
DATABASE_URL="URL_DO_NEON" npm run prisma:seed
```

A variável escrita na linha de comando vale mais que a do `.env`, então o seed vai para o Neon e não para o banco local.

- Login de demonstração: `admin@acaidaorla.com` / `admin123`.
- Para usar outra senha: `DATABASE_URL="..." ADMIN_SENHA="outra-senha" npm run prisma:seed`.
- Para **resetar a demo** (se visitantes bagunçarem o cardápio), rode o mesmo comando de novo. Ele apaga também os pedidos.

Teste: `https://SEU-SERVICO.onrender.com/cardapio` deve devolver as 3 categorias.

> Plano gratuito do Render: a API "dorme" depois de 15 minutos sem acesso e leva ~50 segundos para acordar na primeira chamada. É normal.

---

## 3. Vercel (site)

1. Em <https://vercel.com>, clique em **Add New → Project** e importe o repositório.
2. Preencha:

   | Campo | Valor |
   |---|---|
   | Root Directory | `web` |
   | Framework Preset | Vite |
   | Build Command | `npm run build` (padrão) |
   | Output Directory | `dist` (padrão) |

3. Em **Environment Variables**:

   | Variável | Valor |
   |---|---|
   | `VITE_API_URL` | `https://SEU-SERVICO.onrender.com` (sem `/` no fim) |
   | `VITE_WHATSAPP_NUMERO` | `5571999999999` (ou outro número, só dígitos com DDI) |

4. Clique em **Deploy**.

O `web/vercel.json` faz qualquer endereço (`/admin`, `/produto/3`) abrir o `index.html`. Sem ele, dar F5 em `/admin` daria 404.

> As variáveis `VITE_` entram no site **na hora do build**. Se mudar alguma, faça um **Redeploy** na Vercel.

---

## 4. Liberar o site no CORS

1. Copie a URL do site na Vercel (ex.: `https://cardapio-acai.vercel.app`).
2. No Render, em **Environment**, troque `CORS_ORIGIN` por ela. Para aceitar também o local:
   ```
   https://cardapio-acai.vercel.app,http://localhost:5173
   ```
   Sem `/` no fim de cada endereço.
3. Salve. O Render reinicia a API sozinho.

---

## 5. Conferir

- [ ] `https://SEU-SITE.vercel.app` mostra o cardápio.
- [ ] Montar um açaí, finalizar e ver a tela de confirmação com o botão do WhatsApp.
- [ ] `https://SEU-SITE.vercel.app/admin` → login → o pedido aparece.
- [ ] Mudar o status e marcar um produto como esgotado.
- [ ] `https://SEU-SERVICO.onrender.com/docs` abre o Swagger.
- [ ] Atualizar os links no topo do `README.md`.

## Problemas comuns

| Sintoma | Causa provável |
|---|---|
| Site mostra "Sem conexão com o servidor" | API dormindo (espere ~1 min) ou `VITE_API_URL` errado (corrija e faça Redeploy). |
| Erro de CORS no console do navegador | `CORS_ORIGIN` no Render diferente da URL da Vercel (confira `https` e a barra no fim). |
| Build no Render falha no `migrate deploy` | `DATABASE_URL` errado, ou URL com pooling ligado. |
| Login dá 401 em produção | O seed ainda não rodou no Neon. |
| F5 em `/admin` dá 404 na Vercel | Root Directory não é `web` (o `vercel.json` fica lá dentro). |
