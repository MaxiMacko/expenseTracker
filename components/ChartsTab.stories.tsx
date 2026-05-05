import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import ChartsTab from './ChartsTab';
import type { ExpenseFilters } from '@/lib/types';
import { mockExpenses, mockCategories } from '@/stories/mock-store';

const meta = {
  title: 'Components/ChartsTab',
  component: ChartsTab,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ChartsTab>;

export default meta;
type Story = StoryObj<typeof meta>;

const defaultFilters: ExpenseFilters = {
  startDate: '',
  endDate: '',
  category: 'all'
};

/**
 * ChartsTab displays expenses as interactive pie and bar charts.
 * You can toggle different time periods (day, month, year) and 
 * enable/disable specific categories in the pie chart.
 */
export const WithMockData: Story = {
  render: () => {
    const totalByCategory = mockExpenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.price;
      return acc;
    }, {} as Record<string, number>);

    return (
      <div className="space-y-4 p-4 bg-slate-50">
        <div className="text-sm text-slate-600">
          <p className="font-semibold">Mock Data Distribution</p>
          <p className="text-xs mt-2">Total: €{Object.values(totalByCategory).reduce((a, b) => a + b, 0).toFixed(2)}</p>
          <div className="mt-2 space-y-1 text-xs">
            {Object.entries(totalByCategory).map(([category, total]) => (
              <p key={category}>
                <span className="font-medium">{category}:</span> €{total.toFixed(2)}
              </p>
            ))}
          </div>
        </div>
        <ChartsTab
          mockExpenses={mockExpenses}
          mockChartMode="month"
          filters={defaultFilters}
          setFilters={() => { }}
        />
      </div>
    );
  },
};

/**
 * All supported categories displayed in the pie chart.
 */
export const AllCategories: Story = {
  render: () => (
    <div className="space-y-4 p-4 bg-slate-50">
      <div className="text-sm text-slate-600">
        <p className="font-semibold">All Categories Available</p>
        <p className="text-xs mt-2">Categories: {mockCategories.join(', ')}</p>
        <p className="text-xs mt-1">Toggle categories in the pie chart to filter the view</p>
      </div>
      <ChartsTab
        mockExpenses={mockExpenses}
        mockChartMode="month"
        filters={defaultFilters}
        setFilters={() => { }}
      />
    </div>
  ),
};

/**
 * Example showing multiple time periods for comparison.
 */
export const TimeSeriesData: Story = {
  render: () => (
    <div className="space-y-4 p-4 bg-slate-50">
      <div className="text-sm text-slate-600">
        <p className="font-semibold">Time Series Analysis</p>
        <p className="text-xs mt-2">
          Showing {mockExpenses.length} expenses across different dates
        </p>
        <p className="text-xs mt-1">
          Use the time period selector to view Day, Month, or Year analysis
        </p>
      </div>
      <ChartsTab
        mockExpenses={mockExpenses}
        mockChartMode="year"
        filters={defaultFilters}
        setFilters={() => { }}
      />
    </div>
  ),
};

/**
 * Interactive story with date range and category filtering.
 * Users can select custom date ranges and filter by category.
 */
export const Interactive: Story = {
  args: {
    mockExpenses: mockExpenses,
    mockChartMode: 'month' as const,
    filters: defaultFilters,
    setFilters: () => { },
  },
  render: () => {
    const [filters, setFilters] = useState<ExpenseFilters>({
      startDate: '',
      endDate: '',
      category: 'all'
    });

    const handleSetFilters = (partial: Partial<ExpenseFilters>) => {
      setFilters((prev) => ({ ...prev, ...partial }));
    };

    const filteredCount = mockExpenses.filter(expense => {
      if (filters.category !== 'all' && expense.category !== filters.category) return false;
      if (filters.startDate && expense.date < filters.startDate) return false;
      if (filters.endDate && expense.date > filters.endDate) return false;
      return true;
    }).length;

    return (
      <div className="space-y-4 p-4 bg-slate-50">
        <div className="text-sm text-slate-600">
          <p className="font-semibold">Interactive Analytics</p>
          <p className="text-xs mt-2">
            Showing {filteredCount} of {mockExpenses.length} expenses
          </p>
          {filters.category !== 'all' && (
            <p className="text-xs mt-1">Category filter: <strong>{filters.category}</strong></p>
          )}
          {filters.startDate && (
            <p className="text-xs mt-1">From: <strong>{filters.startDate}</strong></p>
          )}
          {filters.endDate && (
            <p className="text-xs mt-1">To: <strong>{filters.endDate}</strong></p>
          )}
        </div>
        <ChartsTab
          mockExpenses={mockExpenses}
          mockChartMode="month"
          filters={filters}
          setFilters={handleSetFilters}
        />
      </div>
    );
  },
};
