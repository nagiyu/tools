import ResponseValidator from "@client-common/utils/ResponseValidator";

import { TickerDataType } from "@/interfaces/data/TickerDataType";
import { CreateTickerRequestType, UpdateTickerRequestType } from "@/interfaces/requests/TickerRequestType";

export default class TickerAPIUtil {
  public static async get(): Promise<TickerDataType[]> {
    const response = await fetch('/api/ticker', {
      method: 'GET'
    });

    ResponseValidator.ValidateResponse(response);

    return await response.json();
  }

  public static async create(data: CreateTickerRequestType): Promise<TickerDataType> {
    const response = await fetch('/api/ticker', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    ResponseValidator.ValidateResponse(response);

    return await response.json();
  }

  public static async update(id: string, data: UpdateTickerRequestType): Promise<TickerDataType> {
    const response = await fetch(`/api/ticker/${id}`, {
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
    const response = await fetch(`/api/ticker/${id}`, {
      method: 'DELETE'
    });

    ResponseValidator.ValidateResponse(response);
  }
}
