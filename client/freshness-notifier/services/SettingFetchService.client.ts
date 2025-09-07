import FetchServiceBase from '@client-common/services/FetchServiceBase.client';
import { SettingDataType } from '@freshness-notifier/interfaces/data/SettingDataType';

export default class SettingFetchService extends FetchServiceBase<SettingDataType> {
  public constructor() {
    super('/api/settings');
  }

  public async getByTerminalId(terminalId: string): Promise<SettingDataType | null> {
    try {
      const response = await fetch(`${this.endpoint}/terminal/${terminalId}`, {
        method: 'GET'
      });

      if (response.status === 404) {
        return null;
      }

      this.validateResponse(response);
      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error getting setting by terminal ID:', error);
      throw error;
    }
  }
}