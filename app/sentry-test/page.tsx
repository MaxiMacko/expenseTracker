'use client';

import { useState } from 'react';
import * as Sentry from '@sentry/nextjs';

export default function SentryTestPage() {
  const [status, setStatus] = useState('');

  function sendClientError() {
    const eventId = Sentry.captureException(new Error('Sentry test: client-side error'));
    setStatus(`Client event sent: ${eventId}`);
  }

  async function sendServerError() {
    setStatus('Sending server event...');
    const response = await fetch('/api/sentry-test', { method: 'POST' });
    const result = await response.json();
    setStatus(result.eventId ? `Server event sent: ${result.eventId}` : 'Server event sent.');
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <section className="w-full max-w-lg space-y-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-soft">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">Monitoring check</p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">Sentry test page</h1>
          <p className="mt-3 text-slate-600">Send a controlled test event and then find it in Sentry under Issues.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button onClick={sendClientError} className="rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white">Send client error</button>
          <button onClick={sendServerError} className="rounded-xl border border-slate-300 px-4 py-3 font-semibold text-slate-900">Send server error</button>
        </div>
        {status && <p className="rounded-xl bg-slate-50 p-3 text-sm text-slate-700" role="status">{status}</p>}
        <a href="/dashboard" className="text-sm font-semibold text-blue-600">Back to dashboard</a>
      </section>
    </main>
  );
}