import ErrorUtil from '@common/utils/ErrorUtil';

interface NotificationSetting {
  enabled: boolean;
  notificationHour: number;
  timezone: string;
}

export default class ToDoNotificationFetchService {
  /**
   * Fetch notification settings for a specific terminal
   * @param terminalId The terminal ID to fetch settings for
   * @returns Promise with notification settings
   */
  public static async fetchNotificationSettings(terminalId: string): Promise<NotificationSetting> {
    if (!terminalId) {
      ErrorUtil.throwError('terminalId is required');
    }

    try {
      const response = await fetch(`/api/todo/notification?terminalId=${terminalId}`);

      if (!response.ok) {
        ErrorUtil.throwError('Failed to fetch notification settings');
      }

      const data = await response.json();
      return {
        enabled: data.enabled,
        notificationHour: data.notificationHour,
        timezone: data.timezone,
      };
    } catch (error) {
      ErrorUtil.throwError('Error fetching notification settings', error);
    }
  }

  /**
   * Save notification settings for a terminal
   * @param terminalId The terminal ID
   * @param settings The notification settings to save
   * @returns Promise that resolves when save is complete
   */
  public static async saveNotificationSettings(
    terminalId: string,
    settings: NotificationSetting
  ): Promise<void> {
    if (!terminalId) {
      ErrorUtil.throwError('terminalId is required');
    }

    try {
      const response = await fetch('/api/todo/notification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          terminalId,
          enabled: settings.enabled,
          notificationHour: settings.notificationHour,
          timezone: settings.timezone,
        }),
      });

      if (!response.ok) {
        ErrorUtil.throwError('Failed to save notification settings');
      }
    } catch (error) {
      ErrorUtil.throwError('Error saving notification settings', error);
    }
  }
}
