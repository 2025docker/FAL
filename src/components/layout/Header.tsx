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
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="9" r="5" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                <path d="M6 6c0-1.1.9-2 2-2s2 .9 2 2" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                <line x1="8" y1="7" x2="8" y2="11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-danger-500 text-white hover:bg-danger-600 transition-colors shadow-sm" onClick={onAddWithdraw} title="Withdraw">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <rect x="3" y="5" width="10" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                <path d="M3 8h2.5a1.5 1.5 0 010 3H3" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                <circle cx="11" cy="9" r=".8" fill="currentColor"/>
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
