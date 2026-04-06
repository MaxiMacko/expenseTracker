import type { TabName } from '@/lib/types';

type TabSwitcherProps = {
  activeTab: TabName;
  setActiveTab: (tab: TabName) => void;
};

const tabs: { id: TabName; label: string }[] = [
  { id: 'table', label: 'Expenses' },
  { id: 'charts', label: 'Analytics' }
];

export default function TabSwitcher({ activeTab, setActiveTab }: TabSwitcherProps) {
  return (
    <div className="inline-flex overflow-hidden rounded-3xl border border-slate-200 bg-slate-50 p-1">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => setActiveTab(tab.id)}
          className={`rounded-3xl px-4 py-2 text-sm font-semibold transition ${activeTab === tab.id ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
            }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
