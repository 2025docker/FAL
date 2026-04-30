import type {
  TransactionCreateInput,
  DcaTransactionCreateInput,
  ValidationResult,
  Transaction,
  TransactionType,
} from '@/types';

function validatePositiveAmount(amount: number, field = 'amount'): string | null {
  if (amount <= 0 || isNaN(amount)) {
    return `${field} must be a positive number`;
  }
  return null;
}

function validateDate(date: string): string | null {
  if (!date) return 'Date is required';
  const parsed = new Date(date);
  if (isNaN(parsed.getTime())) return 'Invalid date format';
  return null;
}

function validateType(type: string): string | null {
  const validTypes: TransactionType[] = [
    'income', 'expense', 'asset_buy', 'asset_sell',
    'dca_invest', 'dca_withdraw', 'unlock_savings'
  ];
  if (!validTypes.includes(type as TransactionType)) {
    return `Invalid transaction type: ${type}`;
  }
  return null;
}

function validateCategoryName(categoryName: string): string | null {
  if (!categoryName || categoryName.trim().length === 0) {
    return 'Category is required';
  }
  return null;
}

export function validateTransaction(
  input: TransactionCreateInput,
  currentBalance: number,
  currentLocked: number,
  currentDcaValue: number
): ValidationResult {
  const errors: string[] = [];

  const amountError = validatePositiveAmount(input.amount);
  if (amountError) errors.push(amountError);

  const dateError = validateDate(input.date);
  if (dateError) errors.push(dateError);

  const typeError = validateType(input.type);
  if (typeError) errors.push(typeError);

  const categoryError = validateCategoryName(input.category_name);
  if (categoryError) errors.push(categoryError);

  if (input.type === 'expense' || input.type === 'asset_buy') {
    if (currentBalance < input.amount) {
      errors.push(`Insufficient balance. Available: ${currentBalance.toFixed(2)}`);
    }
  }

  if (input.type === 'dca_invest') {
    if (currentBalance < input.amount) {
      errors.push(`Insufficient balance for DCA investment. Available: ${currentBalance.toFixed(2)}`);
    }
  }

  if (input.type === 'dca_withdraw') {
    if (currentDcaValue < input.amount) {
      errors.push(`Insufficient DCA value. Available: ${currentDcaValue.toFixed(2)}`);
    }
  }

  if (input.type === 'unlock_savings') {
    const maxUnlock = Math.min(input.amount, currentLocked * 0.5);
    if (maxUnlock <= 0) {
      errors.push('No locked savings available to unlock');
    } else if (input.amount > maxUnlock) {
      errors.push(`Cannot unlock more than 50% of locked savings. Max: ${maxUnlock.toFixed(2)}`);
    }
  }

  if (input.locked_amount && input.locked_amount < 0) {
    errors.push('Locked amount cannot be negative');
  }

  if (input.locked_amount && input.locked_amount > input.amount) {
    errors.push('Locked amount cannot exceed transaction amount');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

export function validateDcaTransaction(
  input: DcaTransactionCreateInput,
  currentBalance: number,
  currentDcaValue: number
): ValidationResult {
  const errors: string[] = [];

  const amountError = validatePositiveAmount(input.amount);
  if (amountError) errors.push(amountError);

  const dateError = validateDate(input.date);
  if (dateError) errors.push(dateError);

  if (input.type === 'dca_invest' && currentBalance < input.amount) {
    errors.push(`Insufficient balance. Available: ${currentBalance.toFixed(2)}`);
  }

  if (input.type === 'dca_withdraw' && currentDcaValue < input.amount) {
    errors.push(`Insufficient DCA value. Available: ${currentDcaValue.toFixed(2)}`);
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

export function validateBatchTransactions(
  inputs: TransactionCreateInput[],
  currentBalance: number,
  currentLocked: number,
  currentDcaValue: number
): ValidationResult {
  const errors: string[] = [];

  for (let i = 0; i < inputs.length; i++) {
    const result = validateTransaction(inputs[i], currentBalance, currentLocked, currentDcaValue);
    if (!result.valid) {
      errors.push(`Transaction ${i + 1}: ${result.errors.join(', ')}`);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
