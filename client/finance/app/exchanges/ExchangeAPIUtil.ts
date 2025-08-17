import ResponseValidator from "@client-common/utils/ResponseValidator";

import { ExchangeDataType } from "@/interfaces/data/ExchangeDataType";

export default class ExchangeAPIUtil {
  public static async get(): Promise<ExchangeDataType[]> {
    const response = await fetch('/api/exchange', {
      method: 'GET'
    });

    ResponseValidator.ValidateResponse(response);

    return await response.json();
  }
}
