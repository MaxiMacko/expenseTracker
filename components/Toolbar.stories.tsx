import type { Meta, StoryObj } from '@storybook/react';
import Toolbar from './Toolbar';

const meta = {
  title: 'Components/Toolbar',
  component: Toolbar,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Toolbar>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Toolbar displays the application header with logo/title and action buttons.
 */
export const Default: Story = {
  args: {
    onAddExpense: () => alert('Add expense clicked'),
  },
  render: (args) => (
    <div className="bg-gradient-to-r from-sky-50 to-blue-50 p-4">
      <Toolbar {...args} />
      <p className="text-xs text-slate-600 mt-4">Click "Add Expense" button to trigger the action</p>
    </div>
  ),
};

/**
 * Shows the toolbar in an interactive state with action feedback.
 */
export const Interactive: Story = {
  args: {
    onAddExpense: () => alert('Opening expense modal...'),
  },
  render: (args) => (
    <div className="bg-gradient-to-r from-sky-50 to-blue-50 p-4">
      <Toolbar {...args} />
      <p className="text-xs text-slate-600 mt-4">Click button to add a new expense to the tracker</p>
    </div>
  ),
};
