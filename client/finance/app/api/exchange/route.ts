import { NextRequest } from "next/server";

import CommonUtil from "@common/utils/CommonUtil";

import APIUtil from '@client-common/utils/APIUtil';

import { CreateExchangeRequestType } from "@/interfaces/requests/ExchangeRequestType";
import { ExchangeDataType } from "@/interfaces/data/ExchangeDataType";

import ExchangeUtil from '@/utils/ExchangeUtil';

export async function GET() {
  const exchanges = await ExchangeUtil.GetAll();

  return APIUtil.ReturnSuccessWithObject(exchanges);
}

export async function POST(request: NextRequest) {
  const body: CreateExchangeRequestType = await request.json();
  const now = Date.now();

  const exchange: ExchangeDataType = {
    id: CommonUtil.generateUUID(),
    name: body.name,
    start: body.start,
    end: body.end,
    create: now,
    update: now,
  };

  await ExchangeUtil.Create(exchange);

  return APIUtil.ReturnSuccessWithObject(exchange);
}
