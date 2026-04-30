interface TransactionFiltersProps {
  filter: string;
  onFilterChange: (filter: string) => void;
  sortBy: string;
  onSortChange: (sortBy: string) => void;
  dateFrom: string | null;
  onDateFromChange: (date: string | null) => void;
  dateTo: string | null;
  onDateToChange: (date: string | null) => void;
  keyword: string;
  onKeywordChange: (keyword: string) => void;
  pageSize: number;
  onPageSizeChange: (size: number) => void;
}

const filters = [
  { value: 'all', label: 'All' },
  { value: 'income', label: 'In' },
  { value: 'expense', label: 'Out' },
  { value: 'asset', label: 'Asset' },
  { value: 'dca', label: 'DCA' },
];

export function TransactionFilters({
  filter,
  onFilterChange,
  sortBy,
  onSortChange,
  dateFrom,
  onDateFromChange,
  dateTo,
  onDateToChange,
  keyword,
  onKeywordChange,
  pageSize,
  onPageSizeChange,
}: TransactionFiltersProps) {
  return (
    <div className="space-y-3">
      <div className="flex gap-2 flex-wrap">
        {filters.map(f => (
          <button
            key={f.value}
            className={`filter-btn ${filter === f.value ? 'active' : ''}`}
            onClick={() => onFilterChange(f.value)}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="flex gap-2 flex-wrap items-center">
        <select
          className="form-select w-auto"
          value={sortBy}
          onChange={e => onSortChange(e.target.value)}
        >
          <option value="date">Sort by Date</option>
          <option value="amount_desc">Amount (High-Low)</option>
          <option value="amount_asc">Amount (Low-High)</option>
          <option value="category">By Category</option>
        </select>

        <input
          type="text"
          placeholder="Search notes..."
          className="form-input w-[140px]"
          value={keyword}
          onChange={e => onKeywordChange(e.target.value)}
        />

        <select
          className="form-select w-auto"
          value={pageSize}
          onChange={e => onPageSizeChange(Number(e.target.value))}
        >
          <option value={10}>10 per page</option>
          <option value={20}>20 per page</option>
          <option value={50}>50 per page</option>
          <option value={100}>100 per page</option>
        </select>
      </div>

      <div className="flex gap-2 items-center">
        <span className="text-xs text-gray-500">From</span>
        <input
          type="date"
          className="form-input w-[130px]"
          value={dateFrom || ''}
          onChange={e => onDateFromChange(e.target.value || null)}
        />
        <span className="text-xs text-gray-500">To</span>
        <input
          type="date"
          className="form-input w-[130px]"
          value={dateTo || ''}
          onChange={e => onDateToChange(e.target.value || null)}
        />
      </div>
    </div>
  );
}
