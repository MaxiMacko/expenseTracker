import { NextResponse } from 'next/server';
import * as Sentry from '@sentry/nextjs';
import { requireUser } from '@/lib/auth';

export async function POST() {
  const user = await requireUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  Sentry.setUser({ id: user.id, username: user.username });
  const eventId = Sentry.captureException(new Error('Sentry test: server-side error'));
  await Sentry.flush(2000);
  return NextResponse.json({ ok: true, eventId });
}