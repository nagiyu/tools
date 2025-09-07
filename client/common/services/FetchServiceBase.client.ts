import { DataTypeBase } from '@common/interfaces/data/DataTypeBase';

import ResponseValidator from '@client-common/utils/ResponseValidator';

export default abstract class FetchServiceBase<T extends DataTypeBase> {
  protected readonly endpoint: string;

  public constructor(endpoint: string) {
    this.endpoint = endpoint;
  }

  public async get(): Promise<T[]> {
    try {
      const response = await fetch(this.endpoint, {
        method: 'GET'
      });

      this.validateResponse(response);
      const result = await response.json();
      return result.data || result;
    } catch (error) {
      console.error(`Error getting data from ${this.endpoint}:`, error);
      throw error;
    }
  }

  public async getById(id: string): Promise<T | null> {
    try {
      const response = await fetch(`${this.endpoint}/${id}`, {
        method: 'GET'
      });

      if (response.status === 404) {
        return null;
      }

      this.validateResponse(response);
      const result = await response.json();
      return result.data || result;
    } catch (error) {
      console.error(`Error getting data by ID from ${this.endpoint}:`, error);
      throw error;
    }
  }

  public async create(data: T): Promise<T> {
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
      return result.data || result;
    } catch (error) {
      console.error(`Error creating data at ${this.endpoint}:`, error);
      throw error;
    }
  }

  public async update(data: T): Promise<T> {
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
      return result.data || result;
    } catch (error) {
      console.error(`Error updating data at ${this.endpoint}:`, error);
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
      console.error(`Error deleting data at ${this.endpoint}:`, error);
      throw error;
    }
  }

  protected validateResponse(response: Response): void {
    ResponseValidator.ValidateResponse(response);
  }
}
