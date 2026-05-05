'use client';

import { useEffect } from 'react';
import ExpenseModal from '@/components/ExpenseModal';
import ExpenseTable from '@/components/ExpenseTable';
import ChartsTab from '@/components/ChartsTab';
import Toolbar from '@/components/Toolbar';
import TabSwitcher from '@/components/TabSwitcher';
import useExpenseStore from '@/store/useExpenseStore';

export default function HomePage() {
  const {
    activeTab,
    loadLocalState,
    isModalOpen,
    closeModal,
    openModalForNewExpense,
    expenses,
    filters,
    setFilters,
    setActiveTab
  } = useExpenseStore();

  useEffect(() => {
    void loadLocalState();
  }, [loadLocalState]);

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="rounded-[32px] border border-slate-200 bg-white/90 p-6 shadow-soft backdrop-blur-xl">
        <Toolbar onAddExpense={openModalForNewExpense} />
        <div className="mt-6">
          <TabSwitcher activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
        <div className="mt-6">
          {activeTab === 'table' ? (
            <ExpenseTable expenses={expenses} filters={filters} setFilters={setFilters} />
          ) : (
            <ChartsTab filters={filters} setFilters={setFilters} />
          )}
        </div>
      </div>
      <ExpenseModal open={isModalOpen} onClose={closeModal} />
    </main>
  );
}
