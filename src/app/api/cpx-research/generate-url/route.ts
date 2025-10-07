import { NextRequest, NextResponse } from 'next/server';

export async function GET(_request: NextRequest) {
  // CPX Research has been removed from the application.
  // Keeping this endpoint to avoid runtime errors; returns 410 Gone.
  return NextResponse.json(
    { error: 'CPX Research integration has been retired. Please use AdGem.' },
    { status: 410 }
  );
}