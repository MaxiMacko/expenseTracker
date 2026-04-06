export type Expense = {
  id: string;
  name: string;
  category: string;
  date: string;
  price: number;
};

export type TabName = 'table' | 'charts';
export type ExpenseViewMode = 'day' | 'month' | 'year';
export type ChartMode = 'day' | 'month' | 'year';

export type ExpenseFilters = {
  startDate: string;
  endDate: string;
  category: string;
};
