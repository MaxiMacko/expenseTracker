import { format, parseISO } from 'date-fns';
import type { ExpenseViewMode } from './types';

export function formatExpenseDate(dateString: string, mode: ExpenseViewMode) {
  const date = parseISO(dateString);
  switch (mode) {
    case 'month':
      return format(date, 'MMM yyyy');
    case 'year':
      return format(date, 'yyyy');
    default:
      return format(date, 'yyyy-MM-dd');
  }
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 2
  }).format(value);
}
