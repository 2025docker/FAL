export type TransactionType =
  | 'income'
  | 'expense'
  | 'asset_buy'
  | 'asset_sell'
  | 'dca_invest'
  | 'dca_withdraw'
  | 'unlock_savings';

export type SortField = 'date' | 'amount_desc' | 'amount_asc' | 'category' | 'created_at';
export type SortOrder = 'ASC' | 'DESC';

export interface User {
  id: string;
  email: string | null;
  display_name: string | null;
  avatar_url: string | null;
  currency: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface UserSettings {
  id: string;
  user_id: string;
  auto_save_rate: number;
  dca_value: number;
  currency: string;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  type: TransactionType;
  icon: string | null;
  user_id: string | null;
  is_default: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface Transaction {
  id: string;
  user_id: string;
  type: TransactionType;
  amount: number;
  category_id: string | null;
  category_name: string;
  date: string;
  note: string | null;
  currency: string;
  locked_amount: number;
  auto_save_rate: number | null;
  reference_id: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface DcaTransaction {
  id: string;
  user_id: string;
  type: 'dca_invest' | 'dca_withdraw';
  amount: number;
  date: string;
  note: string | null;
  currency: string;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface TransactionFilters {
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

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  limit: number;
  offset: number;
  hasMore: boolean;
}

export interface FinanceKPIs {
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

export interface TransactionCreateInput {
  type: TransactionType;
  amount: number;
  category_name: string;
  category_id?: string | null;
  date: string;
  note?: string | null;
  currency?: string;
  locked_amount?: number;
  auto_save_rate?: number | null;
  reference_id?: string | null;
  metadata?: Record<string, unknown> | null;
}

export interface DcaTransactionCreateInput {
  type: 'dca_invest' | 'dca_withdraw';
  amount: number;
  date: string;
  note?: string | null;
  currency?: string;
  metadata?: Record<string, unknown> | null;
}

export type ValidationRule =
  | { rule: 'positive_amount'; field: string }
  | { rule: 'sufficient_balance'; available: number; required: number }
  | { rule: 'sufficient_locked'; available: number; required: number }
  | { rule: 'sufficient_dca'; available: number; required: number }
  | { rule: 'unlock_limit'; maxUnlock: number }
  | { rule: 'valid_date'; date: string }
  | { rule: 'valid_type'; type: string };

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

export type ModalType =
  | 'income'
  | 'withdraw'
  | 'menu'
  | 'info'
  | 'dca'
  | null;
