import clsx from 'clsx';

interface KpiCardProps {
  icon: string;
  label: string;
  value: string;
  sub?: string;
  variant: 'income' | 'expense' | 'asset' | 'balance' | 'daily' | 'monthly' | 'savings' | 'locked' | 'dca' | 'ratio';
  className?: string;
  onNotepad?: () => void;
}

const variantClasses: Record<string, string> = {
  income: 'text-success-500',
  expense: 'text-danger-500',
  asset: 'text-warning-500',
  balance: 'text-primary-600',
  daily: 'text-indigo-500',
  monthly: 'text-indigo-500',
  savings: 'text-success-500',
  locked: 'text-gray-600',
  dca: 'text-indigo-500',
  ratio: 'text-warning-500',
};

const iconBgClasses: Record<string, string> = {
  income: 'bg-success-100',
  expense: 'bg-danger-100',
  asset: 'bg-warning-100',
  balance: 'bg-primary-100',
  daily: 'bg-indigo-100',
  monthly: 'bg-indigo-100',
  savings: 'bg-success-100',
  locked: 'bg-gray-200',
  dca: 'bg-indigo-100',
  ratio: 'bg-warning-100',
};

export function KpiCard({ icon, label, value, sub, variant, className, onNotepad }: KpiCardProps) {
  const isBalance = variant === 'balance';
  const numericValue = parseFloat(value.replace(/[^0-9.-]/g, ''));

  return (
    <div
      className={clsx(
        'kpi-card py-2 sm:py-3 relative',
        isBalance && numericValue >= 0 && 'border-l-4 border-success-500 bg-gradient-to-br from-white to-success-50',
        isBalance && numericValue < 0 && 'border-l-4 border-danger-500 bg-gradient-to-br from-white to-danger-50',
        className
      )}
    >
      {onNotepad && (
        <button
          onClick={onNotepad}
          className="absolute top-1 right-1 text-[8px] sm:text-[10px] text-gray-400 hover:text-gray-600 transition-colors"
          title="Notes"
        >
          📝
        </button>
      )}
      <div className={clsx('w-7 h-7 sm:w-8 sm:h-8 rounded-lg mx-auto mb-1 flex items-center justify-center text-sm sm:text-base', iconBgClasses[variant])}>
        {icon}
      </div>
      <div className="text-[8px] sm:text-[9px] md:text-[10px] lg:text-xs text-gray-500 font-medium text-center mb-0.5 sm:mb-1">{label}</div>
<div className={clsx('text-[10px] sm:text-xs md:text-sm lg:text-base xl:text-lg font-bold text-center leading-tight', variantClasses[variant])}>
         {value}
       </div>
      {sub && (
        <div className="text-[8px] sm:text-[9px] md:text-[10px] text-gray-400 mt-0.5 text-center">{sub}</div>
      )}
    </div>
  );
}
