import FetchServiceBase from '@client-common/services/FetchServiceBase.client';
import { FreshnessDataType } from '@freshness-notifier/interfaces/data/FreshnessDataType';

export default class FreshnessNotifierFetchService extends FetchServiceBase<FreshnessDataType> {
  public constructor() {
    super('/api/freshness');
  }

  public async getById(id: string): Promise<FreshnessDataType | null> {
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
      console.error('Error getting freshness item by ID:', error);
      throw error;
    }
  }

  public async get(): Promise<FreshnessDataType[]> {
    try {
      const response = await fetch(this.endpoint, {
        method: 'GET'
      });

      this.validateResponse(response);
      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error getting freshness items:', error);
      throw error;
    }
  }

  public async create(data: Omit<FreshnessDataType, 'id' | 'create' | 'update'>): Promise<FreshnessDataType> {
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
      console.error('Error creating freshness item:', error);
      throw error;
    }
  }

  public async update(data: FreshnessDataType): Promise<FreshnessDataType> {
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
      console.error('Error updating freshness item:', error);
      throw error;
    }
  }

  public async delete(id: string): Promise<void> {
    try {
      const response = await fetch(`${this.endpoint}/${id}`, {
        method: 'DELETE'
      });

      this.validateResponse(response);
    } catch (error) {
      console.error('Error deleting freshness item:', error);
      throw error;
    }
  }
}