import ResponseValidator from "@client-common/utils/ResponseValidator";

import { ExchangeDataType } from "@/interfaces/data/ExchangeDataType";
import { CreateExchangeRequestType, UpdateExchangeRequestType } from "@/interfaces/requests/ExchangeRequestType";

export default class ExchangeAPIUtil {
  public static async get(): Promise<ExchangeDataType[]> {
    const response = await fetch('/api/exchange', {
      method: 'GET'
    });

    ResponseValidator.ValidateResponse(response);

    return await response.json();
  }

  public static async create(data: CreateExchangeRequestType): Promise<ExchangeDataType> {
    const response = await fetch('/api/exchange', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    ResponseValidator.ValidateResponse(response);

    return await response.json();
  }

  public static async update(id: string, data: UpdateExchangeRequestType): Promise<ExchangeDataType> {
    const response = await fetch(`/api/exchange/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    ResponseValidator.ValidateResponse(response);

    return await response.json();
  }

  public static async delete(id: string): Promise<void> {
    const response = await fetch(`/api/exchange/${id}`, {
      method: 'DELETE'
    });

    ResponseValidator.ValidateResponse(response);
  }
}
