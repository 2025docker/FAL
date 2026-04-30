import { useState, useEffect } from 'react';
import { formatCurrency } from '@/utils/format';

interface IncomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    amount: number;
    category: string;
    date: string;
    note: string;
    autoSaveEnabled: boolean;
    saveRate: number;
  }) => void;
  currentDcaValue: number;
  settings: { auto_save_rate: number } | undefined;
}

const INCOME_CATEGORIES = [
  { value: 'Salary', label: 'Salary', group: 'Income' },
  { value: 'Freelance', label: 'Freelance', group: 'Income' },
  { value: 'Business', label: 'Business', group: 'Income' },
  { value: 'Bonus', label: 'Bonus', group: 'Income' },
  { value: 'Other', label: 'Other', group: 'Income' },
  { value: 'Asset Sale', label: 'Asset Sale', group: 'Asset Sales' },
  { value: 'Gold Sell', label: 'Gold (Sell)', group: 'Asset Sales' },
  { value: 'Property Sale', label: 'Property', group: 'Asset Sales' },
  { value: 'DCA Investment', label: 'DCA (Invest)', group: 'DCA' },
  { value: 'DCA Withdraw', label: 'DCA (Withdraw)', group: 'DCA' },
  { value: 'Unlocked Savings', label: 'Unlock to Balance', group: 'Locked Savings' },
];

export function IncomeModal({ isOpen, onClose, onSubmit, currentDcaValue, settings }: IncomeModalProps) {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Salary');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [note, setNote] = useState('');
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);
  const [saveRate, setSaveRate] = useState(settings?.auto_save_rate ? Math.round(settings.auto_save_rate * 100) : 30);

  useEffect(() => {
    if (isOpen) {
      setAmount('');
      setCategory('Salary');
      setDate(new Date().toISOString().split('T')[0]);
      setNote('');
      setAutoSaveEnabled(true);
      setSaveRate(settings?.auto_save_rate ? Math.round(settings.auto_save_rate * 100) : 30);
    }
  }, [isOpen, settings]);

  if (!isOpen) return null;

  const isDCA = category === 'DCA Investment' || category === 'DCA Withdraw';
  const isAssetSale = category.includes('Sale') || category.includes('Sell');
  const isUnlock = category === 'Unlocked Savings';

  const handleSubmit = () => {
    const numAmount = parseFloat(amount);
    if (!numAmount || numAmount <= 0) {
      alert('Please enter a valid amount');
      return;
    }
    onSubmit({ amount: numAmount, category, date, note, autoSaveEnabled, saveRate });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h3 className="text-base font-semibold">Add Income</h3>
          <button className="w-8 h-8 border-none bg-gray-100 rounded-lg cursor-pointer flex items-center justify-center text-lg hover:bg-gray-200" onClick={onClose}>
            &times;
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div>
            <label className="form-label">Amount *</label>
            <input
              type="number"
              className="form-input"
              placeholder="0"
              value={amount}
              onChange={e => setAmount(e.target.value)}
            />
          </div>

          <div>
            <label className="form-label">Category</label>
            <select className="form-select" value={category} onChange={e => setCategory(e.target.value)}>
              {INCOME_CATEGORIES.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
          </div>

          {isDCA && (
            <div className="bg-indigo-50 p-2.5 rounded-lg text-xs">
              DCA Balance: <span className="font-medium">{formatCurrency(currentDcaValue)}</span>
            </div>
          )}

          {!isDCA && !isUnlock && !isAssetSale && (
            <div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoSaveEnabled}
                  onChange={e => setAutoSaveEnabled(e.target.checked)}
                />
                <span className="text-sm font-medium">Lock Savings</span>
              </label>
              {autoSaveEnabled && (
                <input
                  type="number"
                  className="form-input mt-2"
                  value={saveRate}
                  min={0}
                  max={100}
                  onChange={e => setSaveRate(parseInt(e.target.value) || 0)}
                />
              )}
            </div>
          )}

          <div>
            <label className="form-label">Date</label>
            <input type="date" className="form-input" value={date} onChange={e => setDate(e.target.value)} />
          </div>

          <div>
            <label className="form-label">Note</label>
            <input
              type="text"
              className="form-input"
              placeholder="Optional"
              value={note}
              onChange={e => setNote(e.target.value)}
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 p-4 border-t border-gray-200">
          <button className="btn btn-outline" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSubmit}>Add Income</button>
        </div>
      </div>
    </div>
  );
}
