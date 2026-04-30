import clsx from 'clsx';

interface KpiCardProps {
  icon: string;
  label: string;
  value: string;
  sub?: string;
  variant: 'income' | 'expense' | 'asset' | 'balance' | 'daily' | 'monthly' | 'savings' | 'locked' | 'dca' | 'ratio';
  className?: string;
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

export function KpiCard({ icon, label, value, sub, variant, className }: KpiCardProps) {
  const isBalance = variant === 'balance';
  const numericValue = parseFloat(value.replace(/[^0-9.-]/g, ''));

  return (
    <div
      className={clsx(
        'kpi-card',
        isBalance && numericValue >= 0 && 'border-l-4 border-success-500 bg-gradient-to-br from-white to-success-50',
        isBalance && numericValue < 0 && 'border-l-4 border-danger-500 bg-gradient-to-br from-white to-danger-50',
        className
      )}
    >
      <div className={clsx('w-9 h-9 rounded-lg mx-auto mb-2 flex items-center justify-center text-lg', iconBgClasses[variant])}>
        {icon}
      </div>
      <div className="text-[11px] text-gray-500 font-medium text-center mb-1">{label}</div>
      <div className={clsx('text-xl md:text-2xl font-bold text-center', variantClasses[variant])}>
        {value}
      </div>
      {sub && (
        <div className="text-[11px] text-gray-400 mt-1 text-center">{sub}</div>
      )}
    </div>
  );
}
