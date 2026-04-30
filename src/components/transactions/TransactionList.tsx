import { format } from 'date-fns';
import type { Transaction } from '@/types';
import { getIconForCategory, formatCurrency } from '@/utils/format';

interface TransactionListProps {
  transactions: Transaction[];
  onDelete: (id: string) => void;
  loading?: boolean;
}

function getTypeClass(type: string): string {
  const typeMap: Record<string, string> = {
    income: 'text-success-600',
    expense: 'text-danger-600',
    asset_buy: 'text-warning-600',
    asset_sell: 'text-warning-600',
    dca_invest: 'text-indigo-600',
    dca_withdraw: 'text-indigo-600',
    unlock_savings: 'text-gray-600',
  };
  return typeMap[type] || 'text-gray-600';
}

function getIconBgClass(type: string): string {
  const typeMap: Record<string, string> = {
    income: 'bg-success-100',
    expense: 'bg-danger-100',
    asset_buy: 'bg-warning-100',
    asset_sell: 'bg-warning-100',
    dca_invest: 'bg-indigo-100',
    dca_withdraw: 'bg-indigo-100',
    unlock_savings: 'bg-gray-200',
  };
  return typeMap[type] || 'bg-gray-100';
}

function isPositive(type: string): boolean {
  return ['income', 'asset_sell', 'dca_withdraw'].includes(type);
}

export function TransactionList({ transactions, onDelete, loading }: TransactionListProps) {
  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="empty-state">
        <svg className="w-14 h-14 text-gray-300 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <h3 className="text-base font-medium mb-2">No transactions</h3>
        <p className="text-sm text-gray-400">Add your first transaction to get started</p>
      </div>
    );
  }

  return (
    <div className="max-h-[400px] overflow-y-auto">
      {transactions.map(tx => (
        <div key={tx.id} className="log-item">
          <div className="flex items-center gap-3 flex-1">
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-base ${getIconBgClass(tx.type)}`}>
              {getIconForCategory(tx.category_name)}
            </div>
            <div>
              <h4 className={`text-sm font-semibold ${getTypeClass(tx.type)}`}>
                {tx.category_name}
              </h4>
              <p className="text-[11px] text-gray-500">{tx.note || '-'}</p>
            </div>
          </div>
          <div className="text-right flex items-center gap-3">
            <div>
              <div className={`text-sm font-semibold ${isPositive(tx.type) ? 'text-success-600' : 'text-danger-600'}`}>
                {isPositive(tx.type) ? '+' : '-'}{formatCurrency(tx.amount)}
              </div>
              <div className="text-[11px] text-gray-400">
                {format(new Date(tx.date), 'MMM dd')}
              </div>
            </div>
            <button
              className="px-2 py-1 text-[11px] bg-danger-500 text-white rounded cursor-pointer border-none transition-opacity hover:opacity-80"
              onClick={() => onDelete(tx.id)}
            >
              X
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
