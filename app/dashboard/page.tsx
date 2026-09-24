'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ExpenseModal from '@/components/ExpenseModal';
import ExpenseTable from '@/components/ExpenseTable';
import ChartsTab from '@/components/ChartsTab';
import Toolbar from '@/components/Toolbar';
import TabSwitcher from '@/components/TabSwitcher';
import useExpenseStore from '@/store/useExpenseStore';

export default function DashboardPage() {
  const router = useRouter();
  const { activeTab, loadLocalState, isModalOpen, closeModal, openModalForNewExpense, expenses, filters, setFilters, setActiveTab } = useExpenseStore();
  const [username, setUsername] = useState('');
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    void loadLocalState();
    fetch('/api/auth/me').then(async (response) => {
      if (!response.ok) router.replace('/unauthorized');
      else setUsername((await response.json()).user.username);
    });
  }, [loadLocalState, router]);

  async function changePassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const response = await fetch('/api/auth/change-password', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ oldPassword: form.get('oldPassword'), newPassword: form.get('newPassword') }) });
    setMessage(response.ok ? 'Password changed.' : (await response.json()).error);
    if (response.ok) event.currentTarget.reset();
  }

  async function logout() { await fetch('/api/auth/logout', { method: 'POST' }); router.push('/login'); router.refresh(); }

  return <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8"><div className="rounded-[32px] border border-slate-200 bg-white/90 p-6 shadow-soft backdrop-blur-xl"><div className="mb-5 flex flex-wrap items-center justify-between gap-3"><span className="text-sm font-semibold text-slate-600">Signed in as <strong className="text-slate-900">{username}</strong></span><div className="flex gap-2"><button onClick={() => setShowPasswordForm(!showPasswordForm)} className="rounded-xl border border-slate-300 px-3 py-2 text-sm">Change password</button><button onClick={logout} className="rounded-xl bg-slate-900 px-3 py-2 text-sm text-white">Log out</button></div></div>{showPasswordForm && <form onSubmit={changePassword} className="mb-5 flex flex-wrap items-end gap-3 rounded-2xl bg-slate-50 p-4"><label className="text-sm">Old password<input name="oldPassword" type="password" required className="mt-1 block rounded-lg border border-slate-300 px-3 py-2" /></label><label className="text-sm">New password<input name="newPassword" type="password" minLength={6} required className="mt-1 block rounded-lg border border-slate-300 px-3 py-2" /></label><button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white">Update</button>{message && <span className="text-sm text-slate-600">{message}</span>}</form>}<Toolbar onAddExpense={openModalForNewExpense} /><div className="mt-6"><TabSwitcher activeTab={activeTab} setActiveTab={setActiveTab} /></div><div className="mt-6">{activeTab === 'table' ? <ExpenseTable expenses={expenses} filters={filters} setFilters={setFilters} /> : <ChartsTab filters={filters} setFilters={setFilters} />}</div></div><ExpenseModal open={isModalOpen} onClose={closeModal} /></main>;
}