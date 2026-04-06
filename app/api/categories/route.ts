import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';

const defaultCategories = ['Food', 'Transport', 'Utilities', 'Shopping', 'Subscriptions'];

const jsonError = (message: string, status = 500) => NextResponse.json({ ok: false, error: message }, { status });

export async function GET() {
  try {
    let categories = (await prisma.category.findMany({ orderBy: { name: 'asc' } })) as Array<{ name: string }>;

    if (!categories.length) {
      await prisma.category.createMany({
        data: defaultCategories.map((name) => ({ name })),
        skipDuplicates: true
      });
      categories = defaultCategories.map((name) => ({ name }));
    }

    return NextResponse.json({ ok: true, categories: categories.map((category) => category.name) });
  } catch (error) {
    return jsonError('Unable to load categories');
  }
}

export async function POST(request: NextRequest) {
  const data = await request.json();
  const category = String(data?.category ?? '').trim();

  if (!category) {
    return jsonError('Missing category', 400);
  }

  try {
    await prisma.category.upsert({
      where: { name: category },
      update: {},
      create: { name: category }
    });
    return NextResponse.json({ ok: true, category });
  } catch (error) {
    return jsonError('Unable to save category');
  }
}
