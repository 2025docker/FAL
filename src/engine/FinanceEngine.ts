import type { Transaction, DcaTransaction, UserSettings, FinanceKPIs } from '@/types';

export class FinanceEngine {
  private transactions: Transaction[];
  private dcaTransactions: DcaTransaction[];
  private settings: UserSettings;

  constructor(
    transactions: Transaction[],
    dcaTransactions: DcaTransaction[],
    settings: UserSettings
  ) {
    this.transactions = transactions.filter(t => !t.deleted_at);
    this.dcaTransactions = dcaTransactions.filter(t => !t.deleted_at);
    this.settings = settings;
  }

  getIncome(): number {
    return this.transactions
      .filter(t => t.type === 'income' && !t.category_name.includes('Sale'))
      .reduce((sum, t) => sum + Number(t.amount), 0);
  }

  getExpenses(): number {
    return this.transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + Number(t.amount), 0);
  }

  getAssetBuys(): number {
    return this.transactions
      .filter(t => t.type === 'asset_buy')
      .reduce((sum, t) => sum + Number(t.amount), 0);
  }

  getAssetSells(): number {
    return this.transactions
      .filter(t => t.type === 'asset_sell')
      .reduce((sum, t) => sum + Number(t.amount), 0);
  }

  getAssetsValue(): number {
    const netAssets = this.getAssetBuys() - this.getAssetSells();
    const dcaValue = this.getDcaValue();
    return Math.max(0, netAssets) + dcaValue;
  }

  getDcaValue(): number {
    return this.settings.dca_value ?? 0;
  }

  getDcaInvested(): number {
    return this.dcaTransactions
      .filter(t => t.type === 'dca_invest')
      .reduce((sum, t) => sum + Number(t.amount), 0);
  }

  getDcaWithdrawn(): number {
    return this.dcaTransactions
      .filter(t => t.type === 'dca_withdraw')
      .reduce((sum, t) => sum + Number(t.amount), 0);
  }

  getLockedSavings(): number {
    let locked = 0;
    for (const t of this.transactions) {
      if (t.type === 'income' && !t.category_name.includes('Sale')) {
        locked += Number(t.locked_amount ?? 0);
      }
      if (t.type === 'unlock_savings') {
        locked -= Number(t.amount ?? 0);
      }
    }
    return Math.max(0, locked);
  }

  getBalance(): number {
    const income = this.getIncome();
    const expenses = this.getExpenses();
    const assetBuys = this.getAssetBuys();
    const assetSells = this.getAssetSells();
    const dcaInvest = this.getDcaInvested();
    const dcaWithdraw = this.getDcaWithdrawn();
    const locked = this.getLockedSavings();

    return income - expenses - assetBuys + assetSells - dcaInvest + dcaWithdraw - locked;
  }

  getCapital(): number {
    const balance = this.getBalance();
    const locked = this.getLockedSavings();
    const assets = this.getAssetsValue();
    return balance + locked + assets;
  }

  getSavingsRate(): number {
    const income = this.getIncome();
    if (income === 0) return 0;
    const balance = this.getBalance();
    const locked = this.getLockedSavings();
    const totalSavings = Math.max(0, balance) + locked;
    return (totalSavings / income) * 100;
  }

  getAssetRatio(): number {
    const capital = this.getCapital();
    if (capital === 0) return 0;
    const assets = this.getAssetsValue();
    return (assets / capital) * 100;
  }

  getDailyAverage(): number {
    const incomes = this.transactions.filter(t => t.type === 'income');
    const uniqueDates = new Set(incomes.map(t => t.date));
    const days = uniqueDates.size || 1;
    return this.getIncome() / days;
  }

  getMonthlyAverage(): number {
    const incomes = this.transactions.filter(t => t.type === 'income');
    const uniqueMonths = new Set(incomes.map(t => t.date.substring(0, 7)));
    const months = uniqueMonths.size || 1;
    return this.getIncome() / months;
  }

  getIncomeCount(): number {
    return this.transactions.filter(t => t.type === 'income').length;
  }

  getExpenseCount(): number {
    return this.transactions.filter(t => t.type === 'expense').length;
  }

  getAssetBuyCount(): number {
    return this.transactions.filter(t => t.type === 'asset_buy').length;
  }

  getAssetSellCount(): number {
    return this.transactions.filter(t => t.type === 'asset_sell').length;
  }

  getAllKPIs(): FinanceKPIs {
    return {
      totalIncome: this.getIncome(),
      totalExpenses: this.getExpenses(),
      totalAssetBuys: this.getAssetBuys(),
      totalAssetSells: this.getAssetSells(),
      assetsValue: this.getAssetsValue(),
      dcaValue: this.getDcaValue(),
      dcaInvested: this.getDcaInvested(),
      dcaWithdrawn: this.getDcaWithdrawn(),
      lockedSavings: this.getLockedSavings(),
      balance: this.getBalance(),
      capital: this.getCapital(),
      savingsRate: this.getSavingsRate(),
      assetRatio: this.getAssetRatio(),
      dailyAverage: this.getDailyAverage(),
      monthlyAverage: this.getMonthlyAverage(),
      incomeCount: this.getIncomeCount(),
      expenseCount: this.getExpenseCount(),
      assetBuyCount: this.getAssetBuyCount(),
      assetSellCount: this.getAssetSellCount(),
    };
  }

  getTransactionsByMonth(): Map<string, { income: number; expenses: number }> {
    const monthly = new Map<string, { income: number; expenses: number }>();

    for (const t of this.transactions) {
      const month = t.date.substring(0, 7);
      if (!monthly.has(month)) {
        monthly.set(month, { income: 0, expenses: 0 });
      }
      const data = monthly.get(month)!;
      if (t.type === 'income') {
        data.income += Number(t.amount);
      } else if (t.type === 'expense') {
        data.expenses += Number(t.amount);
      }
    }

    return monthly;
  }

  getTransactionsByCategory(): Map<string, number> {
    const byCategory = new Map<string, number>();

    for (const t of this.transactions) {
      const current = byCategory.get(t.category_name) || 0;
      byCategory.set(t.category_name, current + Number(t.amount));
    }

    return new Map(
      [...byCategory.entries()].sort((a, b) => b[1] - a[1])
    );
  }

  canInvestToDCA(amount: number): boolean {
    if (amount <= 0) return false;
    const balance = this.getBalance();
    return amount <= balance;
  }

  canWithdrawFromDCA(amount: number): boolean {
    if (amount <= 0) return false;
    const dcaValue = this.getDcaValue();
    return amount <= dcaValue;
  }

  canUnlockSavings(amount: number): { can: boolean; maxUnlock: number } {
    const totalLocked = this.getLockedSavings();
    const maxUnlock = Math.min(amount, totalLocked * 0.5);
    return { can: maxUnlock > 0, maxUnlock };
  }
}
