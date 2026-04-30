import { useState, useCallback } from 'react';
import type { ModalType, ToastMessage } from '@/types';

export type NotesModalState = {
  isOpen: boolean;
  kpiName: string;
} | null;

export function useModal() {
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [notesModal, setNotesModal] = useState<NotesModalState>(null);

  const openModal = useCallback((modal: ModalType) => {
    setActiveModal(modal);
  }, []);

  const closeModal = useCallback(() => {
    setActiveModal(null);
  }, []);

  const openNotesModal = useCallback((kpiName: string) => {
    setNotesModal({ isOpen: true, kpiName });
  }, []);

  const closeNotesModal = useCallback(() => {
    setNotesModal(null);
  }, []);

  return { activeModal, openModal, closeModal, notesModal, openNotesModal, closeNotesModal };
}

export function useToast() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = useCallback((message: string, type: ToastMessage['type'] = 'info') => {
    const id = crypto.randomUUID();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return { toasts, showToast, removeToast };
}

export function useFilters() {
  const [filter, setFilter] = useState<string>('all');
  const [dateFrom, setDateFrom] = useState<string | null>(null);
  const [dateTo, setDateTo] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<string>('date');
  const [keyword, setKeyword] = useState<string>('');
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const resetFilters = useCallback(() => {
    setFilter('all');
    setDateFrom(null);
    setDateTo(null);
    setSortBy('date');
    setKeyword('');
    setPage(0);
  }, []);

  return {
    filter,
    setFilter,
    dateFrom,
    setDateFrom,
    dateTo,
    setDateTo,
    sortBy,
    setSortBy,
    keyword,
    setKeyword,
    page,
    setPage,
    pageSize,
    setPageSize,
    resetFilters,
  };
}
