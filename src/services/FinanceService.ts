import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import type {
  Transaction,
  DcaTransaction,
  UserSettings,
  TransactionFilters,
  PaginatedResult,
  TransactionCreateInput,
  DcaTransactionCreateInput,
} from '@/types';

const STORAGE_KEYS = {
  transactions: 'fal_transactions',
  dcaTransactions: 'fal_dca_transactions',
  settings: 'fal_settings',
};

function getLocalData<T>(key: string): T[] {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function setLocalData<T>(key: string, data: T[]): void {
  localStorage.setItem(key, JSON.stringify(data));
}

function getLocalSettings(): UserSettings {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.settings);
    if (data) return JSON.parse(data);
  } catch {}
  return {
    id: 'local',
    user_id: 'local',
    auto_save_rate: 0.3,
    dca_value: 0,
    currency: 'IDR',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}

function setLocalSettings(settings: UserSettings): void {
  localStorage.setItem(STORAGE_KEYS.settings, JSON.stringify(settings));
}

export class FinanceService {
  async getTransactions(
    userId: string,
    filters: TransactionFilters = {}
  ): Promise<PaginatedResult<Transaction>> {
    if (!isSupabaseConfigured) {
      return this.getLocalTransactions(filters);
    }

    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .is('deleted_at', null)
      .order(filters.sortBy === 'amount_desc' ? 'amount' : filters.sortBy === 'amount_asc' ? 'amount' : filters.sortBy || 'date', {
        ascending: filters.sortBy === 'amount_asc',
      })
      .range(filters.offset || 0, (filters.offset || 0) + (filters.limit || 20) - 1);

    if (error) throw error;

    let filteredData = (data || []) as Transaction[];

    if (filters.type) {
      filteredData = filteredData.filter(t => t.type === filters.type);
    }
    if (filters.category) {
      filteredData = filteredData.filter(t =>
        t.category_name.toLowerCase().includes(filters.category!.toLowerCase())
      );
    }
    if (filters.dateFrom) {
      filteredData = filteredData.filter(t => t.date >= filters.dateFrom!);
    }
    if (filters.dateTo) {
      filteredData = filteredData.filter(t => t.date <= filters.dateTo!);
    }
    if (filters.minAmount != null) {
      filteredData = filteredData.filter(t => t.amount >= filters.minAmount!);
    }
    if (filters.maxAmount != null) {
      filteredData = filteredData.filter(t => t.amount <= filters.maxAmount!);
    }
    if (filters.keyword) {
      filteredData = filteredData.filter(t =>
        t.note?.toLowerCase().includes(filters.keyword!.toLowerCase())
      );
    }

    const total = filteredData.length;

    return {
      data: filteredData,
      total,
      limit: filters.limit || 20,
      offset: filters.offset || 0,
      hasMore: (filters.offset || 0) + (filters.limit || 20) < total,
    };
  }

  private getLocalTransactions(filters: TransactionFilters = {}): PaginatedResult<Transaction> {
    let data = getLocalData<Transaction>(STORAGE_KEYS.transactions);

    if (filters.type) {
      data = data.filter(t => t.type === filters.type);
    }
    if (filters.category) {
      data = data.filter(t =>
        t.category_name.toLowerCase().includes(filters.category!.toLowerCase())
      );
    }
    if (filters.dateFrom) {
      data = data.filter(t => t.date >= filters.dateFrom!);
    }
    if (filters.dateTo) {
      data = data.filter(t => t.date <= filters.dateTo!);
    }
    if (filters.minAmount != null) {
      data = data.filter(t => t.amount >= filters.minAmount!);
    }
    if (filters.maxAmount != null) {
      data = data.filter(t => t.amount <= filters.maxAmount!);
    }
    if (filters.keyword) {
      data = data.filter(t =>
        t.note?.toLowerCase().includes(filters.keyword!.toLowerCase())
      );
    }

    if (filters.sortBy === 'date') {
      data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    } else if (filters.sortBy === 'amount_desc') {
      data.sort((a, b) => b.amount - a.amount);
    } else if (filters.sortBy === 'amount_asc') {
      data.sort((a, b) => a.amount - b.amount);
    } else if (filters.sortBy === 'category') {
      data.sort((a, b) => a.category_name.localeCompare(b.category_name));
    } else {
      data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }

    const total = data.length;
    const limit = filters.limit || 20;
    const offset = filters.offset || 0;
    const paginatedData = data.slice(offset, offset + limit);

    return {
      data: paginatedData,
      total,
      limit,
      offset,
      hasMore: offset + limit < total,
    };
  }

  async getAllData(userId: string): Promise<{
    transactions: Transaction[];
    dcaTransactions: DcaTransaction[];
    settings: UserSettings;
  }> {
    if (!isSupabaseConfigured) {
      return {
        transactions: getLocalData(STORAGE_KEYS.transactions),
        dcaTransactions: getLocalData(STORAGE_KEYS.dcaTransactions),
        settings: getLocalSettings(),
      };
    }

    const [transactionsRes, dcaRes, settingsRes] = await Promise.all([
      supabase
        .from('transactions')
        .select('*')
        .eq('user_id', userId)
        .is('deleted_at', null)
        .order('date', { ascending: false }),
      supabase
        .from('dca_transactions')
        .select('*')
        .eq('user_id', userId)
        .is('deleted_at', null)
        .order('date', { ascending: false }),
      supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', userId)
        .single(),
    ]);

    if (transactionsRes.error) throw transactionsRes.error;
    if (dcaRes.error) throw dcaRes.error;

    return {
      transactions: (transactionsRes.data || []) as unknown as Transaction[],
      dcaTransactions: (dcaRes.data || []) as unknown as DcaTransaction[],
      settings: (settingsRes.data || getLocalSettings()) as unknown as UserSettings,
    };
  }

  async addTransaction(
    userId: string,
    input: Omit<TransactionCreateInput, 'user_id'>
  ): Promise<Transaction> {
    if (!isSupabaseConfigured) {
      return this.addLocalTransaction(input);
    }

    const { data, error } = await supabase
      .from('transactions')
      .insert({
        user_id: userId,
        type: input.type,
        amount: input.amount,
        category_name: input.category_name,
        category_id: input.category_id || null,
        date: input.date,
        note: input.note || null,
        currency: input.currency || 'IDR',
        locked_amount: input.locked_amount || 0,
        auto_save_rate: input.auto_save_rate || null,
        reference_id: input.reference_id || null,
        metadata: input.metadata || null,
      } as any)
      .select()
      .single();

    if (error) throw error;
    return data as unknown as Transaction;
  }

  private addLocalTransaction(input: Omit<TransactionCreateInput, 'user_id'>): Transaction {
    const transactions = getLocalData<Transaction>(STORAGE_KEYS.transactions);
    const newTx: Transaction = {
      id: crypto.randomUUID(),
      user_id: 'local',
      type: input.type,
      amount: input.amount,
      category_name: input.category_name,
      category_id: input.category_id || null,
      date: input.date,
      note: input.note || null,
      currency: input.currency || 'IDR',
      locked_amount: input.locked_amount || 0,
      auto_save_rate: input.auto_save_rate || null,
      reference_id: input.reference_id || null,
      metadata: input.metadata || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      deleted_at: null,
    };
    transactions.unshift(newTx);
    setLocalData(STORAGE_KEYS.transactions, transactions);
    return newTx;
  }

  async batchInsertTransactions(
    userId: string,
    inputs: Omit<TransactionCreateInput, 'user_id'>[]
  ): Promise<Transaction[]> {
    if (!isSupabaseConfigured) {
      return inputs.map(input => this.addLocalTransaction(input));
    }

    const { data, error } = await supabase
      .from('transactions')
      .insert(
        inputs.map(input => ({
          user_id: userId,
          type: input.type,
          amount: input.amount,
          category_name: input.category_name,
          category_id: input.category_id || null,
          date: input.date,
          note: input.note || null,
          currency: input.currency || 'IDR',
          locked_amount: input.locked_amount || 0,
          auto_save_rate: input.auto_save_rate || null,
          reference_id: input.reference_id || null,
          metadata: input.metadata || null,
        })) as any
      )
      .select();

    if (error) throw error;
    return (data || []) as unknown as Transaction[];
  }

  async addDcaTransaction(
    userId: string,
    input: Omit<DcaTransactionCreateInput, 'user_id'>
  ): Promise<DcaTransaction> {
    if (!isSupabaseConfigured) {
      return this.addLocalDcaTransaction(input);
    }

    const { data, error } = await supabase
      .from('dca_transactions')
      .insert({
        user_id: userId,
        type: input.type,
        amount: input.amount,
        date: input.date,
        note: input.note || null,
        currency: input.currency || 'IDR',
        metadata: input.metadata || null,
      } as any)
      .select()
      .single();

    if (error) throw error;
    return data as unknown as DcaTransaction;
  }

  private addLocalDcaTransaction(input: Omit<DcaTransactionCreateInput, 'user_id'>): DcaTransaction {
    const transactions = getLocalData<DcaTransaction>(STORAGE_KEYS.dcaTransactions);
    const newTx: DcaTransaction = {
      id: crypto.randomUUID(),
      user_id: 'local',
      type: input.type,
      amount: input.amount,
      date: input.date,
      note: input.note || null,
      currency: input.currency || 'IDR',
      metadata: input.metadata || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      deleted_at: null,
    };
    transactions.unshift(newTx);
    setLocalData(STORAGE_KEYS.dcaTransactions, transactions);

    const settings = getLocalSettings();
    if (input.type === 'dca_invest') {
      settings.dca_value += input.amount;
    } else {
      settings.dca_value = Math.max(0, settings.dca_value - input.amount);
    }
    setLocalSettings(settings);

    return newTx;
  }

  async updateTransaction(
    userId: string,
    transactionId: string,
    updates: Partial<TransactionCreateInput>
  ): Promise<Transaction> {
    if (!isSupabaseConfigured) {
      return this.updateLocalTransaction(transactionId, updates);
    }

    const { data, error } = await supabase
      .from('transactions')
      .update({
        type: updates.type,
        amount: updates.amount,
        category_name: updates.category_name,
        date: updates.date,
        note: updates.note,
        locked_amount: updates.locked_amount,
        auto_save_rate: updates.auto_save_rate,
        reference_id: updates.reference_id,
        metadata: updates.metadata,
        updated_at: new Date().toISOString(),
      } as any)
      .eq('id', transactionId)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;
    return data as unknown as Transaction;
  }

  private updateLocalTransaction(
    transactionId: string,
    updates: Partial<TransactionCreateInput>
  ): Transaction {
    const transactions = getLocalData<Transaction>(STORAGE_KEYS.transactions);
    const index = transactions.findIndex(t => t.id === transactionId);
    if (index === -1) throw new Error('Transaction not found');

    transactions[index] = {
      ...transactions[index],
      ...updates,
      updated_at: new Date().toISOString(),
    } as Transaction;
    setLocalData(STORAGE_KEYS.transactions, transactions);
    return transactions[index];
  }

  async deleteTransaction(userId: string, transactionId: string): Promise<void> {
    if (!isSupabaseConfigured) {
      this.deleteLocalTransaction(transactionId);
      return;
    }

    const { error } = await supabase
      .from('transactions')
      .update({
        deleted_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      } as any)
      .eq('id', transactionId)
      .eq('user_id', userId);

    if (error) throw error;
  }

  private deleteLocalTransaction(transactionId: string): void {
    const transactions = getLocalData<Transaction>(STORAGE_KEYS.transactions);
    const filtered = transactions.filter(t => t.id !== transactionId);
    setLocalData(STORAGE_KEYS.transactions, filtered);
  }

  async updateSettings(
    userId: string,
    updates: Partial<UserSettings>
  ): Promise<UserSettings> {
    if (!isSupabaseConfigured) {
      return this.updateLocalSettings(updates);
    }

    const { data, error } = await supabase
      .from('user_settings')
      .update({
        auto_save_rate: updates.auto_save_rate,
        dca_value: updates.dca_value,
        currency: updates.currency,
        updated_at: new Date().toISOString(),
      } as any)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;
    return data as unknown as UserSettings;
  }

  private updateLocalSettings(updates: Partial<UserSettings>): UserSettings {
    const settings = getLocalSettings();
    const updated = { ...settings, ...updates, updated_at: new Date().toISOString() };
    setLocalSettings(updated);
    return updated;
  }

  async syncSettingsDcaValue(userId: string, newDcaValue: number): Promise<void> {
    if (isSupabaseConfigured) {
      await supabase
        .from('user_settings')
        .update({ dca_value: newDcaValue, updated_at: new Date().toISOString() } as any)
        .eq('user_id', userId);
    } else {
      const settings = getLocalSettings();
      settings.dca_value = newDcaValue;
      setLocalSettings(settings);
    }
  }
}

export const financeService = new FinanceService();
