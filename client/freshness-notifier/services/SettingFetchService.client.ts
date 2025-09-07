import FetchServiceBase from '@client-common/services/FetchServiceBase.client';
import { SettingDataType } from '@freshness-notifier/interfaces/data/SettingDataType';

export default class SettingFetchService extends FetchServiceBase<SettingDataType> {
  public constructor() {
    super('/api/settings');
  }

  public async getById(id: string): Promise<SettingDataType | null> {
    try {
      const response = await fetch(`${this.endpoint}/${id}`, {
        method: 'GET'
      });

      if (response.status === 404) {
        return null;
      }

      this.validateResponse(response);
      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error getting setting by ID:', error);
      throw error;
    }
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

  public override async get(): Promise<SettingDataType[]> {
    try {
      const response = await fetch(this.endpoint, {
        method: 'GET'
      });

      this.validateResponse(response);
      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error getting settings:', error);
      throw error;
    }
  }

  public override async create(data: Omit<SettingDataType, 'id' | 'create' | 'update'>): Promise<SettingDataType> {
    try {
      const response = await fetch(this.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      this.validateResponse(response);
      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error creating setting:', error);
      throw error;
    }
  }

  public override async update(data: SettingDataType): Promise<SettingDataType> {
    try {
      const response = await fetch(`${this.endpoint}/${data.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      this.validateResponse(response);
      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error updating setting:', error);
      throw error;
    }
  }

  public override async delete(id: string): Promise<void> {
    try {
      const response = await fetch(`${this.endpoint}/${id}`, {
        method: 'DELETE'
      });

      this.validateResponse(response);
    } catch (error) {
      console.error('Error deleting setting:', error);
      throw error;
    }
  }
}