import { renderHook, act } from '@testing-library/react';
import useExpenseStore from '@/store/useExpenseStore';
import type { Expense } from '@/lib/types';

// Mock fetch globally
const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>;

describe('useExpenseStore', () => {
  beforeEach(() => {
    // Clear all mocks first
    jest.clearAllMocks();
    (window.localStorage.getItem as jest.Mock).mockClear();
    (window.localStorage.setItem as jest.Mock).mockClear();
    (window.localStorage.getItem as jest.Mock).mockReturnValue(null);
    mockFetch.mockClear();
  });

  describe('initial state', () => {
    it('should have default values and sample data after loadLocalState', () => {
      const { result } = renderHook(() => useExpenseStore());

      act(() => {
        result.current.loadLocalState();
      });

      expect(result.current.activeTab).toBe('table');
      expect(result.current.isModalOpen).toBe(false);
      expect(result.current.editingExpense).toBe(null);
      expect(result.current.expenses.length).toBeGreaterThan(0);
      expect(result.current.categories).toContain('Food');
    });
  });

  describe('loadLocalState', () => {
    it('should load sample data when no localStorage data exists', () => {
      (window.localStorage.getItem as jest.Mock).mockReturnValue(null);

      const { result } = renderHook(() => useExpenseStore());

      act(() => {
        result.current.loadLocalState();
      });

      expect(result.current.expenses.length).toBeGreaterThan(0);
      expect(result.current.categories).toContain('Food');
      expect(window.localStorage.setItem).toHaveBeenCalled();
    });

    it('should load data from localStorage when available', () => {
      const mockData = {
        expenses: [{ id: '1', name: 'Test', category: 'Test', date: '2024-01-01', price: 10 }],
        categories: ['Test']
      };
      (window.localStorage.getItem as jest.Mock).mockReturnValue(JSON.stringify(mockData));

      const { result } = renderHook(() => useExpenseStore());

      act(() => {
        result.current.loadLocalState();
      });

      expect(result.current.expenses).toEqual(mockData.expenses);
      expect(result.current.categories).toEqual(mockData.categories);
    });
  });

  describe('modal operations', () => {
    it('should open modal for new expense', () => {
      const { result } = renderHook(() => useExpenseStore());

      act(() => {
        result.current.openModalForNewExpense();
      });

      expect(result.current.isModalOpen).toBe(true);
      expect(result.current.editingExpense).toBe(null);
    });

    it('should open modal for editing expense', () => {
      const { result } = renderHook(() => useExpenseStore());
      const expense: Expense = { id: '1', name: 'Test', category: 'Food', date: '2024-01-01', price: 10 };

      act(() => {
        result.current.openModalForEditExpense(expense);
      });

      expect(result.current.isModalOpen).toBe(true);
      expect(result.current.editingExpense).toEqual(expense);
    });

    it('should close modal', () => {
      const { result } = renderHook(() => useExpenseStore());

      act(() => {
        result.current.openModalForNewExpense();
        result.current.closeModal();
      });

      expect(result.current.isModalOpen).toBe(false);
      expect(result.current.editingExpense).toBe(null);
    });
  });

  describe('addExpense', () => {
    it('should add expense successfully', async () => {
      mockFetch.mockResolvedValueOnce({ ok: true } as Response);

      const { result } = renderHook(() => useExpenseStore());
      const expense: Expense = { id: '1', name: 'Coffee', category: 'Food', date: '2024-01-01', price: 5.50 };

      await act(async () => {
        await result.current.addExpense(expense);
      });

      const expenses = result.current.expenses;
      const found = expenses.find(e => e.id === '1');
      expect(found).toBeDefined();
      expect(result.current.categories).toContain('Food');
    });

    it('should add new category when adding expense with new category', async () => {
      mockFetch.mockResolvedValueOnce({ ok: true } as Response);

      const { result } = renderHook(() => useExpenseStore());
      const expense: Expense = { id: '1', name: 'New Item', category: 'NewCategory', date: '2024-01-01', price: 10 };

      await act(async () => {
        await result.current.addExpense(expense);
      });

      expect(result.current.categories).toContain('NewCategory');
    });
  });

  describe('updateExpense', () => {
    it('should update expense successfully', async () => {
      mockFetch.mockResolvedValueOnce({ ok: true } as Response);

      const { result } = renderHook(() => useExpenseStore());
      const originalExpense: Expense = { id: '1', name: 'Coffee', category: 'Food', date: '2024-01-01', price: 5.50 };

      await act(async () => {
        await result.current.addExpense(originalExpense);
      });

      mockFetch.mockResolvedValueOnce({ ok: true } as Response);
      const updatedExpense: Expense = { ...originalExpense, name: 'Latte', price: 6.00 };

      await act(async () => {
        await result.current.updateExpense(updatedExpense);
      });

      const updated = result.current.expenses.find(e => e.id === '1');
      expect(updated?.name).toBe('Latte');
      expect(updated?.price).toBe(6.00);
    });
  });

  describe('deleteExpense', () => {
    it('should delete expense successfully', async () => {
      mockFetch.mockResolvedValueOnce({ ok: true } as Response);

      const { result } = renderHook(() => useExpenseStore());
      const expense: Expense = { id: '1', name: 'Coffee', category: 'Food', date: '2024-01-01', price: 5.50 };

      await act(async () => {
        await result.current.addExpense(expense);
      });

      mockFetch.mockResolvedValueOnce({ ok: true } as Response);

      await act(async () => {
        await result.current.deleteExpense('1');
      });

      expect(result.current.expenses.find(e => e.id === '1')).toBeUndefined();
    });
  });

  describe('addCategory', () => {
    it('should add new category', () => {
      const { result } = renderHook(() => useExpenseStore());

      act(() => {
        result.current.addCategory('NewCategory');
      });

      expect(result.current.categories).toContain('NewCategory');
    });

    it('should not add duplicate category', () => {
      const { result } = renderHook(() => useExpenseStore());

      act(() => {
        result.current.addCategory('Food');
      });

      expect(result.current.categories.filter(cat => cat === 'Food')).toHaveLength(1);
    });

    it('should not add empty category', () => {
      const { result } = renderHook(() => useExpenseStore());
      const initialLength = result.current.categories.length;

      act(() => {
        result.current.addCategory('');
      });

      expect(result.current.categories).toHaveLength(initialLength);
    });
  });

  describe('filters and view modes', () => {
    it('should set active tab', () => {
      const { result } = renderHook(() => useExpenseStore());

      act(() => {
        result.current.setActiveTab('charts');
      });

      expect(result.current.activeTab).toBe('charts');
    });

    it('should set filters', () => {
      const { result } = renderHook(() => useExpenseStore());

      act(() => {
        result.current.setFilters({ category: 'Food' });
      });

      expect(result.current.filters.category).toBe('Food');
    });

    it('should set view mode', () => {
      const { result } = renderHook(() => useExpenseStore());

      act(() => {
        result.current.setViewMode('month');
      });

      expect(result.current.viewMode).toBe('month');
    });

    it('should set chart mode', () => {
      const { result } = renderHook(() => useExpenseStore());

      act(() => {
        result.current.setChartMode('year');
      });

      expect(result.current.chartMode).toBe('year');
    });
  });
});