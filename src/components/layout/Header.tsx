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
            <button className="btn btn-primary btn-sm !px-2.5 !py-1.5 text-xs" onClick={onAddIncome}>
              +Inc
            </button>
            <button className="btn btn-success btn-sm !px-2.5 !py-1.5 text-xs" onClick={onAddWithdraw}>
              +Wdr
            </button>
            <button className="btn btn-outline btn-sm p-1.5" onClick={onOpenMenu} title="Menu">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 4h12M2 8h12M2 12h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
