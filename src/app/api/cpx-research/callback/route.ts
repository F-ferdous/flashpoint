import { NextRequest, NextResponse } from 'next/server';

export async function GET(_request: NextRequest) {
  return NextResponse.json(
    { error: 'CPX Research callback has been retired.' },
    { status: 410 }
  );
}