import ErrorUtil from '@common/utils/ErrorUtil';
import { ExpirationSettingsData } from '@tools/types/ExpirationTypes';

export default class ExpirationSettingsFetchService {
  /**
   * Fetch expiration settings for a specific terminal
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
        ErrorUtil.throwError('Failed to fetch expiration settings');
      }

      const { settings } = await response.json();
      return settings;
    } catch (error) {
      ErrorUtil.throwError('Error fetching expiration settings', error);
    }
  }

  /**
   * Update or create expiration settings
   * @param terminalId The terminal ID
   * @param settings Partial settings to update
   * @returns Promise with the updated settings
   */
  public static async updateSettings(
    terminalId: string,
    settings: Partial<ExpirationSettingsData>
  ): Promise<ExpirationSettingsData> {
    try {
      const response = await fetch('/api/expiration/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          terminalId,
          notificationHour: settings.notificationHour,
          daysBeforeNotify: settings.daysBeforeNotify,
        }),
      });

      if (!response.ok) {
        ErrorUtil.throwError('Failed to update expiration settings');
      }

      const { settings: updatedSettings } = await response.json();
      return updatedSettings;
    } catch (error) {
      ErrorUtil.throwError('Error updating expiration settings', error);
    }
  }

  /**
   * Delete expiration settings
   * @param terminalId The terminal ID
   * @returns Promise that resolves when deletion is complete
   */
  public static async deleteSettings(terminalId: string): Promise<void> {
    try {
      const response = await fetch(`/api/expiration/settings?terminalId=${terminalId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        ErrorUtil.throwError('Failed to delete expiration settings');
      }
    } catch (error) {
      ErrorUtil.throwError('Error deleting expiration settings', error);
    }
  }
}
