import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ status: 'healthy' });
}

export const dynamic = 'force-dynamic';

// Disable authentication for this API route
export const config = {
  api: {
    bodyParser: true,
  },
}; 