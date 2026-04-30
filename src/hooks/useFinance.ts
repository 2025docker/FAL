import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { financeService } from '@/services/FinanceService';
import { FinanceEngine } from '@/engine/FinanceEngine';
import type { TransactionFilters, TransactionCreateInput, DcaTransactionCreateInput } from '@/types';

const QUERY_KEYS = {
  allData: (userId: string) => ['finance', 'allData', userId],
  transactions: (userId: string, filters: TransactionFilters) => ['finance', 'transactions', userId, filters],
};

export function useFinance() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: allData, isLoading: loadingAll } = useQuery({
    queryKey: QUERY_KEYS.allData(user?.id || ''),
    queryFn: () => financeService.getAllData(user!.id),
    enabled: !!user?.id,
  });

  const transactionsMutation = useMutation({
    mutationFn: (input: Omit<TransactionCreateInput, 'user_id'>) =>
      financeService.addTransaction(user!.id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.allData(user!.id) });
    },
  });

  const batchTransactionsMutation = useMutation({
    mutationFn: (inputs: Omit<TransactionCreateInput, 'user_id'>[]) =>
      financeService.batchInsertTransactions(user!.id, inputs),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.allData(user!.id) });
    },
  });

  const dcaMutation = useMutation({
    mutationFn: (input: Omit<DcaTransactionCreateInput, 'user_id'>) =>
      financeService.addDcaTransaction(user!.id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.allData(user!.id) });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (transactionId: string) =>
      financeService.deleteTransaction(user!.id, transactionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.allData(user!.id) });
    },
  });

  let engine: FinanceEngine | null = null;
  let kpis = null;

  if (allData) {
    engine = new FinanceEngine(
      allData.transactions,
      allData.dcaTransactions,
      allData.settings
    );
    kpis = engine.getAllKPIs();
  }

  return {
    transactions: allData?.transactions || [],
    dcaTransactions: allData?.dcaTransactions || [],
    settings: allData?.settings,
    engine,
    kpis,
    loadingAll,
    addTransaction: transactionsMutation.mutateAsync,
    batchInsertTransactions: batchTransactionsMutation.mutateAsync,
    addDcaTransaction: dcaMutation.mutateAsync,
    deleteTransaction: deleteMutation.mutateAsync,
    isMutating: transactionsMutation.isPending || batchTransactionsMutation.isPending || dcaMutation.isPending || deleteMutation.isPending,
  };
}

export function useTransactions(filters: TransactionFilters = {}) {
  const { user } = useAuth();

  return useQuery({
    queryKey: QUERY_KEYS.transactions(user?.id || '', filters),
    queryFn: () => financeService.getTransactions(user!.id, filters),
    enabled: !!user?.id,
  });
}
