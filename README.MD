# Ticket Hub

Plataforma de venda de ingressos para eventos e filmes, com três perfis de acesso: **Organizador**, **Cliente** e **Portaria**.  
O projeto foi desenvolvido como desafio técnico, com integração real ao **TMDb** e à **Ticketmaster Discovery** para importação de filmes e eventos.

## Demo

- Frontend: [https://ticket-hub-bay.vercel.app](https://ticket-hub-bay.vercel.app)
- Backend (API): [https://ticket-hub-nqn2.onrender.com/api](https://ticket-hub-nqn2.onrender.com/api)

> **Observação:** o backend está hospedado no plano gratuito do Render, que entra em modo de inatividade após cerca de 15 minutos sem uso. Por isso, a primeira requisição após um período parado pode levar entre 30 e 60 segundos para responder.

## Objetivo

O Ticket Hub simula o fluxo principal de uma plataforma de ingressos:

- importação de eventos e filmes por APIs externas;
- criação de sessões com mapa de assentos;
- compra de ingressos com proteção contra concorrência;
- geração de código de validação;
- check-in na entrada com bloqueio de reuso do ingresso.

## Stack

| Camada | Tecnologia |
|---|---|
| Backend | Node.js + Express |
| Banco | PostgreSQL (Neon) |
| ORM | Prisma |
| Frontend | React + Vite + Tailwind CSS |
| Testes | Jest + Supertest |
| Containerização | Docker + Docker Compose |
| Deploy | Render (backend) + Vercel (frontend) |

## Perfis de acesso

- **Organizador:** busca filmes/eventos externos, importa para a plataforma e cria sessões.
- **Cliente:** escolhe sessão, reserva assento, conclui compra e acessa seus ingressos.
- **Portaria:** valida o ingresso na entrada e impede reentrada com o mesmo código.

## Modelagem do banco

### Relacionamentos

- User (1) -> (N) Event [organiza]
- User (1) -> (N) Order [compra]
- User (1) -> (N) Ticket [possui]
- User (1) -> (N) CheckIn [valida, como portaria]
- Event (1) -> (N) Session
- Session (1) -> (1) SeatMap
- Session (1) -> (N) Ticket
- Order (1) -> (N) Ticket
- Ticket (1) -> (0..1) CheckIn

### Entidades principais

- **User:** id, nome, email, senha, role (`ORGANIZADOR | CLIENTE | PORTARIA`)
- **Event:** id, titulo, tipo (`FILME | SHOW`), sourceApi (`TMDB | TICKETMASTER`), externalId, status (`RASCUNHO | PUBLICADO`), organizadorId
- **Session:** id, data, local, eventId
- **SeatMap:** id, layout (JSON com fileiras/assentos e status), sessionId
- **Order:** id, valorTotal, status (`PENDENTE | PAGO | CANCELADO`), clienteId
- **Ticket:** id, assento, status (`RESERVADO | PAGO | VALIDADO | CANCELADO`), qrCode, shareToken, sessionId, clienteId, orderId
- **CheckIn:** id, dataHora, ticketId, portariaId

## Como rodar localmente

### Pré-requisitos

- Node.js 20+
- Conta gratuita no [Neon](https://neon.tech) para PostgreSQL, ou outro banco Postgres acessível por connection string
- Chave de API do [TMDb](https://www.themoviedb.org/documentation/api)
- Chave de API da [Ticketmaster Discovery](https://developer.ticketmaster.com/)
- Docker Desktop (opcional)

### 1. Banco de dados

Crie um projeto no Neon e copie sua connection string no formato:

```env
postgresql://usuario:senha@host/banco?sslmode=require
```

Essa string será usada em `DATABASE_URL`.

### 2. Backend

```bash
cd backend
npm install
```

Crie um arquivo `.env` dentro de `backend/`:

```env
DATABASE_URL="postgresql://usuario:senha@host/banco?sslmode=require"
TMDB_API_KEY="sua_chave_aqui"
TICKETMASTER_API_KEY="sua_chave_aqui"
JWT_SECRET="qualquer_string_secreta_longa"
PORT=3000
FRONTEND_URL="http://localhost:5173"
```

Depois rode:

```bash
npx prisma migrate dev
npx prisma db seed
npm run dev
```

Backend disponível em:

```txt
http://localhost:3000
```

### 3. Frontend

```bash
cd frontend
npm install
```

Crie um arquivo `.env` dentro de `frontend/`:

```env
VITE_API_URL="http://localhost:3000/api"
```

Depois rode:

```bash
npm run dev
```

Frontend disponível em:

```txt
http://localhost:5173
```

### 4. Rodando via Docker

Com o `.env` do backend já configurado, na raiz do projeto rode:

```bash
docker compose up --build
```

Aplicação disponível em:

- Backend: `http://localhost:3000`
- Frontend: `http://localhost:8080`

## Testando a API

### Registrar usuário

**POST** `/auth/register`

```json
{
  "nome": "Gabriel",
  "email": "gabriel@email.com",
  "senha": "123456",
  "role": "CLIENTE"
}
```

### Fazer login

**POST** `/auth/login`

```json
{
  "email": "gabriel@email.com",
  "senha": "123456"
}
```

### Resposta esperada

- dados do usuário;
- token JWT.

### Acessar rota protegida

**GET** `/users/me`

Header:

```txt
Authorization: Bearer SEU_TOKEN_AQUI
```

## Dados de teste

Após rodar:

```bash
npx prisma db seed
```

os usuários abaixo já estarão disponíveis, todos com senha `123456`:

| Perfil | E-mail | Observação |
|---|---|---|
| Organizador | organizador@tickethub.com | Dono do evento publicado abaixo |
| Cliente 1 | cliente1@tickethub.com | Já possui 1 ingresso comprado (assento A1) |
| Cliente 2 | cliente2@tickethub.com | Sem ingressos, para testar nova compra |
| Portaria | portaria@tickethub.com | Use para validar o ingresso do Cliente 1 |

O seed também cria um evento publicado chamado **Campo de Silêncio**, com uma sessão e 40 assentos disponíveis.

## Fluxo sugerido para avaliação

1. Login como `cliente2@tickethub.com` para comprar um assento.
2. Login como `portaria@tickethub.com` para validar o código do ingresso.
3. Login como `organizador@tickethub.com` para visualizar o painel com estatísticas de ocupação.

## Fluxo principal do sistema

1. O organizador busca um filme no TMDb ou um evento na Ticketmaster.
2. O sistema importa e salva o evento no banco.
3. O organizador cria sessões, cada uma com mapa inicial de 40 assentos.
4. O cliente escolhe sessão e assento.
5. A reserva acontece em transação no banco, evitando venda dupla do mesmo lugar.
6. O pagamento é simulado com aprovação ou recusa.
7. Se aprovado, o ingresso é emitido com código assinado.
8. A portaria valida o ingresso e o sistema bloqueia reutilização.

## Principais rotas da API

| Método | Rota | Perfil | Descrição |
|---|---|---|---|
| POST | `/auth/register` | Público | Cria usuário |
| POST | `/auth/login` | Público | Autentica e retorna token |
| GET | `/users/me` | Autenticado | Retorna dados do usuário logado |
| GET | `/events/search` | Organizador | Busca eventos/filmes nas APIs externas |
| POST | `/events` | Organizador | Importa e salva evento no banco |
| GET | `/events` | Público | Lista eventos publicados |
| GET | `/events/:id` | Público | Detalhe do evento |
| POST | `/events/:id/sessions` | Organizador | Cria sessão |
| GET | `/sessions/:id/seatmap` | Público | Retorna mapa de assentos |
| POST | `/tickets` | Cliente | Reserva assento e gera ticket |
| GET | `/tickets/me` | Cliente | Lista ingressos do cliente logado |
| POST | `/checkin` | Portaria | Valida ingresso na entrada |

## Testes

No backend, rode:

```bash
cd backend
npm test
```

Os testes cobrem três fluxos críticos:

- login com credenciais inválidas;
- compra de assento já ocupado;
- tentativa de check-in duplicado.

Cada teste cria seus próprios dados e não depende do seed.
## Decisões técnicas

### Por que PostgreSQL?

O sistema possui relacionamentos entre usuários, eventos,
sessões, pedidos, ingressos e check-ins. Por isso optei por
um banco relacional, garantindo integridade referencial e
consistência das operações.

### Por que Prisma?

Utilizei Prisma para facilitar a modelagem, migrations,
relacionamentos e acesso tipado ao PostgreSQL.

### Por que JWT?

A autenticação utiliza JWT para manter a API stateless e
permitir autorização baseada no perfil do usuário.

### Controle de concorrência

A reserva de assentos é realizada dentro de uma transação
para evitar que dois usuários consigam adquirir o mesmo
assento simultaneamente.

### Por que separar frontend e backend?

A separação permite que a API seja consumida por diferentes
clientes no futuro, além de manter responsabilidades
separadas entre apresentação e regras de negócio.

## Limitações conhecidas

- Mapa de assentos em tempo real ainda não está implementado com WebSocket.
- Não existe ação de cancelamento de ingresso após compra confirmada.
- O preço do ingresso é fixo em R$ 30.
- O QR Code visual ainda não é exibido como imagem escaneável por câmera.
- O painel do organizador não possui exportação nem histórico consolidado.
- O backend em plano gratuito do Render sofre cold start.
- Os testes atualmente cobrem os fluxos mais críticos do backend, mas ainda não incluem frontend.

## Melhorias futuras

Algumas evoluções que eu gostaria de implementar nas próximas versões:

### 1. Tratamento mais robusto dos dados

- normalização e validação de strings antes de salvar;
- validação mais cuidadosa de URLs externas;
- sanitização e padronização de campos importados das APIs;
- tratamento mais consistente para campos opcionais, textos vazios e dados incompletos.

### 2. Melhorar a tela de login

- incluir mais contexto visual e informacional;
- reduzir a poluição visual;
- melhorar hierarquia dos elementos;
- tornar a experiência mais clara já no primeiro acesso.

### 3. Evoluir o design geral da aplicação

- revisar consistência visual entre telas;
- melhorar espaçamento, tipografia e contraste;
- deixar a interface mais moderna e coesa;
- refinar feedbacks visuais de ações importantes.

### 4. Outras melhorias que fazem sentido

- implementar atualização de assentos em tempo real com WebSocket;
- adicionar cancelamento de ingresso com regras de negócio;
- permitir preço configurável por sessão ou tipo de evento;
- adicionar relatórios e exportação para organizadores;
- ampliar cobertura de testes, incluindo frontend e integração ponta a ponta;
- incluir paginação, filtros e ordenação mais avançados;
- adicionar observabilidade básica, como logs estruturados e monitoramento de erros.

## Uso de IA

Utilizei ferramentas de IA como apoio durante o desenvolvimento,
principalmente para:

- esclarecer dúvidas sobre APIs e bibliotecas;
- revisar trechos de código;
- investigar possíveis erros;
- discutir alternativas de implementação;
- auxiliar na documentação.

As decisões de arquitetura, modelagem, regras de negócio,
integração entre as partes e validação do funcionamento
foram realizadas/revisadas por mim.

A IA foi utilizada como ferramenta de apoio, não como substituta
da compreensão e validação do código.

## Autor

Gabriel Souza  
[github.com/gabrieelsza](https://github.com/gabrieelsza)
