import ErrorUtil from '@common/utils/ErrorUtil';
import { ExpirationData, ExpirationSettingsData } from '@tools/types/ExpirationTypes';

export default class ExpirationFetchService {
  /**
   * Fetch all expiration items for a specific terminal
   * @param terminalId The terminal ID to fetch expirations for
   * @returns Promise with array of expiration items
   */
  public static async fetchExpirations(terminalId: string): Promise<ExpirationData[]> {
    if (!terminalId) {
      return [];
    }

    try {
      const response = await fetch(`/api/expiration?terminalId=${terminalId}`);

      if (!response.ok) {
        ErrorUtil.throwError('Failed to fetch expiration items');
      }

      const { expirations } = await response.json();
      return expirations;
    } catch (error) {
      ErrorUtil.throwError('Error fetching expiration items', error);
    }
  }

  /**
   * Create a new expiration item
   * @param terminalId The terminal ID
   * @param item The expiration item data
   * @returns Promise with the created expiration item
   */
  public static async createExpiration(terminalId: string, item: Partial<ExpirationData>): Promise<ExpirationData> {
    try {
      const response = await fetch('/api/expiration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          terminalId,
          title: item.title,
          expirationDate: item.expirationDate,
          memo: item.memo,
        }),
      });

      if (!response.ok) {
        ErrorUtil.throwError('Failed to create expiration item');
      }

      const { expiration } = await response.json();
      return expiration;
    } catch (error) {
      ErrorUtil.throwError('Error creating expiration item', error);
    }
  }

  /**
   * Update an existing expiration item
   * @param terminalId The terminal ID
   * @param item The expiration item data with id
   * @returns Promise with the updated expiration item
   */
  public static async updateExpiration(terminalId: string, item: ExpirationData): Promise<ExpirationData> {
    try {
      const response = await fetch('/api/expiration', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: item.id,
          terminalId,
          title: item.title,
          expirationDate: item.expirationDate,
          memo: item.memo,
        }),
      });

      if (!response.ok) {
        ErrorUtil.throwError('Failed to update expiration item');
      }

      const { expiration } = await response.json();
      return expiration;
    } catch (error) {
      ErrorUtil.throwError('Error updating expiration item', error);
    }
  }

  /**
   * Delete an expiration item
   * @param terminalId The terminal ID
   * @param id The expiration item ID to delete
   * @returns Promise that resolves when deletion is complete
   */
  public static async deleteExpiration(terminalId: string, id: string): Promise<void> {
    try {
      const response = await fetch(`/api/expiration?terminalId=${terminalId}&id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        ErrorUtil.throwError('Failed to delete expiration item');
      }
    } catch (error) {
      ErrorUtil.throwError('Error deleting expiration item', error);
    }
  }

  /**
   * Fetch settings for a specific terminal
   * @param terminalId The terminal ID to fetch settings for
   * @returns Promise with settings data
   */
  public static async fetchSettings(terminalId: string): Promise<ExpirationSettingsData> {
    if (!terminalId) {
      throw new Error('terminalId is required');
    }

    try {
      const response = await fetch(`/api/expiration/settings?terminalId=${terminalId}`);

      if (!response.ok) {
        ErrorUtil.throwError('Failed to fetch settings');
      }

      const { settings } = await response.json();
      return settings;
    } catch (error) {
      ErrorUtil.throwError('Error fetching settings', error);
    }
  }

  /**
   * Update settings for a specific terminal
   * @param terminalId The terminal ID
   * @param notificationHour The notification hour (0-23)
   * @param daysBeforeNotify Days before expiration to notify
   * @returns Promise with updated settings data
   */
  public static async updateSettings(
    terminalId: string,
    notificationHour: number,
    daysBeforeNotify: number
  ): Promise<ExpirationSettingsData> {
    if (!terminalId) {
      throw new Error('terminalId is required');
    }

    try {
      const response = await fetch('/api/expiration/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          terminalId,
          notificationHour,
          daysBeforeNotify,
        }),
      });

      if (!response.ok) {
        ErrorUtil.throwError('Failed to update settings');
      }

      const { settings } = await response.json();
      return settings;
    } catch (error) {
      ErrorUtil.throwError('Error updating settings', error);
    }
  }
}
