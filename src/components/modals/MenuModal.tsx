interface MenuModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: () => void;
  onImport: () => void;
  onClear: () => void;
  onOpenInfo: () => void;
  onToggleUserMenu: () => void;
  onLogout: () => void;
  username: string;
  email: string;
  isUserMenuOpen: boolean;
}

export function MenuModal({ isOpen, onClose, onExport, onImport, onClear, onOpenInfo, onToggleUserMenu, onLogout, username, email, isUserMenuOpen }: MenuModalProps) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h3 className="text-base font-semibold">Menu</h3>
          <div className="flex items-center gap-3">
            <button
              className="text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors"
              onClick={onToggleUserMenu}
            >
              {username}
            </button>
            <button className="w-8 h-8 border-none bg-gray-100 rounded-lg cursor-pointer flex items-center justify-center text-lg hover:bg-gray-200" onClick={onClose}>
              &times;
            </button>
          </div>
        </div>

        {isUserMenuOpen && (
          <div className="px-4 py-2 border-b border-gray-100 bg-gray-50">
            <div className="text-xs text-gray-500 mb-2">{email}</div>
            <button
              className="text-sm text-danger-600 hover:text-danger-700 font-medium"
              onClick={onLogout}
            >
              Logout
            </button>
          </div>
        )}

        <div className="p-0">
          <ul className="list-none">
            <li
              className="p-3.5 border-b border-gray-100 cursor-pointer flex items-center gap-3 hover:bg-gray-50 transition-colors"
              onClick={onExport}
            >
              <span className="font-medium">Export</span>
              <span className="text-xs text-gray-500">Download JSON</span>
            </li>
            <li
              className="p-3.5 border-b border-gray-100 cursor-pointer flex items-center gap-3 hover:bg-gray-50 transition-colors"
              onClick={onImport}
            >
              <span className="font-medium">Import File</span>
              <span className="text-xs text-gray-500">Select file</span>
            </li>
            <li
              className="p-3.5 border-b border-gray-100 cursor-pointer flex items-center gap-3 hover:bg-gray-50 transition-colors"
              onClick={onOpenInfo}
            >
              <span className="font-medium">KPI Info</span>
              <span className="text-xs text-gray-500">Understand your metrics</span>
            </li>
            <li
              className="p-3.5 cursor-pointer flex items-center gap-3 hover:bg-gray-50 transition-colors text-danger-600"
              onClick={onClear}
            >
              <span className="font-medium">Clear All</span>
              <span className="text-xs text-gray-500">Reset data</span>
            </li>
          </ul>
        </div>

        <div className="p-3 text-center text-xs text-gray-400 border-t border-gray-100">
          SSIR-FAL V.1.0.1 @2026
        </div>
      </div>
    </div>
  );
}
