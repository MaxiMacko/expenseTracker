import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import ExpenseTable from './ExpenseTable';
import type { Expense, ExpenseFilters } from '@/lib/types';
import { mockExpenses, mockCategories } from '@/stories/mock-store';

const meta = {
  title: 'Components/ExpenseTable',
  component: ExpenseTable,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ExpenseTable>;

export default meta;
type Story = StoryObj<typeof meta>;

const sampleExpenses: Expense[] = mockExpenses;

export const WithExpenses: Story = {
  args: {
    expenses: sampleExpenses,
    filters: { startDate: '', endDate: '', category: 'all' },
    setFilters: () => { },
  },
  decorators: [
    (Story) => (
      <div className="space-y-2 p-4 bg-slate-50">
        <div className="text-sm text-slate-600">
          <p className="font-semibold">Showing {sampleExpenses.length} mock expenses</p>
          <p className="text-xs mt-1">Categories: {mockCategories.join(', ')}</p>
        </div>
        <Story />
      </div>
    ),
  ],
};

export const Empty: Story = {
  args: {
    expenses: [],
    filters: { startDate: '', endDate: '', category: 'all' },
    setFilters: () => { },
  },
  render: (args) => (
    <div className="space-y-4 p-4 bg-slate-50">
      <p className="text-sm text-slate-600 font-semibold">No expenses to display</p>
      <ExpenseTable {...args} />
    </div>
  ),
};

export const FoodCategory: Story = {
  args: {
    expenses: sampleExpenses.filter(e => e.category === 'Food'),
    filters: { startDate: '', endDate: '', category: 'Food' },
    setFilters: () => { },
  },
  render: (args) => (
    <div className="space-y-2 p-4 bg-slate-50">
      <div className="text-sm text-slate-600">
        <p className="font-semibold">Food Category Filter</p>
        <p className="text-xs mt-1">Showing {args.expenses.length} food expenses</p>
      </div>
      <ExpenseTable {...args} />
    </div>
  ),
};

export const LargeDataset: Story = {
  args: {
    expenses: [
      ...sampleExpenses,
      ...sampleExpenses.map((e, i) => ({
        ...e,
        id: `${e.id}-${i}`,
        date: new Date(new Date(e.date).getTime() - i * 86400000).toISOString().split('T')[0],
      })),
      ...sampleExpenses.map((e, i) => ({
        ...e,
        id: `${e.id}-${i}-2`,
        date: new Date(new Date(e.date).getTime() + i * 86400000).toISOString().split('T')[0],
      })),
    ],
    filters: { startDate: '', endDate: '', category: 'all' },
    setFilters: () => { },
  },
  render: (args) => (
    <div className="space-y-2 p-4 bg-slate-50">
      <div className="text-sm text-slate-600">
        <p className="font-semibold">Large Dataset (Scrollable)</p>
        <p className="text-xs mt-1">Showing {args.expenses.length} expenses to demonstrate sorting and scrolling</p>
      </div>
      <ExpenseTable {...args} />
    </div>
  ),
};

export const Interactive: Story = {
  args: {
    expenses: sampleExpenses,
    filters: { startDate: '', endDate: '', category: 'all' },
    setFilters: () => { },
  },
  render: () => {
    const [filters, setFilters] = useState<ExpenseFilters>({
      startDate: '',
      endDate: '',
      category: 'all'
    });

    const filteredExpenses = sampleExpenses.filter(expense => {
      if (filters.category !== 'all' && expense.category !== filters.category) return false;
      if (filters.startDate && expense.date < filters.startDate) return false;
      if (filters.endDate && expense.date > filters.endDate) return false;
      return true;
    });

    const handleSetFilters = (partial: Partial<ExpenseFilters>) => {
      setFilters((prev) => ({ ...prev, ...partial }));
    };

    return (
      <div className="space-y-2 p-4 bg-slate-50">
        <div className="text-sm text-slate-600">
          <p className="font-semibold">Showing {filteredExpenses.length} of {sampleExpenses.length} expenses</p>
          {filters.category !== 'all' && <p className="text-xs mt-1">Filter: {filters.category}</p>}
        </div>
        <ExpenseTable
          expenses={filteredExpenses}
          filters={filters}
          setFilters={handleSetFilters}
        />
      </div>
    );
  },
};
