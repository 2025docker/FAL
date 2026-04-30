import { supabase } from '@/lib/supabase';
import type {
  Transaction,
  DcaTransaction,
  UserSettings,
  TransactionFilters,
  PaginatedResult,
  TransactionCreateInput,
  DcaTransactionCreateInput,
} from '@/types';

export class FinanceService {
  async getTransactions(
    userId: string,
    filters: TransactionFilters = {}
  ): Promise<PaginatedResult<Transaction>> {
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

  async getAllData(userId: string): Promise<{
    transactions: Transaction[];
    dcaTransactions: DcaTransaction[];
    settings: UserSettings;
  }> {
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
      settings: (settingsRes.data || {}) as unknown as UserSettings,
    };
  }

  async addTransaction(
    userId: string,
    input: Omit<TransactionCreateInput, 'user_id'>
  ): Promise<Transaction> {
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

  async batchInsertTransactions(
    userId: string,
    inputs: Omit<TransactionCreateInput, 'user_id'>[]
  ): Promise<Transaction[]> {
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

  async updateTransaction(
    userId: string,
    transactionId: string,
    updates: Partial<TransactionCreateInput>
  ): Promise<Transaction> {
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

  async deleteTransaction(userId: string, transactionId: string): Promise<void> {
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

  async updateSettings(
    userId: string,
    updates: Partial<UserSettings>
  ): Promise<UserSettings> {
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

  async syncSettingsDcaValue(userId: string, newDcaValue: number): Promise<void> {
    await supabase
      .from('user_settings')
      .update({ dca_value: newDcaValue, updated_at: new Date().toISOString() } as any)
      .eq('user_id', userId);
  }
}

export const financeService = new FinanceService();
