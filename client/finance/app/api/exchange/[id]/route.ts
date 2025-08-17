import { NextRequest } from "next/server";

import APIUtil from '@client-common/utils/APIUtil';

import { UpdateExchangeRequestType } from "@/interfaces/requests/ExchangeRequestType";
import { ExchangeDataType } from "@/interfaces/data/ExchangeDataType";

import ExchangeUtil from '@/utils/ExchangeUtil';

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id;
  const body: UpdateExchangeRequestType = await request.json();
  const now = Date.now();

  const exchange: ExchangeDataType = {
    id: id,
    name: body.name,
    key: body.key,
    start: body.start,
    end: body.end,
    create: body.create,
    update: now,
  };

  try {
    await ExchangeUtil.Update(exchange);
  } catch (error) {
    console.error(error);
    return APIUtil.ReturnBadRequest(JSON.stringify(error));
  }

  return APIUtil.ReturnSuccessWithObject(exchange);
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id;

  await ExchangeUtil.Delete(id);

  return APIUtil.ReturnSuccess();
}
