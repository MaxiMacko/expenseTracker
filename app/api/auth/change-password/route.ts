import { NextResponse } from 'next/server';
import { hashPassword, requireUser, verifyPassword } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  const user = await requireUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const data = await request.json();
  if (!verifyPassword(String(data?.oldPassword ?? ''), user.passwordHash)) return NextResponse.json({ error: 'Old password is incorrect.' }, { status: 400 });
  const newPassword = String(data?.newPassword ?? '');
  if (newPassword.length < 6) return NextResponse.json({ error: 'New password must have 6+ characters.' }, { status: 400 });
  await prisma.user.update({ where: { id: user.id }, data: { passwordHash: hashPassword(newPassword) } });
  return NextResponse.json({ ok: true });
}