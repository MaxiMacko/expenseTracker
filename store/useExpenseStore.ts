'use client';

import { create } from 'zustand';
import { endOfMonth, format, startOfMonth, subDays, subMonths } from 'date-fns';
import type { Expense, ExpenseFilters, ExpenseViewMode, TabName, ChartMode } from '@/lib/types';

const now = new Date();
const thisMonthStart = format(startOfMonth(now), 'yyyy-MM-dd');
const thisMonthEnd = format(endOfMonth(now), 'yyyy-MM-dd');

const sampleExpenses: Expense[] = [
  {
    id: 'sample-1',
    name: 'Coffee & snack',
    category: 'Food',
    date: format(now, 'yyyy-MM-dd'),
    price: 6.75
  },
  {
    id: 'sample-2',
    name: 'Grocery shopping',
    category: 'Food',
    date: format(subDays(now, 3), 'yyyy-MM-dd'),
    price: 54.22
  },
  {
    id: 'sample-3',
    name: 'Subway ride',
    category: 'Transport',
    date: format(subDays(now, 5), 'yyyy-MM-dd'),
    price: 3.9
  },
  {
    id: 'sample-4',
    name: 'Electric bill',
    category: 'Utilities',
    date: format(subDays(now, 9), 'yyyy-MM-dd'),
    price: 79.43
  },
  {
    id: 'sample-5',
    name: 'Streaming subscription',
    category: 'Subscriptions',
    date: format(subDays(now, 14), 'yyyy-MM-dd'),
    price: 12.99
  },
  {
    id: 'sample-6',
    name: 'Office desk lamp',
    category: 'Shopping',
    date: format(subMonths(now, 1), 'yyyy-MM-dd'),
    price: 38.5
  },
  {
    id: 'sample-7',
    name: 'Lunch meeting',
    category: 'Food',
    date: format(subMonths(now, 2), 'yyyy-MM-dd'),
    price: 42.8
  }
];

const sampleCategories = ['Food', 'Transport', 'Utilities', 'Shopping', 'Subscriptions'];

type ExpenseState = {
  activeTab: TabName;
  isModalOpen: boolean;
  editingExpense: Expense | null;
  expenses: Expense[];
  categories: string[];
  filters: ExpenseFilters;
  viewMode: ExpenseViewMode;
  chartMode: ChartMode;
  loadLocalState: () => void;
  setActiveTab: (tab: TabName) => void;
  openModalForNewExpense: () => void;
  openModalForEditExpense: (expense: Expense) => void;
  closeModal: () => void;
  setFilters: (filters: Partial<ExpenseFilters>) => void;
  setViewMode: (mode: ExpenseViewMode) => void;
  setChartMode: (mode: ChartMode) => void;
  addExpense: (expense: Expense) => Promise<void>;
  updateExpense: (expense: Expense) => Promise<void>;
  deleteExpense: (id: string) => Promise<void>;
  addCategory: (category: string) => void;
};

const defaultFilters: ExpenseFilters = {
  startDate: thisMonthStart,
  endDate: thisMonthEnd,
  category: 'all'
};

const defaultCategories = ['Food', 'Transport', 'Utilities', 'Shopping', 'Subscriptions'];

const useExpenseStore = create<ExpenseState>((set, get) => ({
  activeTab: 'table',
  isModalOpen: false,
  editingExpense: null,
  expenses: [],
  categories: defaultCategories,
  filters: defaultFilters,
  viewMode: 'day',
  chartMode: 'month',
  loadLocalState: async () => {
    if (typeof window === 'undefined') return;

    try {
      const [expensesResponse, categoriesResponse] = await Promise.all([
        fetch('/api/expenses'),
        fetch('/api/categories')
      ]);

      const expensesBody = expensesResponse.ok ? await expensesResponse.json() : null;
      const categoriesBody = categoriesResponse.ok ? await categoriesResponse.json() : null;

      set({
        expenses: expensesBody?.expenses ?? [],
        categories: categoriesBody?.categories ?? defaultCategories
      });
    } catch (error) {
      set({ expenses: [], categories: defaultCategories });
    }
  },
  setActiveTab: (activeTab) => set({ activeTab }),
  openModalForNewExpense: () => set({ isModalOpen: true, editingExpense: null }),
  openModalForEditExpense: (editingExpense) => set({ isModalOpen: true, editingExpense }),
  closeModal: () => set({ isModalOpen: false, editingExpense: null }),
  setFilters: (partial) => set((state) => ({ filters: { ...state.filters, ...partial } })),
  setViewMode: (viewMode) => set({ viewMode }),
  setChartMode: (chartMode) => set({ chartMode }),
  addExpense: async (expense) => {
    const response = await fetch('/api/expenses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(expense)
    });

    if (!response.ok) {
      return;
    }

    const result = await response.json();
    const createdExpense = result.item as Expense;

    set((state) => {
      const nextExpenses = [...state.expenses, createdExpense];
      const nextCategories = state.categories.includes(createdExpense.category)
        ? state.categories
        : [...state.categories, createdExpense.category];

      return {
        ...state,
        expenses: nextExpenses,
        categories: nextCategories
      };
    });
  },
  updateExpense: async (expense) => {
    const response = await fetch('/api/expenses', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(expense)
    });

    if (!response.ok) {
      return;
    }

    const result = await response.json();
    const updatedExpense = result.item as Expense;

    set((state) => {
      const updated = state.expenses.map((item) => (item.id === updatedExpense.id ? updatedExpense : item));
      const categories = state.categories.includes(updatedExpense.category)
        ? state.categories
        : [...state.categories, updatedExpense.category];

      return { ...state, expenses: updated, categories };
    });
  },
  deleteExpense: async (id) => {
    const response = await fetch(`/api/expenses?id=${id}`, {
      method: 'DELETE'
    });

    if (!response.ok) {
      return;
    }

    set((state) => ({
      ...state,
      expenses: state.expenses.filter((expense) => expense.id !== id)
    }));
  },
  addCategory: async (category) => {
    const normalized = category.trim();
    if (!normalized) return;

    if (get().categories.includes(normalized)) return;

    const response = await fetch('/api/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ category: normalized })
    });

    if (!response.ok) {
      return;
    }

    set((state) => ({
      ...state,
      categories: [...state.categories, normalized]
    }));
  }
}));

export default useExpenseStore;
