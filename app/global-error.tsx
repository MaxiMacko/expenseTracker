'use client';

import { useEffect } from 'react';
import * as Sentry from '@sentry/nextjs';

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="en">
      <body>
        <main className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
          <h1 className="text-3xl font-bold">Something went wrong</h1>
          <button onClick={reset} className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white">Try again</button>
        </main>
      </body>
    </html>
  );
}