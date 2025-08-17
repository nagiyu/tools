import { NextRequest } from "next/server";

import APIUtil from '@client-common/utils/APIUtil';

import TickerDataAccessor from "@/services/ticker/TickerDataAcceesor";
import { UpdateTickerRequestType } from "@/interfaces/requests/TickerRequestType";
import { TickerDataType } from "@/interfaces/data/TickerDataType";

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id;
  const body: UpdateTickerRequestType = await request.json();
  const now = Date.now();

  const ticker: TickerDataType = {
    id: id,
    name: body.name,
    key: body.key,
    exchange: body.exchange,
    create: body.create,
    update: now
  };

  try {
    await TickerDataAccessor.update(ticker);
  } catch (error) {
    console.error(error);
    return APIUtil.ReturnBadRequest(JSON.stringify(error));
  }

  return APIUtil.ReturnSuccessWithObject(ticker);
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id;

  await TickerDataAccessor.delete(id);

  return APIUtil.ReturnSuccess();
}
