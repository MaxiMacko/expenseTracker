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

const STORAGE_KEY = 'expense-tracker-state';

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
  loadLocalState: () => {
    if (typeof window === 'undefined') return;
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved) as { expenses: Expense[]; categories: string[] };
      set({ expenses: parsed.expenses || [], categories: parsed.categories || defaultCategories });
      return;
    }

    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ expenses: sampleExpenses, categories: sampleCategories })
    );
    set({ expenses: sampleExpenses, categories: sampleCategories });
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
    set((state) => {
      const next = { ...state, expenses: [...state.expenses, expense] };
      if (!state.categories.includes(expense.category)) {
        next.categories = [...state.categories, expense.category];
      }
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ expenses: next.expenses, categories: next.categories }));
      return next;
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
    set((state) => {
      const updated = state.expenses.map((item) => (item.id === expense.id ? expense : item));
      const categories = state.categories.includes(expense.category)
        ? state.categories
        : [...state.categories, expense.category];
      const next = { ...state, expenses: updated, categories };
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ expenses: next.expenses, categories: next.categories }));
      return next;
    });
  },
  deleteExpense: async (id) => {
    const response = await fetch(`/api/expenses?id=${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) {
      return;
    }
    set((state) => {
      const updated = state.expenses.filter((expense) => expense.id !== id);
      const next = { ...state, expenses: updated };
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ expenses: next.expenses, categories: next.categories }));
      return next;
    });
  },
  addCategory: (category) =>
    set((state) => {
      const normalized = category.trim();
      if (!normalized || state.categories.includes(normalized)) return state;
      const next = { ...state, categories: [...state.categories, normalized] };
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ expenses: next.expenses, categories: next.categories }));
      return next;
    })
}));

export default useExpenseStore;
