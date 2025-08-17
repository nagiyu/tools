import { NextRequest } from "next/server";

import CommonUtil from "@common/utils/CommonUtil";

import APIUtil from '@client-common/utils/APIUtil';

import FinanceAuthorizer from '@/services/finance/FinanceAuthorizer';
import TickerDataAccessor from "@/services/ticker/TickerDataAcceesor";
import { CreateTickerRequestType } from "@/interfaces/requests/TickerRequestType";
import { TickerDataType } from "@/interfaces/data/TickerDataType";

export async function GET() {
  if (!await FinanceAuthorizer.isUser()) {
    return APIUtil.ReturnUnauthorized();
  }

  const tickers = await TickerDataAccessor.get();

  return APIUtil.ReturnSuccessWithObject(tickers);
}

export async function POST(request: NextRequest) {
  if (!await FinanceAuthorizer.isAdmin()) {
    return APIUtil.ReturnUnauthorized();
  }

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
