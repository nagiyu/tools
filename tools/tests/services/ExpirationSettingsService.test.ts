/**
 * Tests for ExpirationSettingsService
 */

import ExpirationSettingsService from '@tools/services/ExpirationSettingsService';
import ExpirationSettingsAccessor from '@tools/accessors/ExpirationSettingsAccessor';
import { ExpirationSettingsData, ExpirationSettingsRecord } from '@tools/types/ExpirationTypes';

// Mock the accessor
jest.mock('@tools/accessors/ExpirationSettingsAccessor');

// Mock the EnvironmentalUtil
jest.mock('@common/utils/EnvironmentalUtil', () => ({
  default: {
    GetProcessEnv: jest.fn(() => 'local'),
  },
}));

describe('ExpirationSettingsService', () => {
  let service: ExpirationSettingsService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new ExpirationSettingsService();
  });

  describe('Constructor', () => {
    it('should create an instance of ExpirationSettingsService', () => {
      expect(service).toBeInstanceOf(ExpirationSettingsService);
    });

    it('should initialize with ExpirationSettingsAccessor', () => {
      expect(ExpirationSettingsAccessor).toHaveBeenCalled();
    });
  });

  describe('dataToRecord', () => {
    it('should convert ExpirationSettingsData to ExpirationSettingsRecord', () => {
      const data: Partial<ExpirationSettingsData> = {
        id: 'settings-id',
        terminalId: 'terminal-123',
        notificationHour: 9,
        daysBeforeNotify: 3,
        create: 1697000000,
        update: 1697000000,
      };

      // Access the protected method through any type assertion
      const record = (service as any).dataToRecord(data);

      expect(record.ID).toBe('settings-id');
      expect(record.TerminalID).toBe('terminal-123');
      expect(record.NotificationHour).toBe(9);
      expect(record.DaysBeforeNotify).toBe(3);
      expect(record.Create).toBe(1697000000);
      expect(record.Update).toBe(1697000000);
    });

    it('should handle partial data conversion', () => {
      const data: Partial<ExpirationSettingsData> = {
        notificationHour: 12,
        daysBeforeNotify: 5,
      };

      const record = (service as any).dataToRecord(data);

      expect(record.NotificationHour).toBe(12);
      expect(record.DaysBeforeNotify).toBe(5);
      expect(record.ID).toBeUndefined();
      expect(record.TerminalID).toBeUndefined();
    });

    it('should handle zero values correctly', () => {
      const data: Partial<ExpirationSettingsData> = {
        id: 'settings-id',
        terminalId: 'terminal-123',
        notificationHour: 0,
        daysBeforeNotify: 0,
        create: 0,
        update: 0,
      };

      const record = (service as any).dataToRecord(data);

      expect(record.NotificationHour).toBe(0);
      expect(record.DaysBeforeNotify).toBe(0);
      expect(record.Create).toBe(0);
      expect(record.Update).toBe(0);
    });
  });

  describe('recordToData', () => {
    it('should convert ExpirationSettingsRecord to ExpirationSettingsData', () => {
      const record: ExpirationSettingsRecord = {
        ID: 'settings-id',
        DataType: 'ExpirationSettings',
        TerminalID: 'terminal-123',
        NotificationHour: 9,
        DaysBeforeNotify: 3,
        Create: 1697000000,
        Update: 1697000000,
      };

      const data = (service as any).recordToData(record);

      expect(data.id).toBe('settings-id');
      expect(data.terminalId).toBe('terminal-123');
      expect(data.notificationHour).toBe(9);
      expect(data.daysBeforeNotify).toBe(3);
      expect(data.create).toBe(1697000000);
      expect(data.update).toBe(1697000000);
    });

    it('should handle null/undefined values in record', () => {
      const record: ExpirationSettingsRecord = {
        ID: null,
        DataType: 'ExpirationSettings',
        TerminalID: null,
        NotificationHour: null,
        DaysBeforeNotify: null,
        Create: null,
        Update: null,
      };

      const data = (service as any).recordToData(record);

      expect(data.id).toBe('');
      expect(data.terminalId).toBe('');
      expect(data.notificationHour).toBe(0);
      expect(data.daysBeforeNotify).toBe(0);
      expect(data.create).toBe(0);
      expect(data.update).toBe(0);
    });

    it('should handle zero values correctly', () => {
      const record: ExpirationSettingsRecord = {
        ID: 'settings-id',
        DataType: 'ExpirationSettings',
        TerminalID: 'terminal-123',
        NotificationHour: 0,
        DaysBeforeNotify: 0,
        Create: 0,
        Update: 0,
      };

      const data = (service as any).recordToData(record);

      expect(data.notificationHour).toBe(0);
      expect(data.daysBeforeNotify).toBe(0);
      expect(data.create).toBe(0);
      expect(data.update).toBe(0);
    });
  });

  describe('Data transformation round-trip', () => {
    it('should maintain data integrity through data -> record -> data conversion', () => {
      const originalData: ExpirationSettingsData = {
        id: 'settings-123',
        terminalId: 'terminal-456',
        notificationHour: 15,
        daysBeforeNotify: 7,
        create: 1697000000,
        update: 1697000100,
      };

      const record = (service as any).dataToRecord(originalData);
      const convertedData = (service as any).recordToData(record);

      expect(convertedData).toEqual(originalData);
    });

    it('should maintain data integrity with default values through round-trip conversion', () => {
      const originalData: ExpirationSettingsData = {
        id: 'settings-456',
        terminalId: 'terminal-789',
        notificationHour: 9,
        daysBeforeNotify: 3,
        create: 1697000000,
        update: 1697000100,
      };

      const record = (service as any).dataToRecord(originalData);
      const convertedData = (service as any).recordToData(record);

      expect(convertedData).toEqual(originalData);
    });

    it('should maintain data integrity with zero values through round-trip conversion', () => {
      const originalData: ExpirationSettingsData = {
        id: 'settings-789',
        terminalId: 'terminal-000',
        notificationHour: 0,
        daysBeforeNotify: 0,
        create: 0,
        update: 0,
      };

      const record = (service as any).dataToRecord(originalData);
      const convertedData = (service as any).recordToData(record);

      expect(convertedData).toEqual(originalData);
    });
  });
});
