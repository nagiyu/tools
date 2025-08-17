import { NextRequest } from "next/server";

import CommonUtil from "@common/utils/CommonUtil";

import APIUtil from '@client-common/utils/APIUtil';

import TickerDataAccessor from "@/services/ticker/TickerDataAcceesor";
import { CreateTickerRequestType } from "@/interfaces/requests/TickerRequestType";
import { TickerDataType } from "@/interfaces/data/TickerDataType";

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

export async function GET() {
  const tickers = await TickerDataAccessor.get();

  return APIUtil.ReturnSuccessWithObject(tickers);
}

export async function POST(request: NextRequest) {
  const body: CreateTickerRequestType = await request.json();
  const now = Date.now();

  const ticker: TickerDataType = {
    id: CommonUtil.generateUUID(),
    name: body.name,
    key: body.key,
    exchange: body.exchange,
    create: now,
    update: now,
  }

  await TickerDataAccessor.create(ticker);

  return APIUtil.ReturnSuccessWithObject(ticker);
}
