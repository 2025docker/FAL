import { useAuth } from '@/contexts/AuthContext';

interface HeaderProps {
  onAddIncome: () => void;
  onAddWithdraw: () => void;
  onOpenMenu: () => void;
}

export function Header({ onAddIncome, onAddWithdraw, onOpenMenu }: HeaderProps) {
  const { user, signIn, isConfigured } = useAuth();

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="px-3 py-2.5">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <svg width="24" height="24" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="32" height="32" rx="8" fill="#2563eb" />
              <path d="M8 22V10a2 2 0 012-2h2v10a2 2 0 01-2 2H8z" fill="#10b981" />
              <path d="M14 22V8a2 2 0 012-2h2v12a2 2 0 01-2 2h-2z" fill="#f59e0b" />
              <path d="M20 22V12a2 2 0 012-2h2v8a2 2 0 01-2 2h-2z" fill="#10b981" />
              <path d="M8 24h14v2H8z" fill="#10b981" />
            </svg>
            <div className="flex flex-col leading-none min-w-0">
              <h1 className="text-sm font-bold text-primary-600 truncate">FAL</h1>
              <span className="text-[9px] text-gray-500 truncate">Finance & Asset Ledger</span>
            </div>
          </div>

          <div className="flex gap-1.5 items-center flex-shrink-0">
            <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-success-500 text-white hover:bg-success-600 transition-colors shadow-sm" onClick={onAddIncome} title="Add Income">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M7 3v8M3 7h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-danger-500 text-white hover:bg-danger-600 transition-colors shadow-sm" onClick={onAddWithdraw} title="Withdraw">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M3 7h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors" onClick={onOpenMenu} title="Menu">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2 4h10M2 7h10M2 10h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
