import type { TransactionCreateInput, DcaTransactionCreateInput, UserSettings, Transaction } from '@/types';
import { validateTransaction, validateDcaTransaction } from './validation';
import { FinanceEngine } from './FinanceEngine';

export class TransactionFactory {
  private userId: string;
  private currency: string;

  constructor(userId: string, currency = 'IDR') {
    this.userId = userId;
    this.currency = currency;
  }

  createIncome(
    amount: number,
    category_name: string,
    settings: UserSettings,
    options: { date?: string; note?: string; autoSaveEnabled?: boolean; saveRateOverride?: number } = {}
  ): { transactions: TransactionCreateInput[]; validation: { valid: boolean; errors: string[] } } {
    const date = options.date || new Date().toISOString().split('T')[0];
    const autoSaveEnabled = options.autoSaveEnabled !== false;
    const saveRate = options.saveRateOverride ?? settings.auto_save_rate;

    const isAssetSale = category_name.includes('Sale') || category_name.includes('Sell');

    if (isAssetSale) {
      const input: TransactionCreateInput = {
        type: 'asset_sell',
        amount,
        category_name,
        date,
        note: options.note || null,
        currency: this.currency,
        locked_amount: 0,
      };
      return { transactions: [input], validation: { valid: true, errors: [] } };
    }

    const lockedAmount = autoSaveEnabled ? Math.round(amount * saveRate * 100) / 100 : 0;

    const incomeInput: TransactionCreateInput = {
      type: 'income',
      amount,
      category_name,
      date,
      note: options.note || null,
      currency: this.currency,
      locked_amount: lockedAmount,
      auto_save_rate: autoSaveEnabled ? saveRate : null,
    };

    return { transactions: [incomeInput], validation: { valid: true, errors: [] } };
  }

  createExpense(
    amount: number,
    category_name: string,
    options: { date?: string; note?: string } = {}
  ): { transactions: TransactionCreateInput[]; validation: { valid: boolean; errors: string[] } } {
    const date = options.date || new Date().toISOString().split('T')[0];

    const input: TransactionCreateInput = {
      type: 'expense',
      amount,
      category_name,
      date,
      note: options.note || null,
      currency: this.currency,
      locked_amount: 0,
    };

    return { transactions: [input], validation: { valid: true, errors: [] } };
  }

  createAssetBuy(
    amount: number,
    category_name: string,
    options: { date?: string; note?: string } = {}
  ): { transactions: TransactionCreateInput[]; validation: { valid: boolean; errors: string[] } } {
    const date = options.date || new Date().toISOString().split('T')[0];

    const input: TransactionCreateInput = {
      type: 'asset_buy',
      amount,
      category_name,
      date,
      note: options.note || null,
      currency: this.currency,
      locked_amount: 0,
    };

    return { transactions: [input], validation: { valid: true, errors: [] } };
  }

  createAssetSell(
    amount: number,
    category_name: string,
    options: { date?: string; note?: string; referenceId?: string } = {}
  ): { transactions: TransactionCreateInput[]; validation: { valid: boolean; errors: string[] } } {
    const date = options.date || new Date().toISOString().split('T')[0];

    const input: TransactionCreateInput = {
      type: 'asset_sell',
      amount,
      category_name: category_name.includes('Sale') ? category_name : `${category_name} Sale`,
      date,
      note: options.note || null,
      currency: this.currency,
      locked_amount: 0,
      reference_id: options.referenceId || null,
    };

    return { transactions: [input], validation: { valid: true, errors: [] } };
  }

  createDcaInvest(
    amount: number,
    options: { date?: string; note?: string } = {}
  ): { transaction: TransactionCreateInput; dcaTransaction: DcaTransactionCreateInput; validation: { valid: boolean; errors: string[] } } {
    const date = options.date || new Date().toISOString().split('T')[0];

    const txInput: TransactionCreateInput = {
      type: 'dca_invest',
      amount,
      category_name: 'DCA Investment',
      date,
      note: options.note || 'DCA Investment',
      currency: this.currency,
      locked_amount: 0,
    };

    const dcaInput: DcaTransactionCreateInput = {
      type: 'dca_invest',
      amount,
      date,
      note: options.note || 'DCA Investment',
      currency: this.currency,
    };

    return { transaction: txInput, dcaTransaction: dcaInput, validation: { valid: true, errors: [] } };
  }

  createDcaWithdraw(
    amount: number,
    options: { date?: string; note?: string } = {}
  ): { transaction: TransactionCreateInput; dcaTransaction: DcaTransactionCreateInput; validation: { valid: boolean; errors: string[] } } {
    const date = options.date || new Date().toISOString().split('T')[0];

    const txInput: TransactionCreateInput = {
      type: 'dca_withdraw',
      amount,
      category_name: 'DCA Withdraw',
      date,
      note: options.note || 'DCA Withdrawal',
      currency: this.currency,
      locked_amount: 0,
    };

    const dcaInput: DcaTransactionCreateInput = {
      type: 'dca_withdraw',
      amount,
      date,
      note: options.note || 'DCA Withdrawal',
      currency: this.currency,
    };

    return { transaction: txInput, dcaTransaction: dcaInput, validation: { valid: true, errors: [] } };
  }

  createUnlockSavings(
    amount: number,
    currentLocked: number,
    options: { date?: string; note?: string } = {}
  ): { transaction: TransactionCreateInput; validation: { valid: boolean; errors: string[] } } {
    const date = options.date || new Date().toISOString().split('T')[0];
    const maxUnlock = Math.min(amount, currentLocked * 0.5);

    if (maxUnlock <= 0) {
      return {
        transaction: {} as TransactionCreateInput,
        validation: { valid: false, errors: ['No locked savings to unlock'] },
      };
    }

    const unlockAmount = Math.min(amount, maxUnlock);

    const input: TransactionCreateInput = {
      type: 'unlock_savings',
      amount: unlockAmount,
      category_name: 'Unlock Savings',
      date,
      note: options.note || 'Unlocked to balance',
      currency: this.currency,
      locked_amount: 0,
    };

    return { transaction: input, validation: { valid: true, errors: [] } };
  }

  validateCreateTransaction(
    input: TransactionCreateInput,
    transactions: Transaction[],
    dcaTransactions: any[],
    settings: UserSettings
  ): { valid: boolean; errors: string[] } {
    const engine = new FinanceEngine(transactions, dcaTransactions, settings);
    const balance = engine.getBalance();
    const locked = engine.getLockedSavings();
    const dcaValue = engine.getDcaValue();

    return validateTransaction(input, balance, locked, dcaValue);
  }

  validateCreateDcaTransaction(
    input: DcaTransactionCreateInput,
    transactions: Transaction[],
    dcaTransactions: any[],
    settings: UserSettings
  ): { valid: boolean; errors: string[] } {
    const engine = new FinanceEngine(transactions, dcaTransactions, settings);
    const balance = engine.getBalance();
    const dcaValue = engine.getDcaValue();

    return validateDcaTransaction(input, balance, dcaValue);
  }
}
