import { useState } from 'react';

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const KPI_INFO = [
  {
    icon: '💰',
    title: 'Total Income',
    desc: 'External money earned (salary, freelance, business). NOT asset sales.',
    formula: "Income = Σ type = 'income'",
    note: "Selling your own assets does NOT increase Income. It's asset conversion (asset → cash).",
  },
  {
    icon: '💸',
    title: 'Total Expenses',
    desc: 'All money spent on consumables and daily needs.',
    formula: "Expenses = Σ all transactions with type = 'expense'",
  },
  {
    icon: '🏠',
    title: 'Total Assets',
    desc: 'Current value of purchased assets + DCA value. DCA counts as asset when invested.',
    formula: 'Assets = Σ Asset Buys - Σ Asset Sells + DCA',
  },
  {
    icon: '💳',
    title: 'Balance',
    desc: 'Available cash after expenses + asset sales - DCA invest + DCA withdraw - locked.',
    formula: 'Balance = Income - Expenses - Asset Buys + Asset Sells - DCA Invest + DCA Withdraw - Locked',
  },
  {
    icon: '🔒',
    title: 'Locked Savings',
    desc: 'Auto-allocated savings from income (configurable rate).',
    formula: 'Locked = Σ income.lockedAmount (autoSaveRate × income)',
  },
  {
    icon: '📉',
    title: 'Total DCA',
    desc: 'Net invested capital via Dollar Cost Averaging. DCA adds to Assets when invested, removes when withdrawn.',
    formula: 'Total DCA = Σ DCA Invest - Σ DCA Withdraw',
  },
  {
    icon: '📅',
    title: 'Daily Average',
    desc: 'Average income per active day (days with transactions).',
    formula: 'Daily Avg = Income / Active Days',
  },
  {
    icon: '📆',
    title: 'Monthly Average',
    desc: 'Average income per active month.',
    formula: 'Monthly Avg = Income / Active Months',
  },
  {
    icon: '📊',
    title: 'Savings Rate',
    desc: 'Total savings percentage: (Balance + Locked Savings) / Income',
    formula: 'Savings Rate = (Balance + Locked) / Income × 100',
  },
  {
    icon: '📈',
    title: 'Asset Ratio',
    desc: 'What percentage of your capital is in assets (including DCA).',
    formula: 'Asset Ratio = (Assets / Capital) × 100',
  },
  {
    icon: '💎',
    title: 'Total Capital',
    desc: 'Your true net worth: Balance + Locked + Assets (DCA included).',
    formula: 'Capital = Balance + Locked + Assets',
  },
];

export function InfoModal({ isOpen, onClose }: InfoModalProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal max-w-lg">
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h3 className="text-base font-semibold">Financial Insights Guide</h3>
          <button className="w-8 h-8 border-none bg-gray-100 rounded-lg cursor-pointer flex items-center justify-center text-lg hover:bg-gray-200" onClick={onClose}>
            &times;
          </button>
        </div>

        <div className="p-5">
          <div className="mb-4">
            <h2 className="text-lg font-bold text-gray-900 mb-1">How Your KPIs Are Calculated</h2>
            <p className="text-sm text-gray-500">Understanding your financial metrics</p>
          </div>

          <div className="border border-gray-200 rounded-lg overflow-hidden">
            {KPI_INFO.map((item, index) => (
              <div key={item.title} className="border-b border-gray-100 last:border-b-0">
                <button
                  className={`p-3.5 flex items-center gap-3 cursor-pointer bg-white w-full text-left text-sm transition-colors hover:bg-gray-50 ${openIndex === index ? 'bg-gray-50' : ''}`}
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span className="flex-1 font-medium">{item.title}</span>
                  <span className={`text-xs text-gray-400 transition-transform ${openIndex === index ? 'rotate-180' : ''}`}>▼</span>
                </button>
                {openIndex === index && (
                  <div className="p-3 bg-gray-50 border-t border-gray-100">
                    <p className="text-sm text-gray-600 mb-2">{item.desc}</p>
                    <div className="bg-gray-800 text-gray-100 p-2.5 rounded-lg font-mono text-xs">
                      {item.formula}
                    </div>
                    {item.note && (
                      <p className="text-xs text-warning-600 mt-2">{item.note}</p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
