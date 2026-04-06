import { renderHook, act } from '@testing-library/react';
import useExpenseStore from '@/store/useExpenseStore';
import type { Expense } from '@/lib/types';

const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>;

const createResponse = (ok: boolean, body: any) => ({
  ok,
  json: jest.fn().mockResolvedValue(body)
}) as unknown as Response;

describe('useExpenseStore', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockFetch.mockClear();
  });

  describe('initial state', () => {
    it('should have default values and load data from the API', async () => {
      const remoteExpenses: Expense[] = [{ id: '1', name: 'Test', category: 'Food', date: '2024-01-01', price: 10 }];
      const remoteCategories = ['Food', 'Transport'];

      mockFetch.mockResolvedValueOnce(createResponse(true, { expenses: remoteExpenses }));
      mockFetch.mockResolvedValueOnce(createResponse(true, { categories: remoteCategories }));

      const { result } = renderHook(() => useExpenseStore());

      await act(async () => {
        await result.current.loadLocalState();
      });

      expect(result.current.activeTab).toBe('table');
      expect(result.current.isModalOpen).toBe(false);
      expect(result.current.editingExpense).toBe(null);
      expect(result.current.expenses).toEqual(remoteExpenses);
      expect(result.current.categories).toEqual(remoteCategories);
    });
  });

  describe('loadLocalState', () => {
    it('should load data from the API successfully', async () => {
      const remoteExpenses: Expense[] = [{ id: '1', name: 'Test', category: 'Test', date: '2024-01-01', price: 10 }];
      const remoteCategories = ['Test'];

      mockFetch.mockResolvedValueOnce(createResponse(true, { expenses: remoteExpenses }));
      mockFetch.mockResolvedValueOnce(createResponse(true, { categories: remoteCategories }));

      const { result } = renderHook(() => useExpenseStore());

      await act(async () => {
        await result.current.loadLocalState();
      });

      expect(result.current.expenses).toEqual(remoteExpenses);
      expect(result.current.categories).toEqual(remoteCategories);
    });

    it('should fall back to default categories if the API fails', async () => {
      mockFetch.mockResolvedValueOnce(createResponse(false, null));
      mockFetch.mockResolvedValueOnce(createResponse(false, null));

      const { result } = renderHook(() => useExpenseStore());

      await act(async () => {
        await result.current.loadLocalState();
      });

      expect(result.current.expenses).toEqual([]);
      expect(result.current.categories).toContain('Food');
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
      const expense: Expense = { id: '1', name: 'Coffee', category: 'Food', date: '2024-01-01', price: 5.5 };
      mockFetch.mockResolvedValueOnce(createResponse(true, { item: expense }));

      const { result } = renderHook(() => useExpenseStore());

      await act(async () => {
        await result.current.addExpense(expense);
      });

      expect(result.current.expenses).toContainEqual(expense);
      expect(result.current.categories).toContain('Food');
    });

    it('should add new category when adding expense with a new category', async () => {
      const expense: Expense = { id: '1', name: 'New Item', category: 'NewCategory', date: '2024-01-01', price: 10 };
      mockFetch.mockResolvedValueOnce(createResponse(true, { item: expense }));

      const { result } = renderHook(() => useExpenseStore());

      await act(async () => {
        await result.current.addExpense(expense);
      });

      expect(result.current.categories).toContain('NewCategory');
    });
  });

  describe('updateExpense', () => {
    it('should update expense successfully', async () => {
      const originalExpense: Expense = { id: '1', name: 'Coffee', category: 'Food', date: '2024-01-01', price: 5.5 };
      const updatedExpense: Expense = { ...originalExpense, name: 'Latte', price: 6.0 };

      mockFetch.mockResolvedValueOnce(createResponse(true, { item: originalExpense }));
      mockFetch.mockResolvedValueOnce(createResponse(true, { item: updatedExpense }));

      const { result } = renderHook(() => useExpenseStore());

      await act(async () => {
        await result.current.addExpense(originalExpense);
      });

      await act(async () => {
        await result.current.updateExpense(updatedExpense);
      });

      expect(result.current.expenses.find((e) => e.id === '1')?.name).toBe('Latte');
      expect(result.current.expenses.find((e) => e.id === '1')?.price).toBe(6.0);
    });
  });

  describe('deleteExpense', () => {
    it('should delete expense successfully', async () => {
      const expense: Expense = { id: '1', name: 'Coffee', category: 'Food', date: '2024-01-01', price: 5.5 };
      mockFetch.mockResolvedValueOnce(createResponse(true, { item: expense }));
      mockFetch.mockResolvedValueOnce(createResponse(true, { id: '1' }));

      const { result } = renderHook(() => useExpenseStore());

      await act(async () => {
        await result.current.addExpense(expense);
      });

      await act(async () => {
        await result.current.deleteExpense('1');
      });

      expect(result.current.expenses.find((e) => e.id === '1')).toBeUndefined();
    });
  });

  describe('addCategory', () => {
    it('should add new category', async () => {
      mockFetch.mockResolvedValueOnce(createResponse(true, { category: 'NewCategory' }));

      const { result } = renderHook(() => useExpenseStore());

      await act(async () => {
        await result.current.addCategory('NewCategory');
      });

      expect(result.current.categories).toContain('NewCategory');
    });

    it('should not add duplicate category', async () => {
      const { result } = renderHook(() => useExpenseStore());

      await act(async () => {
        await result.current.addCategory('Food');
      });

      expect(result.current.categories.filter((cat) => cat === 'Food')).toHaveLength(1);
    });

    it('should not add empty category', async () => {
      const { result } = renderHook(() => useExpenseStore());
      const initialLength = result.current.categories.length;

      await act(async () => {
        await result.current.addCategory('');
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
