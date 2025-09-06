import FreshnessDataService from '@freshness-notifier/services/FreshnessDataService';
import SettingDataService from '@freshness-notifier/services/SettingDataService';
import { FreshnessDataType } from '@freshness-notifier/interfaces/data/FreshnessDataType';
import { SettingDataType } from '@freshness-notifier/interfaces/data/SettingDataType';

export default class FreshnessNotifierService {
  private readonly freshnessDataService: FreshnessDataService;
  private readonly settingDataService: SettingDataService;

  public constructor() {
    this.freshnessDataService = new FreshnessDataService();
    this.settingDataService = new SettingDataService();
  }

  // Freshness-related operations
  public async createFreshness(data: FreshnessDataType): Promise<void> {
    return await this.freshnessDataService.create(data);
  }

  public async getFreshness(): Promise<FreshnessDataType[]> {
    return await this.freshnessDataService.get();
  }

  public async getFreshnessById(id: string): Promise<FreshnessDataType | null> {
    return await this.freshnessDataService.getById(id);
  }

  public async updateFreshness(data: FreshnessDataType): Promise<void> {
    return await this.freshnessDataService.update(data);
  }

  public async deleteFreshness(id: string): Promise<void> {
    return await this.freshnessDataService.delete(id);
  }

  // Setting-related operations
  public async createSetting(data: SettingDataType): Promise<void> {
    return await this.settingDataService.create(data);
  }

  public async getSettings(): Promise<SettingDataType[]> {
    return await this.settingDataService.get();
  }

  public async getSettingById(id: string): Promise<SettingDataType | null> {
    return await this.settingDataService.getById(id);
  }

  public async getSettingByTerminalId(terminalId: string): Promise<SettingDataType | null> {
    return await this.settingDataService.getByTerminalId(terminalId);
  }

  public async updateSetting(data: SettingDataType): Promise<void> {
    return await this.settingDataService.update(data);
  }

  public async deleteSetting(id: string): Promise<void> {
    return await this.settingDataService.delete(id);
  }
}