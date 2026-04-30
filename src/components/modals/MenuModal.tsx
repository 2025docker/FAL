interface MenuModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: () => void;
  onImport: () => void;
  onClear: () => void;
  onOpenInfo: () => void;
  onLogout: () => void;
  username: string;
  email: string;
}

export function MenuModal({ isOpen, onClose, onExport, onImport, onClear, onOpenInfo, onLogout, username, email }: MenuModalProps) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal max-w-xs w-full">
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-semibold text-sm">
              {username.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="text-sm font-semibold text-gray-900">{username}</div>
              <div className="text-xs text-gray-500">{email}</div>
            </div>
          </div>
          <button
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600"
            onClick={onClose}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        <div className="p-2">
          <div className="mb-2">
            <div className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">Actions</div>
            <ul className="list-none">
              <li
                className="px-3 py-2.5 rounded-lg cursor-pointer flex items-center gap-3 hover:bg-gray-50 transition-all duration-150 group"
                onClick={() => { onExport(); onClose(); }}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-gray-400 group-hover:text-primary-600 transition-colors">
                  <path d="M8 1v10M4 7l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M2 12h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">Export Data</span>
              </li>
              <li
                className="px-3 py-2.5 rounded-lg cursor-pointer flex items-center gap-3 hover:bg-gray-50 transition-all duration-150 group"
                onClick={() => { onImport(); onClose(); }}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-gray-400 group-hover:text-primary-600 transition-colors">
                  <path d="M8 13V3M4 7l4-4 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M2 4h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">Import File</span>
              </li>
              <li
                className="px-3 py-2.5 rounded-lg cursor-pointer flex items-center gap-3 hover:bg-gray-50 transition-all duration-150 group"
                onClick={() => { onOpenInfo(); onClose(); }}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-gray-400 group-hover:text-primary-600 transition-colors">
                  <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M8 7v4M8 5v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">KPI Info</span>
              </li>
            </ul>
          </div>

          <div className="border-t border-gray-100 pt-2">
            <ul className="list-none">
              <li
                className="px-3 py-2.5 rounded-lg cursor-pointer flex items-center gap-3 hover:bg-danger-50 transition-all duration-150 group"
                onClick={() => { onLogout(); onClose(); }}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-gray-400 group-hover:text-danger-600 transition-colors">
                  <path d="M6 14H3.5A1.5 1.5 0 012 12.5v-9A1.5 1.5 0 013.5 2H6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  <path d="M10 11l4-4-4-4M14 8H6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="text-sm font-medium text-gray-700 group-hover:text-danger-600">Logout</span>
              </li>
              <li
                className="px-3 py-2.5 rounded-lg cursor-pointer flex items-center gap-3 hover:bg-gray-50 transition-all duration-150 group"
                onClick={() => { onClear(); onClose(); }}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-gray-400 group-hover:text-danger-600 transition-colors">
                  <path d="M2 4h12M5 4V3a1 1 0 011-1h4a1 1 0 011 1v1M6 7v5M10 7v5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M13 4v8a1.5 1.5 0 01-1.5 1.5h-7A1.5 1.5 0 013 12V4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                <span className="text-sm font-medium text-gray-700 group-hover:text-danger-600">Clear All Data</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="px-4 py-3 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
          <div className="text-center text-xs text-gray-400 font-medium">SSIR-FAL V.1.0.1 @2026</div>
        </div>
      </div>
    </div>
  );
}
