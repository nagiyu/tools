import { NextResponse } from "next/server";

export async function GET() {
  const exchanges = [
    { value: 'NASDAQ', label: 'NASDAQ' },
    { value: 'TSE', label: 'Tokyo Stock Exchange' },
  ];

  return NextResponse.json(exchanges);
}
