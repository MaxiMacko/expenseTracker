import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import TabSwitcher from './TabSwitcher';
import type { TabName } from '@/lib/types';

const meta = {
  title: 'Components/TabSwitcher',
  component: TabSwitcher,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof TabSwitcher>;

export default meta;
type Story = StoryObj<typeof meta>;

export const TableActive: Story = {
  args: {
    activeTab: 'table',
    setActiveTab: () => { },
  },
};

export const ChartsActive: Story = {
  args: {
    activeTab: 'charts',
    setActiveTab: () => { },
  },
};

export const Interactive: Story = {
  render: () => {
    const [activeTab, setActiveTab] = useState<TabName>('table');
    return (
      <div className="w-full space-y-4">
        <TabSwitcher activeTab={activeTab} setActiveTab={setActiveTab} />
        <p className="text-sm text-slate-600">Active tab: <strong>{activeTab}</strong></p>
      </div>
    );
  },
};
