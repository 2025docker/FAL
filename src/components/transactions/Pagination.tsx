interface PaginationProps {
  total: number;
  limit: number;
  offset: number;
  hasMore: boolean;
  onPageChange: (offset: number) => void;
}

export function Pagination({ total, limit, offset, hasMore, onPageChange }: PaginationProps) {
  const currentPage = Math.floor(offset / limit) + 1;
  const totalPages = Math.ceil(total / limit);

  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-between items-center px-4 py-3 border-t border-gray-100">
      <span className="text-xs text-gray-500">
        Page {currentPage} of {totalPages} ({total} total)
      </span>
      <div className="flex gap-2">
        <button
          className="btn btn-outline btn-sm"
          disabled={offset === 0}
          onClick={() => onPageChange(Math.max(0, offset - limit))}
        >
          Previous
        </button>
        <button
          className="btn btn-outline btn-sm"
          disabled={!hasMore}
          onClick={() => onPageChange(offset + limit)}
        >
          Next
        </button>
      </div>
    </div>
  );
}
