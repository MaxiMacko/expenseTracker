import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireUser } from '@/lib/auth';
import { captureServerException } from '@/lib/monitoring';

const defaultCategories = ['Food', 'Transport', 'Utilities', 'Shopping', 'Subscriptions'];

const jsonError = (message: string, status = 500) => NextResponse.json({ ok: false, error: message }, { status });

export async function GET() {
  try {
    const user = await requireUser();
    if (!user) return jsonError('Unauthorized', 401);
    let categories = (await prisma.category.findMany({ where: { userId: user.id }, orderBy: { name: 'asc' } })) as Array<{ name: string }>;

    if (!categories.length) {
      await prisma.category.createMany({
        data: defaultCategories.map((name) => ({ name, userId: user.id })),
        skipDuplicates: true
      });
      categories = defaultCategories.map((name) => ({ name }));
    }

    return NextResponse.json({ ok: true, categories: categories.map((category) => category.name) });
  } catch (error) {
    captureServerException(error, { operation: 'categories.get' });
    return jsonError('Unable to load categories');
  }
}

export async function POST(request: NextRequest) {
  const user = await requireUser();
  if (!user) return jsonError('Unauthorized', 401);
  const data = await request.json();
  const category = String(data?.category ?? '').trim();

  if (!category) {
    return jsonError('Missing category', 400);
  }

  try {
    await prisma.category.upsert({
      where: { userId_name: { userId: user.id, name: category } },
      update: {},
      create: { name: category, userId: user.id }
    });
    return NextResponse.json({ ok: true, category });
  } catch (error) {
    captureServerException(error, { operation: 'categories.create', userId: user.id });
    return jsonError('Unable to save category');
  }
}
