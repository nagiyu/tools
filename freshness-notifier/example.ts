import FreshnessService from './services/FreshnessService';
import SettingService from './services/SettingService';
import { FreshnessDataType } from './interfaces/data/FreshnessDataType';
import { SettingDataType } from './interfaces/data/SettingDataType';

// Example demonstrating the freshness notifier services
export class FreshnessNotifierExample {
  private readonly freshnessService = new FreshnessService();
  private readonly settingService = new SettingService();

  // Example method to create a freshness item
  public async createFreshnessItem(name: string, expiryDate: string, notificationEnabled: boolean = true): Promise<void> {
    const freshnessItem: FreshnessDataType = {
      id: `freshness_${Date.now()}`,
      name,
      expiryDate,
      notificationEnabled,
      create: Date.now(),
      update: Date.now(),
    };

    await this.freshnessService.create(freshnessItem);
  }

  // Example method to create a setting item
  public async createSetting(
    terminalId: string,
    subscriptionEndpoint: string,
    subscriptionKeysP256dh: string,
    subscriptionKeysAuth: string,
    notificationTime: number = 9, // Default to 9 AM
    notificationEnabled: boolean = true
  ): Promise<void> {
    const settingItem: SettingDataType = {
      id: `setting_${Date.now()}`,
      terminalId,
      subscriptionEndpoint,
      subscriptionKeysP256dh,
      subscriptionKeysAuth,
      notificationEnabled,
      notificationTime,
      create: Date.now(),
      update: Date.now(),
    };

    await this.settingService.create(settingItem);
  }

  // Example method to get all freshness items
  public async getAllFreshnessItems(): Promise<FreshnessDataType[]> {
    return await this.freshnessService.get();
  }

  // Example method to get setting by terminal ID
  public async getSettingByTerminalId(terminalId: string): Promise<SettingDataType | null> {
    return await this.settingService.getByTerminalId(terminalId);
  }
}