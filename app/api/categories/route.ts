import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function GET() {
  return NextResponse.json({ ok: true, message: 'Client storage is the source of truth.' });
}

export async function POST(request: NextRequest) {
  const data = await request.json();
  if (!data?.category) {
    return NextResponse.json({ ok: false, error: 'Missing category' }, { status: 400 });
  }
  return NextResponse.json({ ok: true, category: data.category });
}
