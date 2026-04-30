const CURRENCY = 'Rp';

export function formatCurrency(amount: number, forceFull = false): string {
  const val = parseFloat(String(amount)) || 0;
  const isMobileOrTablet = typeof window !== 'undefined' && window.innerWidth < 1024;

  if (!forceFull && isMobileOrTablet && val >= 1000) {
    if (val >= 1e9) return `${CURRENCY}${(val / 1e9).toFixed(1)}B`;
    if (val >= 1e6) return `${CURRENCY}${(val / 1e6).toFixed(1)}M`;
    if (val >= 1000) return `${CURRENCY}${(val / 1000).toFixed(0)}K`;
  }
  return `${CURRENCY}${val.toLocaleString('en-ID', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

export function formatDate(dateStr: string): string {
  if (!dateStr) return '-';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-ID', { month: 'short', day: 'numeric' });
}

export function getIconForCategory(category: string): string {
  const icons: Record<string, string> = {
    House: '🏠',
    Car: '🚗',
    Gold: '🥇',
    Laptop: '💻',
    Phone: '📱',
    Watch: '⌚',
    Bike: '🚲',
    Jewelry: '💎',
    Salary: '💰',
    Freelance: '💼',
    Business: '🏢',
    Bonus: '🎁',
    'Asset Sale': '🏆',
    'Gold Sell': '🥇',
    Property: '🏠',
    Other: '💵',
    Food: '🍔',
    Transport: '🚌',
    Bills: '📄',
    Entertainment: '🎬',
    Shopping: '🛒',
    Healthcare: '🏥',
    Rent: '🏠',
    Stock: '📈',
    Crypto: '₿',
    Vehicle: '🚗',
    Electronics: '💻',
    'DCA Investment': '📈',
    'DCA Withdraw': '📉',
    'Unlock Savings': '🔓',
  };
  return icons[category] || '💰';
}

export function exportToJson(data: unknown, filename: string): void {
  const dataStr = JSON.stringify(data, null, 2);
  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
