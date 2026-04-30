# FAL - Finance & Asset Ledger

> Production-ready fintech tracking system built with React + TypeScript + Supabase + Vercel

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [Complete File Structure](#complete-file-structure)
4. [Database Schema](#database-schema)
5. [Core Engine](#core-engine)
6. [Validation Layer](#validation-layer)
7. [Transaction Factory](#transaction-factory)
8. [Service Layer](#service-layer)
9. [React Hooks](#react-hooks)
10. [UI Components](#ui-components)
11. [Pages & Routing](#pages--routing)
12. [Authentication](#authentication)
13. [Security (RLS)](#security-rls)
14. [Performance](#performance)
15. [Local Dev Setup](#local-dev-setup)
16. [Deployment](#deployment)

---

## Project Overview

FAL is a financial tracking application rebuilt from a single-file HTML/JS/Firebase app into a production-grade system. It tracks income, expenses, assets, DCA (Dollar Cost Averaging), locked savings, and calculates comprehensive financial KPIs.

### Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + TypeScript |
| Build | Vite 5 |
| Styling | Tailwind CSS 3 |
| State/Data | TanStack React Query 5 |
| Backend | Supabase (PostgreSQL + Auth + RLS) |
| Deployment | Vercel |
| Routing | React Router 6 |
| Charts | Recharts 2 |
| Dates | date-fns 3 |

### Key Capabilities

- **Financial Ledger**: Every money movement recorded as an immutable transaction event
- **Auto Savings Locking**: Configurable percentage of income auto-locked
- **DCA Subsystem**: Independent Dollar Cost Averaging tracking
- **Asset Tracking**: Buy/sell assets with net value calculation
- **KPI Dashboard**: 12 financial metrics calculated in real-time
- **Advanced Filtering**: SQL-level filtering with pagination
- **Demo Mode**: Works without Supabase using localStorage
- **Mobile-First**: Responsive design for all screen sizes

---

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     UI Layer (React)                     │
│  DashboardPage  │  LoginPage  │  Components  │  Modals   │
├─────────────────────────────────────────────────────────┤
│                   Hooks & Context Layer                  │
│  useFinance()  │  useUI()  │  useTransactions()  │  Auth │
├─────────────────────────────────────────────────────────┤
│                   Service Layer                          │
│              FinanceService.ts                           │
│     (Supabase queries + localStorage fallback)           │
├─────────────────────────────────────────────────────────┤
│                  Domain Engine Layer                     │
│  FinanceEngine  │  TransactionFactory  │  Validation     │
├─────────────────────────────────────────────────────────┤
│                  Data Layer                              │
│  Supabase (PostgreSQL)  │  localStorage (demo mode)     │
└─────────────────────────────────────────────────────────┘
```

### Data Flow

```
User Action → Modal Form → TransactionFactory.createXxx()
  → Validation.validateXxx() → FinanceService.addTransaction()
    → Supabase Insert → React Query Invalidation → Re-render
      → FinanceEngine.getAllKPIs() → UI Updates
```

### Demo Mode Fallback

When Supabase credentials are not configured, all operations fall back to localStorage:

```
FinanceService → isSupabaseConfigured? → Yes: Supabase API
                                     → No:  localStorage get/set
```

---

## Complete File Structure

```
R:\R-Code\FIAL\Vercel/
│
├── 📦 package.json                          # Dependencies & scripts
├── 📦 tsconfig.json                         # TypeScript config (strict mode)
├── 📦 tsconfig.node.json                    # Node TS config for Vite
├── 📦 vite.config.ts                        # Vite build config + path aliases
├── 📦 tailwind.config.js                    # Tailwind theme + custom colors
├── 📦 postcss.config.js                     # PostCSS + Tailwind plugin
├── 📄 .env                                  # Environment variables (local)
├── 📄 .env.example                          # Template for env vars
├── 📄 index.html                            # Vite entry HTML
├── 📄 index-vite.html                       # Alternate HTML (backup)
│
├── 📂 supabase/
│   └── 📂 migrations/
│       └── 📄 001_initial_schema.sql        # Complete DB schema (500+ lines)
│
├── 📂 public/                               # Static assets
│
└── 📂 src/
    ├── 📄 main.tsx                          # App entry point (ReactDOM + providers)
    ├── 📄 App.tsx                           # Router configuration
    ├── 📄 index.css                         # Tailwind imports + custom styles
    ├── 📄 vite-env.d.ts                     # Vite type declarations
    │
    ├── 📂 types/
    │   ├── 📄 index.ts                      # Application types (20+ interfaces)
    │   └── 📄 database.ts                   # Supabase Database type definition
    │
    ├── 📂 lib/
    │   └── 📄 supabase.ts                   # Supabase client initialization
    │
    ├── 📂 engine/
    │   ├── 📄 FinanceEngine.ts              # Core financial calculations
    │   ├── 📄 validation.ts                 # Input validation rules
    │   └── 📄 transactionFactory.ts         # Transaction creation with business rules
    │
    ├── 📂 services/
    │   └── 📄 FinanceService.ts             # Data access layer (Supabase + local)
    │
    ├── 📂 hooks/
    │   ├── 📄 useFinance.ts                 # Finance data + mutations
    │   └── 📄 useUI.ts                      # UI state hooks (modal, toast, filters)
    │
    ├── 📂 contexts/
    │   └── 📄 AuthContext.tsx               # Supabase Auth provider
    │
    ├── 📂 components/
    │   ├── 📂 layout/
    │   │   ├── 📄 Header.tsx                # App header with actions
    │   │   └── 📄 ProtectedRoute.tsx        # Auth guard wrapper
    │   │
    │   ├── 📂 kpi/
    │   │   ├── 📄 KpiCard.tsx               # Single KPI display card
    │   │   └── 📄 CapitalCard.tsx           # Total capital highlight card
    │   │
    │   ├── 📂 transactions/
    │   │   ├── 📄 TransactionList.tsx       # Scrollable transaction list
    │   │   ├── 📄 TransactionFilters.tsx    # Filter controls (type, date, search)
    │   │   └── 📄 Pagination.tsx            # Page navigation controls
    │   │
    │   ├── 📂 modals/
    │   │   ├── 📄 IncomeModal.tsx           # Add income form
    │   │   ├── 📄 WithdrawModal.tsx         # Add expense/asset/DCA form
    │   │   ├── 📄 MenuModal.tsx             # Export/import/clear/info menu
    │   │   └── 📄 InfoModal.tsx             # KPI formulas guide (accordion)
    │   │
    │   ├── 📂 assets/
    │   │   └── 📄 AssetGrid.tsx             # Quick-buy asset grid (8 assets)
    │   │
    │   └── 📂 common/                       # Reusable UI primitives (empty)
    │
    ├── 📂 pages/
    │   ├── 📄 DashboardPage.tsx             # Main dashboard (all orchestration)
    │   └── 📄 LoginPage.tsx                 # Login/landing page
    │
    └── 📂 utils/
        └── 📄 format.ts                     # Currency, date, icon, export helpers
```

---

## Database Schema

### Tables Overview

| Table | Purpose | Key Fields |
|-------|---------|-----------|
| `users` | User profiles linked to auth | id (FK to auth.users), email, currency |
| `user_settings` | Per-user configuration | auto_save_rate, dca_value, currency |
| `categories` | Transaction categories (normalized) | name, type, icon, is_default |
| `transactions` | Core event log (all money movements) | type, amount, date, locked_amount |
| `dca_transactions` | DCA subsystem event log | type (invest/withdraw), amount, date |

### 1. Users Table

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  display_name TEXT,
  avatar_url TEXT,
  currency TEXT DEFAULT 'IDR' NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  deleted_at TIMESTAMPTZ
);
```

- **PK**: UUID linked to `auth.users`
- **Cascade**: Deletes when auth user deleted
- **Indexes**: `idx_users_email`

### 2. User Settings Table

```sql
CREATE TABLE user_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  auto_save_rate NUMERIC(5, 4) DEFAULT 0.3000 CHECK (auto_save_rate >= 0 AND auto_save_rate <= 1),
  dca_value NUMERIC(15, 2) DEFAULT 0 CHECK (dca_value >= 0),
  currency TEXT DEFAULT 'IDR' NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(user_id)
);
```

- **Constraints**: `auto_save_rate` 0-1 (0%-100%), `dca_value` >= 0
- **Unique**: One settings row per user

### 3. Categories Table

```sql
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN (
    'income', 'expense', 'asset_buy', 'asset_sell',
    'dca_invest', 'dca_withdraw', 'unlock_savings'
  )),
  icon TEXT,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  deleted_at TIMESTAMPTZ,
  UNIQUE(user_id, name, type)
);
```

- **28 default categories** seeded on migration
- **Types**: income, expense, asset_buy, asset_sell, dca_invest, dca_withdraw, unlock_savings
- **Indexes**: `idx_categories_user_id`, `idx_categories_type`

### 4. Transactions Table (CORE)

```sql
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN (
    'income', 'expense', 'asset_buy', 'asset_sell',
    'dca_invest', 'dca_withdraw', 'unlock_savings'
  )),
  amount NUMERIC(15, 2) NOT NULL CHECK (amount > 0),
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  category_name TEXT NOT NULL,
  date DATE NOT NULL,
  note TEXT,
  currency TEXT DEFAULT 'IDR' NOT NULL,
  locked_amount NUMERIC(15, 2) DEFAULT 0 CHECK (locked_amount >= 0),
  auto_save_rate NUMERIC(5, 4),
  reference_id UUID REFERENCES transactions(id) ON DELETE SET NULL,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  deleted_at TIMESTAMPTZ
);
```

**Indexes** (7 total):

| Index | Columns | Purpose |
|-------|---------|---------|
| `idx_transactions_user_id` | user_id | User-scoped queries |
| `idx_transactions_date` | date | Date range filtering |
| `idx_transactions_type` | type | Type filtering |
| `idx_transactions_category` | category_name | Category search |
| `idx_transactions_created_at` | created_at | Chronological ordering |
| `idx_transactions_user_date` | (user_id, date) | Composite: user + date range |
| `idx_transactions_user_type` | (user_id, type) | Composite: user + type filter |
| `idx_transactions_user_deleted` | (user_id, deleted_at) WHERE deleted_at IS NULL | Partial: active records only |

**Fields Explained**:

- `locked_amount`: Amount auto-locked from income (for savings rate calculation)
- `auto_save_rate`: Rate applied at time of income creation (e.g., 0.3 = 30%)
- `reference_id`: Links related transactions (e.g., asset sell references original buy)
- `metadata`: JSONB for arbitrary extensible data
- `deleted_at`: Soft delete (NULL = active)

### 5. DCA Transactions Table

```sql
CREATE TABLE dca_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('dca_invest', 'dca_withdraw')),
  amount NUMERIC(15, 2) NOT NULL CHECK (amount > 0),
  date DATE NOT NULL,
  note TEXT,
  currency TEXT DEFAULT 'IDR' NOT NULL,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  deleted_at TIMESTAMPTZ
);
```

- **Separate subsystem**: DCA tracked independently from main transactions
- **Dual recording**: Each DCA action creates both a `transactions` row AND a `dca_transactions` row
- **Indexes**: `idx_dca_transactions_user_id`, `idx_dca_transactions_date`, `idx_dca_transactions_type`, `idx_dca_transactions_created_at`

### 6. Views and Functions

**`transaction_summary` view**:

```sql
CREATE VIEW transaction_summary AS
SELECT
  user_id,
  COUNT(*) FILTER (WHERE type = 'income') AS income_count,
  COALESCE(SUM(amount) FILTER (WHERE type = 'income'), 0) AS total_income,
  COUNT(*) FILTER (WHERE type = 'expense') AS expense_count,
  COALESCE(SUM(amount) FILTER (WHERE type = 'expense'), 0) AS total_expense,
  ...
FROM transactions
WHERE deleted_at IS NULL
GROUP BY user_id;
```

**`get_transactions_paginated()` RPC function**:

- Supports all filters: type, category, date range, min/max amount, keyword search
- Supports sorting: date, amount_desc, amount_asc, category, created_at
- Returns `total_count` via `COUNT(*) OVER()` window function
- SQL-level filtering (not client-side)
- SECURITY DEFINER (runs with elevated permissions)

### Auto-Trigger: User Profile Creation

```sql
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

Automatically creates `users` and `user_settings` rows when a new user signs up.

---

## Row Level Security (RLS)

All tables have RLS enabled. Policies ensure users can ONLY access their own data.

| Table | SELECT Policy | INSERT Policy | UPDATE Policy | DELETE Policy |
|-------|--------------|---------------|---------------|---------------|
| `users` | auth.uid() = id | auth.uid() = id | auth.uid() = id | — |
| `user_settings` | auth.uid() = user_id | auth.uid() = user_id | auth.uid() = user_id | — |
| `categories` | is_default OR auth.uid() = user_id | — | auth.uid() = user_id | auth.uid() = user_id |
| `transactions` | auth.uid() = user_id | auth.uid() = user_id | auth.uid() = user_id | auth.uid() = user_id |
| `dca_transactions` | auth.uid() = user_id | auth.uid() = user_id | auth.uid() = user_id | auth.uid() = user_id |

**Categories special rule**: Default categories (is_default = true) are visible to all users.

---

## Core Engine

### FinanceEngine (`src/engine/FinanceEngine.ts`)

The central domain logic class. Deterministic, event-driven, no side effects.

#### Constructor

```typescript
constructor(
  transactions: Transaction[],
  dcaTransactions: DcaTransaction[],
  settings: UserSettings
)
```

Filters out soft-deleted records on instantiation.

#### Methods (18 total)

| Method | Return | Formula |
|--------|--------|---------|
| `getIncome()` | `number` | Σ amount WHERE type = 'income' AND category NOT LIKE '%Sale%' |
| `getExpenses()` | `number` | Σ amount WHERE type = 'expense' |
| `getAssetBuys()` | `number` | Σ amount WHERE type = 'asset_buy' |
| `getAssetSells()` | `number` | Σ amount WHERE type = 'asset_sell' |
| `getAssetsValue()` | `number` | max(0, buys - sells) + dcaValue |
| `getDcaValue()` | `number` | settings.dca_value |
| `getDcaInvested()` | `number` | Σ amount WHERE dca.type = 'dca_invest' |
| `getDcaWithdrawn()` | `number` | Σ amount WHERE dca.type = 'dca_withdraw' |
| `getLockedSavings()` | `number` | Σ income.locked_amount - Σ unlock.amount (clamped to 0) |
| `getBalance()` | `number` | income - expenses - assetBuys + assetSells - dcaInvest + dcaWithdraw - locked |
| `getCapital()` | `number` | balance + locked + assets |
| `getSavingsRate()` | `number` | (max(0, balance) + locked) / income * 100 |
| `getAssetRatio()` | `number` | assets / capital * 100 |
| `getDailyAverage()` | `number` | income / unique_income_days |
| `getMonthlyAverage()` | `number` | income / unique_income_months |
| `getIncomeCount()` | `number` | COUNT WHERE type = 'income' |
| `getExpenseCount()` | `number` | COUNT WHERE type = 'expense' |
| `getAssetBuyCount()` | `number` | COUNT WHERE type = 'asset_buy' |
| `getAssetSellCount()` | `number` | COUNT WHERE type = 'asset_sell' |

#### Aggregate Methods

| Method | Return | Description |
|--------|--------|-------------|
| `getAllKPIs()` | `FinanceKPIs` | Returns all 18 metrics as a single object |
| `getTransactionsByMonth()` | `Map<string, {income, expenses}>` | Monthly breakdown for charts |
| `getTransactionsByCategory()` | `Map<string, number>` | Category totals, sorted descending |

#### Decision Methods

| Method | Return | Description |
|--------|--------|-------------|
| `canInvestToDCA(amount)` | `boolean` | amount > 0 AND amount <= balance |
| `canWithdrawFromDCA(amount)` | `boolean` | amount > 0 AND amount <= dcaValue |
| `canUnlockSavings(amount)` | `{can, maxUnlock}` | maxUnlock = min(amount, locked * 0.5) |

#### Design Rules

- **No derived values stored**: All KPIs computed from raw transactions
- **Deterministic**: Same inputs always produce same outputs
- **No double counting**: Asset sales excluded from income
- **Edge-case safe**: Division by zero, negative values, empty arrays handled
- **Immutable**: Engine is read-only after construction

---

## Validation Layer

### Validation Functions (`src/engine/validation.ts`)

#### Individual Validators

| Function | Validates | Error Message |
|----------|-----------|---------------|
| `validatePositiveAmount(amount, field)` | amount > 0 and not NaN | "{field} must be a positive number" |
| `validateDate(date)` | Non-empty, valid date string | "Date is required" / "Invalid date format" |
| `validateType(type)` | Type is one of 7 valid types | "Invalid transaction type: {type}" |
| `validateCategoryName(categoryName)` | Non-empty string | "Category is required" |

#### `validateTransaction(input, balance, locked, dcaValue)`

Validates a `TransactionCreateInput` against current financial state:

| Rule | Condition | Error |
|------|-----------|-------|
| Expense/Asset Buy | balance >= amount | "Insufficient balance. Available: {balance}" |
| DCA Invest | balance >= amount | "Insufficient balance for DCA investment" |
| DCA Withdraw | dcaValue >= amount | "Insufficient DCA value. Available: {dcaValue}" |
| Unlock Savings | locked * 0.5 > 0 | "No locked savings available to unlock" |
| Unlock Limit | amount <= locked * 0.5 | "Cannot unlock more than 50% of locked savings" |
| Locked Amount | >= 0 | "Locked amount cannot be negative" |
| Locked vs Amount | locked <= amount | "Locked amount cannot exceed transaction amount" |

Returns `{ valid: boolean, errors: string[] }`.

#### `validateDcaTransaction(input, balance, dcaValue)`

Same rules for standalone DCA transactions.

#### `validateBatchTransactions(inputs[], balance, locked, dcaValue)`

Validates multiple transactions at once. Returns errors prefixed with "Transaction N: ".

---

## Transaction Factory

### TransactionFactory (`src/engine/transactionFactory.ts`)

Controlled transaction creators that enforce business rules.

#### Constructor

```typescript
constructor(userId: string, currency = 'IDR')
```

#### Methods

##### `createIncome(amount, category_name, settings, options?)`

Creates income transactions with auto-lock logic.

**Logic**:
1. If category contains "Sale" or "Sell" → creates `asset_sell` type (no lock)
2. Otherwise → creates `income` type with `locked_amount = amount * auto_save_rate`
3. If `autoSaveEnabled = false` → locked_amount = 0

**Options**:
- `date` (default: today)
- `note` (default: null)
- `autoSaveEnabled` (default: true)
- `saveRateOverride` (default: settings.auto_save_rate)

**Returns**: `{ transactions: TransactionCreateInput[], validation: { valid, errors } }`

##### `createExpense(amount, category_name, options?)`

Creates expense transaction. No special business rules.

##### `createAssetBuy(amount, category_name, options?)`

Creates asset_buy transaction.

##### `createAssetSell(amount, category_name, options?)`

Creates asset_sell transaction. Auto-appends "Sale" to category name if not present. Supports `reference_id` to link to original buy.

##### `createDcaInvest(amount, options?)`

Creates BOTH:
- `transactions` row (type: 'dca_invest')
- `dca_transactions` row (type: 'dca_invest')

**Returns**: `{ transaction, dcaTransaction, validation }`

##### `createDcaWithdraw(amount, options?)`

Creates BOTH:
- `transactions` row (type: 'dca_withdraw')
- `dca_transactions` row (type: 'dca_withdraw')

##### `createUnlockSavings(amount, currentLocked, options?)`

Creates unlock_savings transaction.

**Logic**:
- `maxUnlock = min(amount, currentLocked * 0.5)`
- If `maxUnlock <= 0` → returns validation error
- Actual unlock amount = `min(amount, maxUnlock)`

##### `validateCreateTransaction(input, transactions, dcaTransactions, settings)`

Validates against actual data by instantiating FinanceEngine.

##### `validateCreateDcaTransaction(input, transactions, dcaTransactions, settings)`

Same for DCA transactions.

---

## Service Layer

### FinanceService (`src/services/FinanceService.ts`)

Dual-mode data access: Supabase when configured, localStorage otherwise.

#### Methods

| Method | Signature | Description |
|--------|-----------|-------------|
| `getTransactions(userId, filters)` | `Promise<PaginatedResult<Transaction>>` | Fetch filtered, sorted, paginated transactions |
| `getAllData(userId)` | `Promise<{transactions, dcaTransactions, settings}>` | Fetch all data in parallel |
| `addTransaction(userId, input)` | `Promise<Transaction>` | Insert single transaction |
| `batchInsertTransactions(userId, inputs)` | `Promise<Transaction[]>` | Insert multiple transactions atomically |
| `addDcaTransaction(userId, input)` | `Promise<DcaTransaction>` | Insert DCA transaction + update settings |
| `updateTransaction(userId, id, updates)` | `Promise<Transaction>` | Soft update (sets updated_at) |
| `deleteTransaction(userId, id)` | `Promise<void>` | Soft delete (sets deleted_at) |
| `updateSettings(userId, updates)` | `Promise<UserSettings>` | Update user settings |
| `syncSettingsDcaValue(userId, value)` | `Promise<void>` | Update DCA value in settings |

#### Filter Support (`TransactionFilters`)

| Filter | Type | Applied At |
|--------|------|-----------|
| `type` | TransactionType | DB-level (Supabase) / array filter (local) |
| `category` | string (partial match) | Client-side ILIKE / includes() |
| `dateFrom` | string (YYYY-MM-DD) | Client-side >= comparison |
| `dateTo` | string (YYYY-MM-DD) | Client-side <= comparison |
| `minAmount` | number | Client-side >= comparison |
| `maxAmount` | number | Client-side <= comparison |
| `keyword` | string (note search) | Client-side ILIKE / includes() |
| `sortBy` | SortField | DB ORDER BY / array sort |
| `sortOrder` | 'ASC' / 'DESC' | DB ORDER BY direction |
| `limit` | number | DB RANGE / array slice |
| `offset` | number | DB RANGE / array slice |

#### Pagination Response

```typescript
interface PaginatedResult<T> {
  data: T[];        // Current page data
  total: number;    // Total matching records
  limit: number;    // Page size
  offset: number;   // Current offset
  hasMore: boolean; // Whether next page exists
}
```

#### LocalStorage Keys

| Key | Content |
|-----|---------|
| `fal_transactions` | Transaction[] array |
| `fal_dca_transactions` | DcaTransaction[] array |
| `fal_settings` | UserSettings object |

---

## React Hooks

### useFinance (`src/hooks/useFinance.ts`)

Primary data hook. Wralls React Query + mutations.

**Returns**:

```typescript
{
  transactions: Transaction[];
  dcaTransactions: DcaTransaction[];
  settings: UserSettings | undefined;
  engine: FinanceEngine | null;
  kpis: FinanceKPIs | null;
  loadingAll: boolean;
  addTransaction: (input) => Promise<Transaction>;
  batchInsertTransactions: (inputs) => Promise<Transaction[]>;
  addDcaTransaction: (input) => Promise<DcaTransaction>;
  deleteTransaction: (id) => Promise<void>;
  isMutating: boolean;
}
```

**Query Keys**:
- `['finance', 'allData', userId]` — all data
- `['finance', 'transactions', userId, filters]` — filtered transactions

**React Query Config**:
- `staleTime`: 5 minutes
- `gcTime`: 30 minutes
- `retry`: 1
- `refetchOnWindowFocus`: false

**Automatic Invalidation**: All mutations invalidate `allData` query on success.

### useTransactions (`src/hooks/useFinance.ts`)

Standalone filtered transactions query.

```typescript
const { data, isLoading } = useTransactions({ type: 'income', limit: 20 });
```

### useUI (`src/hooks/useUI.ts`)

Three UI state hooks:

**useModal()**:
```typescript
{ activeModal: ModalType, openModal(modal), closeModal() }
```

Modal types: `'income' | 'withdraw' | 'menu' | 'info' | 'dca' | null`

**useToast()**:
```typescript
{ toasts: ToastMessage[], showToast(message, type), removeToast(id) }
```

Toast types: `'success' | 'error' | 'info' | 'warning'`
Auto-dismiss: 3 seconds

**useFilters()**:
```typescript
{
  filter, setFilter,         // 'all' | 'income' | 'expense' | 'asset' | 'dca'
  dateFrom, setDateFrom,     // YYYY-MM-DD | null
  dateTo, setDateTo,         // YYYY-MM-DD | null
  sortBy, setSortBy,         // 'date' | 'amount_desc' | 'amount_asc' | 'category'
  keyword, setKeyword,       // search string
  page, setPage,             // page number (0-based)
  pageSize,                  // 20
  resetFilters,
}
```

---

## UI Components

### Layout Components

#### Header (`src/components/layout/Header.tsx`)

- Logo + app name (responsive: subtitle hidden on mobile)
- Auth state display (login button OR user email + logout)
- Action buttons: Menu, +Income, +Withdraw
- Sticky positioning
- Disabled login button when Supabase not configured

#### ProtectedRoute (`src/components/layout/ProtectedRoute.tsx`)

- Redirects to `/login` if no user
- Shows spinner during loading
- Used as wrapper in App.tsx routes

### KPI Components

#### KpiCard (`src/components/kpi/KpiCard.tsx`)

Props: `icon`, `label`, `value`, `sub`, `variant`, `className`

**Variants** (10): income, expense, asset, balance, daily, monthly, savings, locked, dca, ratio

Each variant has unique color scheme:
- Balance card: dynamic border + gradient based on positive/negative value
- Income/Success: green (#10b981)
- Expense/Danger: red (#ef4444)
- Asset/Warning: amber (#f59e0b)
- Daily/Monthly/DCA: indigo (#6366f1)

#### CapitalCard (`src/components/kpi/CapitalCard.tsx`)

Gradient background (primary-600 → primary-700), white text, prominent display.

### Transaction Components

#### TransactionList (`src/components/transactions/TransactionList.tsx`)

- Scrollable container (max-height 400px)
- Each row: icon + category name + note + amount + date + delete button
- Color-coded by type (income=green, expense=red, asset=amber, DCA=indigo)
- Positive/negative prefix on amounts
- Loading spinner state
- Empty state with SVG icon

#### TransactionFilters (`src/components/transactions/TransactionFilters.tsx`)

Filter controls:
- Type buttons: All, In, Out, Asset, DCA
- Sort dropdown: Date, Amount High-Low, Amount Low-High, Category
- Keyword search input
- Date range: From/To date pickers

#### Pagination (`src/components/transactions/Pagination.tsx`)

- Page info: "Page X of Y (N total)"
- Previous/Next buttons (disabled at boundaries)
- Hidden when only 1 page

### Modal Components

#### IncomeModal (`src/components/modals/IncomeModal.tsx`)

Form fields:
- Amount (required)
- Category dropdown (grouped: Income, Asset Sales, DCA, Locked Savings)
- DCA balance info (shown when DCA category selected)
- Lock Savings checkbox + rate input (hidden for DCA/Unlock/Asset Sale)
- Date picker (default: today)
- Note (optional)

Special handling:
- DCA Investment → calls createDcaInvest
- DCA Withdraw → calls createDcaWithdraw
- Unlock Savings → calls createUnlockSavings (with 50% limit check)
- Asset Sale → creates asset_sell (no lock)
- Regular income → creates income with locked_amount

#### WithdrawModal (`src/components/modals/WithdrawModal.tsx`)

Form fields:
- Amount (required)
- Category dropdown (grouped: Expense, Asset, DCA, Locked Savings)
- DCA balance info (shown when DCA category selected)
- Date picker
- Note

Special handling:
- DCA → creates DCA transactions
- Unlock → creates unlock with limit check
- Asset → creates asset_buy
- Other → creates expense

#### MenuModal (`src/components/modals/MenuModal.tsx`)

Menu items:
- Export → download JSON backup
- Import → file picker for JSON restore
- KPI Info → opens info modal
- Clear All → confirms then clears (limited in cloud mode)

#### InfoModal (`src/components/modals/InfoModal.tsx`)

Accordion with 11 KPI explanations:
- Each has icon, title, description, formula, optional note
- Expandable/collapsible
- Highlighted note for income vs asset sale distinction

### Asset Component

#### AssetGrid (`src/components/assets/AssetGrid.tsx`)

8 asset quick-buy buttons:
- House, Gold, Car, Laptop, Phone, Watch, Bike, Jewelry
- Each triggers prompt for amount and date
- Creates asset_buy transaction

### Utility Functions

#### format.ts (`src/utils/format.ts`)

| Function | Purpose |
|----------|---------|
| `formatCurrency(amount, forceFull?)` | "Rp1,234,567" or "Rp1.2M" (mobile short) |
| `formatDate(dateStr)` | "Jan 15" format |
| `getIconForCategory(category)` | Returns emoji icon for any category |
| `exportToJson(data, filename)` | Creates and downloads JSON file |

---

## Pages & Routing

### App.tsx

```
/          → DashboardPage (protected)
/login     → LoginPage (public, redirects to / if logged in)
/*         → DashboardPage (protected catch-all)
```

### DashboardPage (`src/pages/DashboardPage.tsx`)

The main orchestrator. All UI state and business logic coordination.

**State Management**:
- `useFinance()` — data + mutations
- `useModal()` — modal open/close
- `useFilters()` — filter state
- `useToast()` — notifications

**Layout**:
```
┌──────────────────────────────────────────────┐
│  Header (sticky)                              │
├──────────────────────────────────────────────┤
│  KPI Row 1: Income | Expense | Assets | Balance  │
│  KPI Row 2: Daily | Monthly | Savings | Locked | DCA | Ratio │
│  Capital Card (centered)                       │
├──────────────────────────┬───────────────────┤
│  Transaction Card        │  Asset Grid Card  │
│  ┌────────────────────┐  │  ┌─────────────┐  │
│  │ Filters            │  │  │ House Gold  │  │
│  ├────────────────────┤  │  │ Car  Laptop │  │
│  │ Transaction List   │  │  │ Phone Watch │  │
│  ├────────────────────┤  │  │ Bike  Jewelry│  │
│  │ Pagination         │  │  └─────────────┘  │
│  └────────────────────┘  │                   │
└──────────────────────────┴───────────────────┘
│  Modals (overlay)                            │
│  Toasts (bottom-center)                      │
└──────────────────────────────────────────────┘
```

**Event Handlers**:
- `handleIncomeSubmit()` — routes to correct factory method based on category
- `handleWithdrawSubmit()` — routes based on category type
- `handleQuickBuy()` — prompt + asset_buy creation
- `handleDelete()` — confirm + soft delete
- `handleExport()` — JSON download
- `handleFileImport()` — file read + batch insert
- `handleClear()` — confirm + warn (cloud mode limitation)

### LoginPage (`src/pages/LoginPage.tsx`)

- Centered card with logo
- Sign in with Google button (disabled if Supabase not configured)
- Auto-redirect to dashboard if already logged in
- Shows "Continue as Guest" when in demo mode

---

## Authentication

### AuthContext (`src/contexts/AuthContext.tsx`)

**Provider State**:
- `user: User | null` — Supabase auth user
- `loading: boolean` — session check in progress
- `isConfigured: boolean` — Supabase credentials present

**Methods**:
- `signInWithGoogle()` — OAuth redirect flow
- `signOut()` — clears session

**Session Management**:
- `getSession()` on mount
- `onAuthStateChange` subscription for real-time updates
- Auto-subscription cleanup on unmount

### ProtectedRoute

Checks `user` state:
- Loading → spinner
- No user → redirect to `/login`
- Has user → render children

---

## Security

### Row Level Security

Every table has `ENABLE ROW LEVEL SECURITY` activated.

**Policy Matrix**:

| Table | Who Can Read | Who Can Write |
|-------|-------------|---------------|
| users | Only own profile | Only own profile |
| user_settings | Only own settings | Only own settings |
| categories | Default (all) + own | Only own custom categories |
| transactions | Only own | Only own |
| dca_transactions | Only own | Only own |

**No cross-user data leakage**: All policies require `auth.uid() = user_id`.

### Input Validation

All inputs validated at multiple levels:
1. **UI**: Required fields, min/max checks, type constraints
2. **Factory**: Business rule validation (balance, DCA limits, unlock limits)
3. **Validation module**: Formal rule checks before any write
4. **Database**: CHECK constraints (amount > 0, auto_save_rate 0-1, etc.)

### Environment Variables

```
VITE_SUPABASE_URL     # Supabase project URL
VITE_SUPABASE_ANON_KEY  # Public anon key (safe for client)
VITE_APP_NAME         # App display name
VITE_DEFAULT_CURRENCY # Default currency code
```

No secrets committed. `.env.example` provided as template.

---

## Performance

### Database

- **7 indexes** on transactions table for all common query patterns
- **Partial index** on `deleted_at IS NULL` for active-record queries
- **Composite indexes** for user+date and user+type queries
- **RPC function** for server-side filtering and pagination
- **SQL View** for aggregated KPI pre-computation

### Frontend

- **React Query caching**: 5-min stale time, 30-min GC
- **Batched inserts**: Multiple transactions in single mutation
- **Parallel data fetching**: `getAllData` uses `Promise.all` for 3 concurrent queries
- **Pagination**: 20 items per page, offset-based
- **CSS transitions**: Hardware-accelerated transforms

### Build

- **Vite**: Fast HMR, optimized production bundle
- **Bundle size**: ~481KB JS (136KB gzipped), ~23KB CSS (4.5KB gzipped)
- **Tree-shaking**: Only used code included
- **Code splitting**: Route-based lazy loading ready

---

## Local Dev Setup

### Prerequisites

- Node.js 18+
- npm or pnpm

### Quick Start (Demo Mode)

```bash
# 1. Navigate to project
cd R:\R-Code\FIAL\Vercel

# 2. Install dependencies
npm install

# 3. Start dev server
npm run dev
```

App opens at `http://localhost:3000` — fully functional with localStorage.

### With Supabase

```bash
# 1. Create Supabase project at https://supabase.com

# 2. Run SQL migration
# Go to SQL Editor → paste supabase/migrations/001_initial_schema.sql → Run

# 3. Enable Google Auth
# Authentication → Providers → Google → enable with OAuth credentials

# 4. Update .env
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_ANON_KEY

# 5. Start
npm run dev
```

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server (localhost:3000, auto-open) |
| `npm run build` | Type check + production build |
| `npm run preview` | Preview production build locally |
| `npm run lint` | ESLint check |
| `npm run typecheck` | TypeScript type check only |

---

## Deployment

### Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
vercel env add VITE_SUPABASE_URL
vercel env add VITE_SUPABASE_ANON_KEY
```

Or connect GitHub repo to Vercel for automatic deployments.

### Build Output

Production build creates `dist/` directory:

```
dist/
├── index.html
└── assets/
    ├── index-[hash].css    # ~23KB
    └── index-[hash].js     # ~481KB
```

### Environment Variables for Production

Set in Vercel project settings:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ... (your anon key)
```

Never set `SUPABASE_SERVICE_ROLE_KEY` on the client.

---

## Transaction Types Reference

| Type | Direction | Effect on Balance | Effect on Assets | Effect on DCA | Effect on Locked |
|------|-----------|-------------------|------------------|---------------|------------------|
| `income` | + | +amount (minus locked) | — | — | +locked_amount |
| `expense` | - | -amount | — | — | — |
| `asset_buy` | - | -amount | +amount | — | — |
| `asset_sell` | + | +amount | -amount | — | — |
| `dca_invest` | - | -amount | +amount | +amount | — |
| `dca_withdraw` | + | +amount | -amount | -amount | — |
| `unlock_savings` | + | +amount | — | — | -amount |

## KPI Formulas Reference

| KPI | Formula |
|-----|---------|
| **Balance** | Income - Expenses - Asset Buys + Asset Sells - DCA Invest + DCA Withdraw - Locked |
| **Capital** | Balance + Locked + Assets |
| **Assets** | max(0, Asset Buys - Asset Sells) + DCA Value |
| **Savings Rate** | (max(0, Balance) + Locked) / Income × 100 |
| **Asset Ratio** | Assets / Capital × 100 |
| **Daily Average** | Income / Unique Income Days |
| **Monthly Average** | Income / Unique Income Months |

---

## TypeScript Types Reference

```typescript
// All transaction types
type TransactionType =
  | 'income'
  | 'expense'
  | 'asset_buy'
  | 'asset_sell'
  | 'dca_invest'
  | 'dca_withdraw'
  | 'unlock_savings';

// Sort options
type SortField = 'date' | 'amount_desc' | 'amount_asc' | 'category' | 'created_at';
type SortOrder = 'ASC' | 'DESC';

// Filter interface
interface TransactionFilters {
  type?: TransactionType | null;
  category?: string | null;
  dateFrom?: string | null;
  dateTo?: string | null;
  minAmount?: number | null;
  maxAmount?: number | null;
  keyword?: string | null;
  sortBy?: SortField;
  sortOrder?: SortOrder;
  limit?: number;
  offset?: number;
}

// KPI output
interface FinanceKPIs {
  totalIncome: number;
  totalExpenses: number;
  totalAssetBuys: number;
  totalAssetSells: number;
  assetsValue: number;
  dcaValue: number;
  dcaInvested: number;
  dcaWithdrawn: number;
  lockedSavings: number;
  balance: number;
  capital: number;
  savingsRate: number;
  assetRatio: number;
  dailyAverage: number;
  monthlyAverage: number;
  incomeCount: number;
  expenseCount: number;
  assetBuyCount: number;
  assetSellCount: number;
}
```

---

## Migration from Firebase

### What Changed

| Firebase (Old) | Supabase (New) |
|---------------|----------------|
| Firestore document per user | PostgreSQL normalized tables |
| Client-side filtering | Server-side SQL filtering |
| No RLS | Strict Row Level Security |
| Single file HTML/JS | React + TypeScript modular |
| No validation layer | Multi-level validation |
| No pagination | Offset-based pagination |
| localStorage primary | PostgreSQL primary + localStorage fallback |
| No types | Full TypeScript |

### What Stayed the Same

- All KPI formulas unchanged
- Same transaction types
- Same UI layout and behavior
- Same demo mode capability
- Same import/export functionality
- Same auto-save locking logic
- Same DCA subsystem
- Same 50% unlock limit rule
