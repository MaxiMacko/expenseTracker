import { NextResponse } from 'next/server';
import { createSession, verifyPassword } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  const data = await request.json();
  const user = await prisma.user.findUnique({ where: { username: String(data?.username ?? '').trim() } });
  if (!user || !verifyPassword(String(data?.password ?? ''), user.passwordHash)) return NextResponse.json({ error: 'Invalid username or password.' }, { status: 401 });
  await createSession(user.id);
  return NextResponse.json({ ok: true });
}