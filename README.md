# Ahsan Shop — Billing & Finance Management

A production-ready billing, invoicing, and finance management system for a small retail shop selling stationery and school uniforms.

## Tech Stack

- **Frontend**: Next.js 15 (App Router) + TypeScript
- **Styling**: Tailwind CSS v4 + shadcn/ui-style components
- **Database**: Supabase (PostgreSQL + Auth + RLS + Storage)
- **Forms**: React Hook Form + Zod
- **Charts**: Recharts
- **Tables**: TanStack Table
- **Deployment**: Vercel

## User Roles

| Role | Permissions |
|------|-------------|
| **Owner/Admin** | Full access: finances, reports, settings, user management |
| **Cashier/Staff** | Create bills, view products, add customers, take payments |

> Roles are enforced at the **database level** via Supabase Row Level Security, not just UI.

## Getting Started

### 1. Prerequisites

- Node.js 18+
- npm 9+
- A [Supabase](https://supabase.com) project

### 2. Clone & Install

```bash
git clone <repo-url>
cd ahsan-shop
npm install
```

### 3. Environment Variables

Copy the example and fill in your Supabase credentials:

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

> Find these in: Supabase Dashboard → Project → Settings → API

### 4. Database Setup (Run migrations in order)

Go to your Supabase project → **SQL Editor** and run the migrations:

```sql
-- 1. Run schema:
supabase/migrations/001_initial_schema.sql

-- 2. Run seed catalog data:
supabase/migrations/002_seed_data.sql

-- 3. Run admin credentials:
supabase/migrations/003_admin_credentials.sql
```

### 5. Portal Credentials (Sign In)

Public sign-up is disabled for portal security. Use the official administrator credentials:

- **Portal URL**: `http://localhost:3000/auth/login`
- **Username / Email**: `ahsanmukhtiar@gmail.com`
- **Password**: `ahsan12345`
- **Role**: `Owner / Admin` (Full access)

### 6. Development

```bash
npm run dev      # Start dev server at http://localhost:3000
npm run build    # Production build
npm run lint     # Lint check
```

## Project Structure

```
src/
├── app/
│   ├── (app)/                  # Authenticated app routes
│   │   ├── dashboard/          # Home screen with stats
│   │   ├── billing/            # POS / New bill (Phase 3)
│   │   ├── invoices/           # Invoice list (Phase 3)
│   │   ├── products/           # Inventory (Phase 2)
│   │   ├── customers/          # Customer management (Phase 2)
│   │   ├── expenses/           # Expense tracking (Phase 5)
│   │   ├── suppliers/          # Supplier management (Phase 5)
│   │   ├── reports/            # Financial reports (Phase 6)
│   │   └── settings/           # Shop settings (Phase 7)
│   ├── auth/
│   │   ├── login/              # Login page
│   │   └── signup/             # Signup page
│   ├── layout.tsx              # Root layout
│   └── globals.css             # Global styles
├── components/
│   └── layout/
│       └── sidebar.tsx         # Navigation sidebar
└── lib/
    ├── supabase/
    │   ├── client.ts           # Browser Supabase client
    │   ├── server.ts           # Server Supabase client
    │   └── database.types.ts   # TypeScript database types
    ├── actions/
    │   └── auth.ts             # Auth server actions
    ├── contexts/
    │   └── auth-context.tsx    # Auth React context
    └── utils.ts                # Utility functions
supabase/
└── migrations/
    └── 001_initial_schema.sql  # Initial DB schema + RLS
```

## Database Schema

All tables include `created_at`, `updated_at`, `created_by`, and soft-delete (`deleted_at`).  
All money columns use `NUMERIC(12,2)` — never `FLOAT`.

| Table | Purpose |
|-------|---------|
| `profiles` | User accounts linked to `auth.users` |
| `settings` | Shop configuration (singleton row) |
| `categories` | Product categories |
| `products` | Inventory items |
| `product_variants` | Size/color/school variants for uniforms |
| `customers` | Customer ledger |
| `suppliers` | Supplier list |
| `invoices` | Sales invoices |
| `invoice_items` | Line items per invoice |
| `payments` | Payment records |
| `purchases` | Stock purchases from suppliers |
| `purchase_items` | Line items per purchase |
| `expense_categories` | Expense classification |
| `expenses` | Business expenses |
| `stock_movements` | Full audit trail of all stock changes |
| `daily_closings` | End-of-day cash book |
| `audit_logs` | System audit trail |

## Key Database Functions

- `generate_invoice_number()` — atomic sequential invoice numbering
- `finalize_invoice(invoice_id, payment_method, amount_paid, user_id)` — atomic transaction: deducts stock, records payment, updates invoice status

## Deployment to Vercel

1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

## Build Phases

| Phase | Status | Description |
|-------|--------|-------------|
| Phase 1 | ✅ Done | Project setup, schema, auth, roles, base layout |
| Phase 2 | 🔄 Next | Products/inventory & customers |
| Phase 3 | ⏳ Soon | Billing/POS & PDF invoices |
| Phase 4 | ⏳ | Payments, ledger, returns |
| Phase 5 | ⏳ | Expenses, suppliers, purchases |
| Phase 6 | ⏳ | Dashboard, reports, daily closing |
| Phase 7 | ⏳ | Settings, polish, testing |

## Security

- Authentication via Supabase Auth (email + password)
- Row Level Security on **every** table
- Server Actions for all mutations (no direct client writes to sensitive tables)
- Zod validation on both client and server
- No secrets in client-side code
- Environment variables for all credentials
