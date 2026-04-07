import type { Expense } from '@/lib/types';

// Mock data
export const mockExpenses: Expense[] = [
  { id: '1', name: 'Coffee at Starbucks', category: 'Food', date: '2026-04-07', price: 5.50 },
  { id: '2', name: 'Metro Card Top-up', category: 'Transport', date: '2026-04-06', price: 25.00 },
  { id: '3', name: 'Lunch at Restaurant', category: 'Food', date: '2026-04-05', price: 12.50 },
  { id: '4', name: 'Cinema Tickets', category: 'Entertainment', date: '2026-04-04', price: 28.00 },
  { id: '5', name: 'Grocery Shopping', category: 'Food', date: '2026-04-03', price: 87.30 },
  { id: '6', name: 'Electricity Bill', category: 'Utilities', date: '2026-04-02', price: 120.00 },
  { id: '7', name: 'Gas Tank Top-up', category: 'Transport', date: '2026-04-01', price: 65.00 },
  { id: '8', name: 'Concert Tickets', category: 'Entertainment', date: '2026-03-30', price: 85.00 },
  { id: '9', name: 'Doctor Visit', category: 'Healthcare', date: '2026-03-25', price: 150.00 },
  { id: '10', name: 'New Shoes', category: 'Shopping', date: '2026-03-20', price: 120.00 },
  { id: '11', name: 'Internet Bill', category: 'Utilities', date: '2026-03-15', price: 75.00 },
  { id: '12', name: 'Bus Pass', category: 'Transport', date: '2026-03-10', price: 50.00 },
];

export const mockCategories = ['Food', 'Transport', 'Entertainment', 'Utilities', 'Shopping', 'Healthcare'];

// Mock store state
export const createMockStore = (initialExpenses = mockExpenses) => ({
  expenses: initialExpenses,
  categories: mockCategories,
  editingExpense: null,
  viewMode: 'month' as const,
  chartMode: 'month' as const,
  filters: { startDate: '', endDate: '', category: 'all' },
  activeTab: 'table' as const,
  openModalForEditExpense: () => { },
  deleteExpense: async () => { },
  addExpense: async () => { },
  updateExpense: async () => { },
  addCategory: async () => { },
  setViewMode: () => { },
  setChartMode: () => { },
  setActiveTab: () => { },
  setFilters: () => { },
  closeModal: () => { },
  openModalForNewExpense: () => { },
  loadLocalState: async () => { },
});
