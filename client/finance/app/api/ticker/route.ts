import { NextRequest, NextResponse } from "next/server";

import { TickerRequestType } from "@/app/interfaces/requests/TickerRequestType";

function getTickers(exchange: string): { value: string; label: string }[] {
  switch (exchange) {
    case 'NASDAQ':
      return [
        { value: 'NVDA', label: 'NVIDIA' }
      ];

    case 'TSE':
      return [
        { value: '9697', label: 'CAPCOM CO LTD' }
      ];

    default:
      return [];
  }
}

export async function POST(req: NextRequest) {
  const { exchange }: TickerRequestType = await req.json();

  const tickers = getTickers(exchange);

  return NextResponse.json(tickers);
}
