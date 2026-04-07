import { formatExpenseDate, formatCurrency } from '@/lib/utils';

describe('utils', () => {
  describe('formatExpenseDate', () => {
    it('should format date in day mode', () => {
      const result = formatExpenseDate('2024-01-15', 'day');
      expect(result).toBe('2024-01-15');
    });

    it('should format date in month mode', () => {
      const result = formatExpenseDate('2024-01-15', 'month');
      expect(result).toBe('Jan 2024');
    });

    it('should format date in year mode', () => {
      const result = formatExpenseDate('2024-01-15', 'year');
      expect(result).toBe('2024');
    });
  });

  describe('formatCurrency', () => {
    it('should format EUR currency', () => {
      expect(formatCurrency(5.50)).toBe('5,50 €');
      expect(formatCurrency(10)).toBe('10,00 €');
      expect(formatCurrency(1234.56)).toBe('1.234,56 €');
      expect(formatCurrency(0)).toBe('0,00 €');
    });

    it('should handle negative values', () => {
      expect(formatCurrency(-5.50)).toBe('-5,50 €');
    });

    it('should round to 2 decimal places', () => {
      expect(formatCurrency(5.123)).toBe('5,12 €');
      expect(formatCurrency(5.125)).toBe('5,13 €');
    });
  });
});