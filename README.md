# Arta Ceramics Warehouse Management System

Production-ready SaaS starter for tile warehouse operations with:

- `frontend`: React + Vite + TailwindCSS admin app
- `backend`: Node.js + Express REST API with JWT auth
- `database`: MySQL schema and seed data

## Project Structure

```text
database/
frontend/
backend/
```

## Build Order

1. Import [`database/schema.sql`](C:/Users/PULSE Electronics/OneDrive/Documents/Codex-TestFile/database/schema.sql)
2. Optionally run [`database/seed.sql`](C:/Users/PULSE Electronics/OneDrive/Documents/Codex-TestFile/database/seed.sql)
3. Configure backend `.env`
4. Run `npm install` inside `backend` and `frontend`
5. Run `npm run seed:admin` inside `backend`
6. Configure frontend `.env`
7. Start both apps

## Backend Setup

```bash
cd backend
Copy-Item .env.example .env
npm install
npm run seed:admin
npm run dev
```

Default seeded admin:

- Email: `admin@artaceramics.com`
- Password: `Admin@123`

## Frontend Setup

```bash
cd frontend
Copy-Item .env.example .env
npm install
npm run dev
```

## Core Business Coverage

- Customer debt balances stay in sync with invoices and payments
- Tile stock is reduced automatically after each invoice
- Workers can be tracked with due dates and payment history
- Reports cover daily revenue, monthly performance, debt exposure, profit, and worker payouts
