import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import ExpenseModal from './ExpenseModal';
import { mockCategories, mockExpenses } from '@/stories/mock-store';

const meta = {
  title: 'Components/ExpenseModal',
  component: ExpenseModal,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ExpenseModal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AddNewExpense: Story = {
  args: {
    open: true,
    onClose: () => console.log('Modal closed'),
  },
  parameters: {
    mockData: {
      categories: mockCategories,
      editingExpense: null,
    },
  },
  decorators: [
    (Story) => (
      <div className="bg-white">
        <Story />
        <p className="mt-4 text-xs text-slate-500 px-4">Mock: Adding new expense with categories: {mockCategories.join(', ')}</p>
      </div>
    ),
  ],
};

export const EditExistingExpense: Story = {
  args: {
    open: true,
    onClose: () => console.log('Modal closed'),
  },
  parameters: {
    mockData: {
      categories: mockCategories,
      editingExpense: mockExpenses[0], // Coffee expense
    },
  },
  decorators: [
    (Story) => (
      <div className="bg-white">
        <Story />
        <p className="mt-4 text-xs text-slate-500 px-4">Mock: Editing "{mockExpenses[0].name}" (€{mockExpenses[0].price})</p>
      </div>
    ),
  ],
};

export const Closed: Story = {
  args: {
    open: false,
    onClose: () => console.log('Modal closed'),
  },
  render: (args) => (
    <div className="p-4">
      <p className="mb-4 text-sm text-slate-600">Modal is closed. It will appear when open={true}</p>
      <ExpenseModal {...args} />
    </div>
  ),
};

export const Interactive: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <div className="p-4">
        <button
          onClick={() => setOpen(true)}
          className="px-4 py-2 bg-sky-600 text-white rounded text-sm font-semibold hover:bg-sky-700"
        >
          Open Modal
        </button>
        <ExpenseModal open={open} onClose={() => setOpen(false)} />
        {open && (
          <p className="mt-4 text-xs text-slate-500">
            Mock Categories: {mockCategories.join(', ')}
          </p>
        )}
      </div>
    );
  },
};
