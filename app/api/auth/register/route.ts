import { NextResponse } from 'next/server';
import { createSession, hashPassword } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  const data = await request.json();
  const username = String(data?.username ?? '').trim();
  const password = String(data?.password ?? '');
  if (username.length < 3 || password.length < 6) return NextResponse.json({ error: 'Username must have 3+ characters and password 6+ characters.' }, { status: 400 });
  try {
    const user = await prisma.user.create({ data: { username, passwordHash: hashPassword(password) } });
    await createSession(user.id);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Username is already taken.' }, { status: 409 });
  }
}