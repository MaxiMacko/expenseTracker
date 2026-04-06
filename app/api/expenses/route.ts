import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { Expense } from '@/lib/types';

export async function GET() {
  return NextResponse.json({ ok: true, message: 'Client storage is the source of truth.' });
}

export async function POST(request: NextRequest) {
  const data = (await request.json()) as Partial<Expense>;
  if (!data.name || !data.category || !data.date || !data.price) {
    return NextResponse.json({ ok: false, error: 'Missing required fields' }, { status: 400 });
  }
  return NextResponse.json({ ok: true, message: 'Expense create validated.', item: data });
}

export async function PATCH(request: NextRequest) {
  const data = (await request.json()) as Partial<Expense>;
  if (!data.id) {
    return NextResponse.json({ ok: false, error: 'Missing expense ID' }, { status: 400 });
  }
  return NextResponse.json({ ok: true, message: 'Expense update validated.', item: data });
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) {
    return NextResponse.json({ ok: false, error: 'Missing expense ID' }, { status: 400 });
  }
  return NextResponse.json({ ok: true, message: 'Expense delete validated.', id });
}
