/**
 * Tests for ExpirationService
 */

import ExpirationService from '@tools/services/ExpirationService';
import ExpirationDataAccessor from '@tools/accessors/ExpirationDataAccessor';
import { ExpirationData, ExpirationRecord } from '@tools/types/ExpirationTypes';

// Mock the accessor
jest.mock('@tools/accessors/ExpirationDataAccessor');

// Mock the EnvironmentalUtil
jest.mock('@common/utils/EnvironmentalUtil', () => ({
  default: {
    GetProcessEnv: jest.fn(() => 'local'),
  },
}));

describe('ExpirationService', () => {
  let service: ExpirationService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new ExpirationService();
  });

  describe('Constructor', () => {
    it('should create an instance of ExpirationService', () => {
      expect(service).toBeInstanceOf(ExpirationService);
    });

    it('should initialize with ExpirationDataAccessor', () => {
      expect(ExpirationDataAccessor).toHaveBeenCalled();
    });
  });

  describe('dataToRecord', () => {
    it('should convert ExpirationData to ExpirationRecord', () => {
      const data: Partial<ExpirationData> = {
        id: 'test-id',
        terminalId: 'terminal-123',
        title: 'Milk',
        expirationDate: '2024-10-20',
        memo: 'Opened',
        create: 1697000000,
        update: 1697000000,
      };

      // Access the protected method through any type assertion
      const record = (service as any).dataToRecord(data);

      expect(record.ID).toBe('test-id');
      expect(record.TerminalID).toBe('terminal-123');
      expect(record.Title).toBe('Milk');
      expect(record.ExpirationDate).toBe('2024-10-20');
      expect(record.Memo).toBe('Opened');
      expect(record.Create).toBe(1697000000);
      expect(record.Update).toBe(1697000000);
    });

    it('should handle partial data conversion', () => {
      const data: Partial<ExpirationData> = {
        title: 'Bread',
        expirationDate: '2024-10-21',
      };

      const record = (service as any).dataToRecord(data);

      expect(record.Title).toBe('Bread');
      expect(record.ExpirationDate).toBe('2024-10-21');
      expect(record.ID).toBeUndefined();
      expect(record.TerminalID).toBeUndefined();
    });

    it('should handle data without memo', () => {
      const data: Partial<ExpirationData> = {
        id: 'test-id',
        terminalId: 'terminal-123',
        title: 'Bread',
        expirationDate: '2024-10-21',
        create: 1697000000,
        update: 1697000000,
      };

      const record = (service as any).dataToRecord(data);

      expect(record.Memo).toBeUndefined();
      expect(record.Title).toBe('Bread');
    });
  });

  describe('recordToData', () => {
    it('should convert ExpirationRecord to ExpirationData', () => {
      const record: ExpirationRecord = {
        ID: 'test-id',
        DataType: 'Expiration',
        TerminalID: 'terminal-123',
        Title: 'Milk',
        ExpirationDate: '2024-10-20',
        Memo: 'Opened',
        Create: 1697000000,
        Update: 1697000000,
      };

      const data = (service as any).recordToData(record);

      expect(data.id).toBe('test-id');
      expect(data.terminalId).toBe('terminal-123');
      expect(data.title).toBe('Milk');
      expect(data.expirationDate).toBe('2024-10-20');
      expect(data.memo).toBe('Opened');
      expect(data.create).toBe(1697000000);
      expect(data.update).toBe(1697000000);
    });

    it('should handle record without memo', () => {
      const record: ExpirationRecord = {
        ID: 'test-id',
        DataType: 'Expiration',
        TerminalID: 'terminal-123',
        Title: 'Bread',
        ExpirationDate: '2024-10-21',
        Create: 1697000000,
        Update: 1697000000,
      };

      const data = (service as any).recordToData(record);

      expect(data.memo).toBeUndefined();
      expect(data.title).toBe('Bread');
    });

    it('should handle null/undefined values in record', () => {
      const record: ExpirationRecord = {
        ID: null,
        DataType: 'Expiration',
        TerminalID: null,
        Title: null,
        ExpirationDate: null,
        Create: null,
        Update: null,
      };

      const data = (service as any).recordToData(record);

      expect(data.id).toBe('');
      expect(data.terminalId).toBe('');
      expect(data.title).toBe('');
      expect(data.expirationDate).toBe('');
      expect(data.create).toBe(0);
      expect(data.update).toBe(0);
    });
  });

  describe('Data transformation round-trip', () => {
    it('should maintain data integrity through data -> record -> data conversion', () => {
      const originalData: ExpirationData = {
        id: 'test-id-123',
        terminalId: 'terminal-456',
        title: 'Yogurt',
        expirationDate: '2024-10-22',
        memo: 'Keep refrigerated',
        create: 1697000000,
        update: 1697000100,
      };

      const record = (service as any).dataToRecord(originalData);
      const convertedData = (service as any).recordToData(record);

      expect(convertedData).toEqual(originalData);
    });

    it('should maintain data integrity without memo through round-trip conversion', () => {
      const originalData: ExpirationData = {
        id: 'test-id-456',
        terminalId: 'terminal-789',
        title: 'Cheese',
        expirationDate: '2024-10-23',
        create: 1697000000,
        update: 1697000100,
      };

      const record = (service as any).dataToRecord(originalData);
      const convertedData = (service as any).recordToData(record);

      expect(convertedData).toEqual(originalData);
    });
  });
});
