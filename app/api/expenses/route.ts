import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireUser } from '@/lib/auth';
import type { Expense } from '@/lib/types';

const serializeExpense = (expense: { id: string; name: string; category: string; date: Date; price: number }) => ({
  id: expense.id,
  name: expense.name,
  category: expense.category,
  date: expense.date.toISOString().slice(0, 10),
  price: expense.price
});

const jsonError = (message: string, status = 500) => NextResponse.json({ ok: false, error: message }, { status });

export async function GET() {
  try {
    const user = await requireUser();
    if (!user) return jsonError('Unauthorized', 401);
    const expenses = await prisma.expense.findMany({ where: { userId: user.id }, orderBy: { date: 'desc' } });
    return NextResponse.json({ ok: true, expenses: expenses.map(serializeExpense) });
  } catch (error) {
    return jsonError('Unable to load expenses');
  }
}

export async function POST(request: NextRequest) {
  const user = await requireUser();
  if (!user) return jsonError('Unauthorized', 401);
  const data = (await request.json()) as Partial<Expense>;
  if (!data.name || !data.category || !data.date || typeof data.price !== 'number') {
    return jsonError('Missing required fields', 400);
  }

  const parsedDate = new Date(data.date);
  if (Number.isNaN(parsedDate.getTime())) {
    return jsonError('Invalid date', 400);
  }

  try {
    const expense = await prisma.expense.create({
      data: {
        id: data.id,
        userId: user.id,
        name: data.name.trim(),
        category: data.category.trim(),
        date: parsedDate,
        price: data.price
      }
    });

    return NextResponse.json({ ok: true, message: 'Expense created successfully.', item: serializeExpense(expense) });
  } catch (error) {
    return jsonError('Unable to create expense');
  }
}

export async function PATCH(request: NextRequest) {
  const user = await requireUser();
  if (!user) return jsonError('Unauthorized', 401);
  const data = (await request.json()) as Partial<Expense>;
  if (!data.id) {
    return jsonError('Missing expense ID', 400);
  }

  try {
    const updatePayload: { name?: string; category?: string; date?: Date; price?: number } = {};

    if (data.name) updatePayload.name = data.name.trim();
    if (data.category) updatePayload.category = data.category.trim();
    if (data.date) {
      const parsedDate = new Date(data.date);
      if (Number.isNaN(parsedDate.getTime())) {
        return jsonError('Invalid date', 400);
      }
      updatePayload.date = parsedDate;
    }
    if (typeof data.price === 'number') updatePayload.price = data.price;

    const expense = await prisma.expense.update({
      where: { id: data.id, userId: user.id },
      data: updatePayload
    });

    return NextResponse.json({ ok: true, message: 'Expense updated successfully.', item: serializeExpense(expense) });
  } catch (error) {
    return jsonError('Unable to update expense', 500);
  }
}

export async function DELETE(request: NextRequest) {
  const user = await requireUser();
  if (!user) return jsonError('Unauthorized', 401);
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) {
    return jsonError('Missing expense ID', 400);
  }

  try {
    await prisma.expense.delete({ where: { id, userId: user.id } });
    return NextResponse.json({ ok: true, message: 'Expense deleted successfully.', id });
  } catch (error) {
    return jsonError('Expense not found', 404);
  }
}
