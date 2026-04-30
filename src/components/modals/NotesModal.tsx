import { useState, useEffect } from 'react';

interface NotesModalProps {
  isOpen: boolean;
  onClose: () => void;
  kpiName: string;
}

const STORAGE_KEY = 'fal_kpi_notes';

function getStoredNotes(): Record<string, string> {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  } catch {
    return {};
  }
}

function saveNotes(notes: Record<string, string>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
}

export function NotesModal({ isOpen, onClose, kpiName }: NotesModalProps) {
  const [note, setNote] = useState('');

  useEffect(() => {
    if (isOpen) {
      const notes = getStoredNotes();
      setNote(notes[kpiName] || '');
    }
  }, [isOpen, kpiName]);

  if (!isOpen) return null;

  const handleSave = () => {
    const notes = getStoredNotes();
    notes[kpiName] = note;
    saveNotes(notes);
    onClose();
  };

  const handleClear = () => {
    const notes = getStoredNotes();
    delete notes[kpiName];
    saveNotes(notes);
    setNote('');
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal max-w-md">
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h3 className="text-base font-semibold">Notes: {kpiName}</h3>
          <button
            className="w-8 h-8 border-none bg-gray-100 rounded-lg cursor-pointer flex items-center justify-center text-lg hover:bg-gray-200"
            onClick={onClose}
          >
            &times;
          </button>
        </div>

        <div className="p-5">
          <textarea
            className="w-full h-40 p-3 border border-gray-300 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder={`Write your notes for ${kpiName}...`}
            value={note}
            onChange={e => setNote(e.target.value)}
          />

          <div className="flex gap-2 mt-4">
            <button
              className="flex-1 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors"
              onClick={handleSave}
            >
              Save
            </button>
            <button
              className="flex-1 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300 transition-colors"
              onClick={handleClear}
            >
              Clear
            </button>
            <button
              className="flex-1 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
