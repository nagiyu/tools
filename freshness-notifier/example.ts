import FreshnessNotifierService from './services/FreshnessNotifierService';
import { FreshnessDataType } from './interfaces/data/FreshnessDataType';
import { SettingDataType } from './interfaces/data/SettingDataType';

// Example demonstrating the FreshnessNotifierService with dedicated DataServices architecture
export class FreshnessNotifierExample {
  private readonly service = new FreshnessNotifierService();

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

    await this.service.createFreshness(freshnessItem);
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

    await this.service.createSetting(settingItem);
  }

  // Example method to get all freshness items
  public async getAllFreshnessItems(): Promise<FreshnessDataType[]> {
    return await this.service.getFreshness();
  }

  // Example method to get freshness item by ID
  public async getFreshnessItemById(id: string): Promise<FreshnessDataType | null> {
    return await this.service.getFreshnessById(id);
  }

  // Example method to get all settings
  public async getAllSettings(): Promise<SettingDataType[]> {
    return await this.service.getSettings();
  }

  // Example method to get setting by terminal ID
  public async getSettingByTerminalId(terminalId: string): Promise<SettingDataType | null> {
    return await this.service.getSettingByTerminalId(terminalId);
  }

  // Example method to get setting by ID
  public async getSettingById(id: string): Promise<SettingDataType | null> {
    return await this.service.getSettingById(id);
  }

  // Example method to update a freshness item
  public async updateFreshnessItem(item: FreshnessDataType): Promise<void> {
    item.update = Date.now(); // Update timestamp
    await this.service.updateFreshness(item);
  }

  // Example method to update a setting
  public async updateSetting(setting: SettingDataType): Promise<void> {
    setting.update = Date.now(); // Update timestamp
    await this.service.updateSetting(setting);
  }

  // Example method to delete a freshness item
  public async deleteFreshnessItem(id: string): Promise<void> {
    await this.service.deleteFreshness(id);
  }

  // Example method to delete a setting
  public async deleteSetting(id: string): Promise<void> {
    await this.service.deleteSetting(id);
  }
}