'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AuthForm({ mode }: { mode: 'login' | 'register' }) {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError('');
    const response = await fetch(`/api/auth/${mode}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username, password }) });
    const result = await response.json();
    if (!response.ok) {
      setError(result.error ?? 'Unable to continue.');
      setBusy(false);
      return;
    }
    router.push('/dashboard');
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="w-full max-w-md space-y-5 rounded-3xl border border-slate-200 bg-white p-8 shadow-soft">
      <div><p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">Expense Tracker</p><h1 className="mt-2 text-3xl font-bold text-slate-900">{mode === 'login' ? 'Welcome back' : 'Create your account'}</h1></div>
      <label className="block text-sm font-medium text-slate-700">Username<input required value={username} onChange={(event) => setUsername(event.target.value)} className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3" autoComplete="username" /></label>
      <label className="block text-sm font-medium text-slate-700">Password<input required type="password" minLength={6} value={password} onChange={(event) => setPassword(event.target.value)} className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3" autoComplete={mode === 'login' ? 'current-password' : 'new-password'} /></label>
      {error && <p className="text-sm text-red-600" role="alert">{error}</p>}
      <button disabled={busy} className="w-full rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white disabled:opacity-50">{busy ? 'Please wait...' : mode === 'login' ? 'Log in' : 'Register'}</button>
      <p className="text-center text-sm text-slate-600">{mode === 'login' ? <a className="text-blue-600" href="/register">Create an account</a> : <a className="text-blue-600" href="/login">Back to login</a>}</p>
    </form>
  );
}