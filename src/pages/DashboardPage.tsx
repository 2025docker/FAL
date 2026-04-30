import { useState, useRef } from 'react';
import { Header } from '@/components/layout/Header';
import { KpiCard } from '@/components/kpi/KpiCard';
import { CapitalCard } from '@/components/kpi/CapitalCard';
import { TransactionList } from '@/components/transactions/TransactionList';
import { TransactionFilters } from '@/components/transactions/TransactionFilters';
import { Pagination } from '@/components/transactions/Pagination';
import { AssetGrid } from '@/components/assets/AssetGrid';
import { IncomeModal } from '@/components/modals/IncomeModal';
import { WithdrawModal } from '@/components/modals/WithdrawModal';
import { MenuModal } from '@/components/modals/MenuModal';
import { InfoModal } from '@/components/modals/InfoModal';
import { NotesModal } from '@/components/modals/NotesModal';
import { useModal, useFilters, useToast } from '@/hooks/useUI';
import { useFinance } from '@/hooks/useFinance';
import { useAuth } from '@/contexts/AuthContext';
import { FinanceEngine } from '@/engine/FinanceEngine';
import { TransactionFactory } from '@/engine/transactionFactory';
import { formatCurrency, exportToJson } from '@/utils/format';
import type { TransactionType } from '@/types';

export function DashboardPage() {
  const { user, signOut } = useAuth();
  const { transactions, dcaTransactions, settings, engine, kpis, loadingAll, addTransaction, addDcaTransaction, deleteTransaction, batchInsertTransactions, isMutating } = useFinance();
  const { activeModal, openModal, closeModal, notesModal, openNotesModal, closeNotesModal } = useModal();
  const username = user?.user_metadata?.username || user?.email?.split('@')[0] || 'User';
  const { filter, setFilter, dateFrom, setDateFrom, dateTo, setDateTo, sortBy, setSortBy, keyword, setKeyword, page, setPage, pageSize } = useFilters();
  const { toasts, showToast, removeToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleNotepad = (kpiName: string) => {
    openNotesModal(kpiName);
  };

  const currency = settings?.currency || 'IDR';
  const factory = new TransactionFactory(user?.id || 'local', currency);

  const getFilteredTransactions = () => {
    let result = [...transactions];

    if (filter !== 'all') {
      if (filter === 'asset') {
        result = result.filter(t => t.type === 'asset_buy' || t.type === 'asset_sell');
      } else if (filter === 'dca') {
        result = result.filter(t => t.type === 'dca_invest' || t.type === 'dca_withdraw');
      } else {
        result = result.filter(t => t.type === filter);
      }
    }

    if (dateFrom) {
      result = result.filter(t => t.date >= dateFrom);
    }
    if (dateTo) {
      result = result.filter(t => t.date <= dateTo);
    }
    if (keyword) {
      result = result.filter(t => t.note?.toLowerCase().includes(keyword.toLowerCase()));
    }

    if (sortBy === 'date') {
      result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    } else if (sortBy === 'amount_desc') {
      result.sort((a, b) => b.amount - a.amount);
    } else if (sortBy === 'amount_asc') {
      result.sort((a, b) => a.amount - b.amount);
    } else if (sortBy === 'category') {
      result.sort((a, b) => a.category_name.localeCompare(b.category_name));
    }

    return result;
  };

  const filtered = getFilteredTransactions();
  const paginated = filtered.slice(page * pageSize, (page + 1) * pageSize);

  const handleIncomeSubmit = async (data: {
    amount: number; category: string; date: string; note: string; autoSaveEnabled: boolean; saveRate: number;
  }) => {
    const isDCAInvest = data.category === 'DCA Investment';
    const isDCAWithdraw = data.category === 'DCA Withdraw';
    const isAssetSale = data.category.includes('Sale') || data.category.includes('Sell');
    const isUnlock = data.category === 'Unlocked Savings';

    try {
      if (isDCAInvest) {
        const dcaResult = factory.createDcaInvest(data.amount, { date: data.date, note: data.note });
        await batchInsertTransactions([dcaResult.transaction]);
        await addDcaTransaction(dcaResult.dcaTransaction);
        showToast('Invested to DCA');
      } else if (isDCAWithdraw) {
        const dcaResult = factory.createDcaWithdraw(data.amount, { date: data.date, note: data.note });
        await batchInsertTransactions([dcaResult.transaction]);
        await addDcaTransaction(dcaResult.dcaTransaction);
        showToast('Withdrawn from DCA');
      } else if (isUnlock) {
        if (!engine) return;
        const unlockResult = factory.createUnlockSavings(data.amount, engine.getLockedSavings(), { date: data.date, note: data.note });
        if (!unlockResult.validation.valid) {
          alert(unlockResult.validation.errors[0]);
          return;
        }
        await addTransaction(unlockResult.transaction);
        showToast('Savings unlocked');
      } else {
        const incomeResult = factory.createIncome(data.amount, data.category, settings!, {
          date: data.date,
          note: data.note,
          autoSaveEnabled: data.autoSaveEnabled,
          saveRateOverride: data.saveRate / 100,
        });
        await batchInsertTransactions(incomeResult.transactions);
        showToast('Income added');
      }
    } catch (err) {
      showToast('Error adding transaction', 'error');
    }
  };

  const handleWithdrawSubmit = async (data: {
    amount: number; category: string; date: string; note: string;
  }) => {
    const isDCAInvest = data.category === 'DCA Investment';
    const isDCAWithdraw = data.category === 'DCA Withdraw';
    const isUnlock = data.category === 'Unlocked Savings';
    const isAsset = ['Gold', 'Stock', 'Crypto', 'Property', 'Vehicle', 'Electronics'].includes(data.category);

    try {
      if (isDCAInvest) {
        const dcaResult = factory.createDcaInvest(data.amount, { date: data.date, note: data.note });
        await batchInsertTransactions([dcaResult.transaction]);
        await addDcaTransaction(dcaResult.dcaTransaction);
        showToast('Invested to DCA');
      } else if (isDCAWithdraw) {
        const dcaResult = factory.createDcaWithdraw(data.amount, { date: data.date, note: data.note });
        await batchInsertTransactions([dcaResult.transaction]);
        await addDcaTransaction(dcaResult.dcaTransaction);
        showToast('Withdrawn from DCA');
      } else if (isUnlock) {
        if (!engine) return;
        const unlockResult = factory.createUnlockSavings(data.amount, engine.getLockedSavings(), { date: data.date, note: data.note });
        if (!unlockResult.validation.valid) {
          alert(unlockResult.validation.errors[0]);
          return;
        }
        await addTransaction(unlockResult.transaction);
        showToast('Savings unlocked');
      } else if (isAsset) {
        const assetResult = factory.createAssetBuy(data.amount, data.category, { date: data.date, note: data.note });
        await batchInsertTransactions(assetResult.transactions);
        showToast('Asset purchased');
      } else {
        const expenseResult = factory.createExpense(data.amount, data.category, { date: data.date, note: data.note });
        await batchInsertTransactions(expenseResult.transactions);
        showToast('Expense added');
      }
    } catch (err) {
      showToast('Error adding transaction', 'error');
    }
  };

  const handleQuickBuy = async (name: string, icon: string) => {
    const amountStr = prompt(`Amount for ${name}:`);
    if (!amountStr) return;
    const amount = parseFloat(amountStr);
    if (!amount || amount <= 0) return;

    const dateInput = prompt('Date (YYYY-MM-DD) or leave empty for today:', new Date().toISOString().split('T')[0]);
    const txDate = (dateInput && dateInput.trim()) ? dateInput.trim() : new Date().toISOString().split('T')[0];

    try {
      const result = factory.createAssetBuy(amount, name, { date: txDate, note: name });
      await batchInsertTransactions(result.transactions);
      showToast(`${name} purchased`);
    } catch (err) {
      showToast('Error purchasing asset', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this transaction?')) return;
    try {
      await deleteTransaction(id);
      showToast('Deleted');
    } catch (err) {
      showToast('Error deleting transaction', 'error');
    }
  };

  const handleExport = () => {
    const exportData = {
      transactions,
      dcaTransactions,
      settings,
      exportedAt: new Date().toISOString(),
    };
    exportToJson(exportData, 'fal_backup.json');
    showToast('Exported');
    closeModal();
  };

  const handleImport = () => {
    fileInputRef.current?.click();
    closeModal();
  };

  const handleFileImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (ev) => {
      try {
        const imported = JSON.parse(ev.target?.result as string);
        if (imported.transactions && Array.isArray(imported.transactions)) {
          const inputs = imported.transactions.map((t: any) => ({
            type: t.type as TransactionType,
            amount: t.amount,
            category_name: t.category_name || t.category,
            date: t.date,
            note: t.note || null,
            currency: t.currency || currency,
            locked_amount: t.locked_amount || 0,
            auto_save_rate: t.auto_save_rate || null,
            reference_id: t.reference_id || null,
          }));
          await batchInsertTransactions(inputs);
          showToast('Imported successfully');
        }
      } catch {
        alert('Invalid file');
      }
    };
    reader.readAsText(file);
  };

  const handleClear = () => {
    if (!confirm('Clear ALL data? This cannot be undone.')) return;
    showToast('Clear all is not available in cloud mode. Delete transactions individually.');
  };

  if (loadingAll) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <>
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header
        onAddIncome={() => openModal('income')}
        onAddWithdraw={() => openModal('withdraw')}
        onOpenMenu={() => openModal('menu')}
      />

      <div className="w-full px-4 py-5">
        {kpis && (
          <>
<div className="mb-4">
                <div className="grid grid-cols-3 gap-2 mb-2">
                  <KpiCard icon="💰" label="Total Income" value={formatCurrency(kpis.totalIncome)} sub={`${kpis.incomeCount}`} variant="income" />
                  <KpiCard icon="💸" label="Total Expense" value={formatCurrency(kpis.totalExpenses)} sub={`${kpis.expenseCount}`} variant="expense" />
                  <KpiCard icon="💳" label="Balance" value={formatCurrency(kpis.balance)} sub="cashflow" variant="balance" />
                </div>

                <div className="grid grid-cols-3 gap-2 mb-2">
                  <KpiCard icon="📉" label="Total DCA" value={formatCurrency(kpis.dcaValue)} variant="dca" />
                  <KpiCard icon="🔒" label="Locked Savings" value={formatCurrency(kpis.lockedSavings)} variant="locked" onNotepad={() => handleNotepad('Locked Savings')} />
                  <KpiCard icon="📊" label="Saving Rates" value={`${kpis.savingsRate.toFixed(1)}%`} variant="savings" />
                </div>

                <div className="grid grid-cols-4 gap-2 mb-2">
                  <KpiCard icon="🏠" label="Total Assets" value={formatCurrency(kpis.assetsValue)} sub={`${kpis.assetBuyCount - kpis.assetSellCount}`} variant="asset" />
                  <KpiCard icon="📈" label="Assets Ratio" value={`${kpis.assetRatio.toFixed(1)}%`} sub="% assets" variant="ratio" />
                  <KpiCard icon="📅" label="Daily Average" value={formatCurrency(kpis.dailyAverage)} variant="daily" />
                  <KpiCard icon="📆" label="Monthly Average" value={formatCurrency(kpis.monthlyAverage)} variant="monthly" />
                </div>

                <div className="mb-4">
                  <CapitalCard value={formatCurrency(kpis.capital, true)} onNotepad={() => handleNotepad('Total Capital')} />
                </div>
             </div>
           </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-4 border-b border-gray-200">
                <h3 className="text-sm font-semibold">Transaction Logs</h3>
              </div>

              <div className="p-4">
               <TransactionFilters
                 filter={filter}
                 onFilterChange={f => { setFilter(f); setPage(0); }}
                 sortBy={sortBy}
                 onSortChange={s => { setSortBy(s); setPage(0); }}
                 dateFrom={dateFrom}
                 onDateFromChange={d => { setDateFrom(d); setPage(0); }}
                 dateTo={dateTo}
                 onDateToChange={d => { setDateTo(d); setPage(0); }}
                 keyword={keyword}
                 onKeywordChange={k => { setKeyword(k); setPage(0); }}
                 pageSize={pageSize}
                 onPageSizeChange={s => { setPageSize(s); setPage(0); }}
               />
              </div>

              <TransactionList
                transactions={paginated}
                onDelete={handleDelete}
                loading={isMutating}
              />

              <Pagination
                total={filtered.length}
                limit={pageSize}
                offset={page * pageSize}
                hasMore={(page + 1) * pageSize < filtered.length}
                onPageChange={offset => setPage(Math.floor(offset / pageSize))}
              />
            </div>
          </div>

          <div>
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-4 border-b border-gray-200">
                <h3 className="text-sm font-semibold">Quick Buy Asset</h3>
              </div>
              <div className="p-4">
                <AssetGrid onAssetClick={handleQuickBuy} />
              </div>
            </div>
        </div>
       </div>

      <>
        <IncomeModal
          isOpen={activeModal === 'income'}
          onClose={() => closeModal()}
          onSubmit={handleIncomeSubmit}
          currentDcaValue={kpis?.dcaValue || 0}
          settings={settings}
        />

        <WithdrawModal
          isOpen={activeModal === 'withdraw'}
          onClose={() => closeModal()}
          onSubmit={handleWithdrawSubmit}
          currentDcaValue={kpis?.dcaValue || 0}
        />

        <MenuModal
          isOpen={activeModal === 'menu'}
          onClose={() => closeModal()}
          onAddIncome={() => { closeModal(); openModal('income'); }}
          onWithdraw={() => { closeModal(); openModal('withdraw'); }}
          onImport={handleImport}
          onClear={handleClear}
          onOpenInfo={() => { closeModal(); openModal('info'); }}
          onLogout={() => { signOut(); closeModal(); }}
          username={username}
          email={user?.email || ''}
        />

        <InfoModal
          isOpen={activeModal === 'info'}
          onClose={() => closeModal()}
        />

        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          className="hidden"
          onChange={handleFileImport}
        />

        {toasts.map(toast => (
          <div
            key={toast.id}
            className={`toast ${toast.type === 'error' ? 'bg-danger-600' : toast.type === 'success' ? 'bg-success-600' : 'bg-gray-800'}`}
            onClick={() => removeToast(toast.id)}
          >
            {toast.message}
          </div>
        ))}

        {notesModal && (
          <NotesModal
            isOpen={notesModal.isOpen}
            onClose={closeNotesModal}
            kpiName={notesModal.kpiName}
          />
        )}
      </>
    </div>

    <footer className="py-4 text-center text-sm text-gray-500">
      SSIR-FAL V.1.0.1 @2026
    </footer>
    </>
  );
}
