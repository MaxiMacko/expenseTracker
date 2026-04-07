import type { Meta, StoryObj } from '@storybook/react';
import ChartsTab from './ChartsTab';
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
        <ChartsTab mockExpenses={mockExpenses} mockChartMode="month" />
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
      <ChartsTab mockExpenses={mockExpenses} mockChartMode="month" />
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
      <ChartsTab mockExpenses={mockExpenses} mockChartMode="year" />
    </div>
  ),
};
