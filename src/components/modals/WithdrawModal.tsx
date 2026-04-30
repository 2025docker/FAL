import { useState, useEffect } from 'react';
import { formatCurrency } from '@/utils/format';

interface WithdrawModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    amount: number;
    category: string;
    date: string;
    note: string;
  }) => void;
  currentDcaValue: number;
}

const WITHDRAW_CATEGORIES = [
  { value: '', label: 'Select Category', disabled: true },
  { value: 'Food', label: 'Food', group: 'Expense' },
  { value: 'Transport', label: 'Transport', group: 'Expense' },
  { value: 'Bills', label: 'Bills', group: 'Expense' },
  { value: 'Shopping', label: 'Shopping', group: 'Expense' },
  { value: 'Entertainment', label: 'Entertainment', group: 'Expense' },
  { value: 'Healthcare', label: 'Healthcare', group: 'Expense' },
  { value: 'Rent', label: 'Rent', group: 'Expense' },
  { value: 'Other', label: 'Other', group: 'Expense' },
  { value: 'Gold', label: 'Gold', group: 'Asset' },
  { value: 'Stock', label: 'Stock', group: 'Asset' },
  { value: 'Crypto', label: 'Crypto', group: 'Asset' },
  { value: 'Property', label: 'Property', group: 'Asset' },
  { value: 'Vehicle', label: 'Vehicle', group: 'Asset' },
  { value: 'Electronics', label: 'Electronics', group: 'Asset' },
  { value: 'DCA Investment', label: 'DCA (Invest)', group: 'DCA' },
  { value: 'DCA Withdraw', label: 'DCA (Withdraw)', group: 'DCA' },
  { value: 'Unlocked Savings', label: 'Unlock to Balance', group: 'Locked Savings' },
];

export function WithdrawModal({ isOpen, onClose, onSubmit, currentDcaValue }: WithdrawModalProps) {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [note, setNote] = useState('');

  useEffect(() => {
    if (isOpen) {
      setAmount('');
      setCategory('');
      setDate(new Date().toISOString().split('T')[0]);
      setNote('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const isDCA = category === 'DCA Investment' || category === 'DCA Withdraw';
  const isUnlock = category === 'Unlocked Savings';
  const isAsset = ['Gold', 'Stock', 'Crypto', 'Property', 'Vehicle', 'Electronics'].includes(category);

  const handleSubmit = () => {
    const numAmount = parseFloat(amount);
    if (!numAmount || numAmount <= 0) {
      alert('Please enter a valid amount');
      return;
    }
    if (!category) {
      alert('Please select a category');
      return;
    }
    onSubmit({ amount: numAmount, category, date, note });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h3 className="text-base font-semibold">Add Withdraw</h3>
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
              {WITHDRAW_CATEGORIES.map(cat => (
                <option key={cat.value} value={cat.value} disabled={cat.disabled}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          {isDCA && (
            <div className="bg-indigo-50 p-2.5 rounded-lg text-xs">
              DCA Balance: <span className="font-medium">{formatCurrency(currentDcaValue)}</span>
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
          <button className="btn btn-success" onClick={handleSubmit}>
            {isAsset ? 'Buy Asset' : 'Add Withdraw'}
          </button>
        </div>
      </div>
    </div>
  );
}
