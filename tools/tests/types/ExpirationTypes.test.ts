import {
  ExpirationData,
  ExpirationRecord,
  ExpirationSettingsData,
  ExpirationSettingsRecord,
  DataTypeBase,
  RecordTypeBase,
} from '@tools/types/ExpirationTypes';
import {
  EXPIRATION_DATA_TYPE,
  EXPIRATION_SETTINGS_DATA_TYPE,
  DEFAULT_NOTIFICATION_HOUR,
  DEFAULT_DAYS_BEFORE_NOTIFY,
  MAX_TITLE_LENGTH,
  MAX_MEMO_LENGTH,
  MIN_NOTIFICATION_HOUR,
  MAX_NOTIFICATION_HOUR,
  MIN_DAYS_BEFORE_NOTIFY,
  MAX_DAYS_BEFORE_NOTIFY,
  DATE_FORMAT,
} from '@tools/consts/ExpirationConsts';

describe('ExpirationTypes', () => {
  describe('ExpirationData interface', () => {
    it('should create a valid ExpirationData object', () => {
      const data: ExpirationData = {
        id: 'test-id-123',
        terminalId: 'terminal-456',
        title: 'Milk',
        expirationDate: '2024-10-20',
        memo: 'Opened',
        create: 1697000000,
        update: 1697000000,
      };

      expect(data.id).toBe('test-id-123');
      expect(data.terminalId).toBe('terminal-456');
      expect(data.title).toBe('Milk');
      expect(data.expirationDate).toBe('2024-10-20');
      expect(data.memo).toBe('Opened');
      expect(data.create).toBe(1697000000);
      expect(data.update).toBe(1697000000);
    });

    it('should create ExpirationData without optional memo', () => {
      const data: ExpirationData = {
        id: 'test-id-123',
        terminalId: 'terminal-456',
        title: 'Bread',
        expirationDate: '2024-10-21',
        create: 1697000000,
        update: 1697000000,
      };

      expect(data.memo).toBeUndefined();
      expect(data.title).toBe('Bread');
    });

    it('should extend DataTypeBase interface', () => {
      const data: ExpirationData = {
        id: 'test-id',
        terminalId: 'terminal-id',
        title: 'Test',
        expirationDate: '2024-10-20',
        create: 1697000000,
        update: 1697000000,
      };

      const base: DataTypeBase = data;
      expect(base.id).toBe('test-id');
      expect(base.terminalId).toBe('terminal-id');
      expect(base.create).toBe(1697000000);
      expect(base.update).toBe(1697000000);
    });
  });

  describe('ExpirationRecord interface', () => {
    it('should create a valid ExpirationRecord object', () => {
      const record: ExpirationRecord = {
        ID: 'test-id-123',
        DataType: EXPIRATION_DATA_TYPE,
        TerminalID: 'terminal-456',
        Title: 'Milk',
        ExpirationDate: '2024-10-20',
        Memo: 'Opened',
        Create: 1697000000,
        Update: 1697000000,
      };

      expect(record.ID).toBe('test-id-123');
      expect(record.DataType).toBe('Expiration');
      expect(record.TerminalID).toBe('terminal-456');
      expect(record.Title).toBe('Milk');
      expect(record.ExpirationDate).toBe('2024-10-20');
      expect(record.Memo).toBe('Opened');
      expect(record.Create).toBe(1697000000);
      expect(record.Update).toBe(1697000000);
    });

    it('should create ExpirationRecord without optional Memo', () => {
      const record: ExpirationRecord = {
        ID: 'test-id-123',
        DataType: EXPIRATION_DATA_TYPE,
        TerminalID: 'terminal-456',
        Title: 'Bread',
        ExpirationDate: '2024-10-21',
        Create: 1697000000,
        Update: 1697000000,
      };

      expect(record.Memo).toBeUndefined();
      expect(record.Title).toBe('Bread');
    });

    it('should extend RecordTypeBase interface', () => {
      const record: ExpirationRecord = {
        ID: 'test-id',
        DataType: EXPIRATION_DATA_TYPE,
        TerminalID: 'terminal-id',
        Title: 'Test',
        ExpirationDate: '2024-10-20',
        Create: 1697000000,
        Update: 1697000000,
      };

      const base: RecordTypeBase = record;
      expect(base.ID).toBe('test-id');
      expect(base.DataType).toBe('Expiration');
      expect(base.TerminalID).toBe('terminal-id');
      expect(base.Create).toBe(1697000000);
      expect(base.Update).toBe(1697000000);
    });
  });

  describe('ExpirationSettingsData interface', () => {
    it('should create a valid ExpirationSettingsData object', () => {
      const data: ExpirationSettingsData = {
        id: 'settings-123',
        terminalId: 'terminal-456',
        notificationHour: 9,
        daysBeforeNotify: 3,
        create: 1697000000,
        update: 1697000000,
      };

      expect(data.id).toBe('settings-123');
      expect(data.terminalId).toBe('terminal-456');
      expect(data.notificationHour).toBe(9);
      expect(data.daysBeforeNotify).toBe(3);
      expect(data.create).toBe(1697000000);
      expect(data.update).toBe(1697000000);
    });

    it('should use default notification hour', () => {
      const data: ExpirationSettingsData = {
        id: 'settings-123',
        terminalId: 'terminal-456',
        notificationHour: DEFAULT_NOTIFICATION_HOUR,
        daysBeforeNotify: DEFAULT_DAYS_BEFORE_NOTIFY,
        create: 1697000000,
        update: 1697000000,
      };

      expect(data.notificationHour).toBe(9);
      expect(data.daysBeforeNotify).toBe(3);
    });

    it('should extend DataTypeBase interface', () => {
      const data: ExpirationSettingsData = {
        id: 'settings-id',
        terminalId: 'terminal-id',
        notificationHour: 12,
        daysBeforeNotify: 5,
        create: 1697000000,
        update: 1697000000,
      };

      const base: DataTypeBase = data;
      expect(base.id).toBe('settings-id');
      expect(base.terminalId).toBe('terminal-id');
      expect(base.create).toBe(1697000000);
      expect(base.update).toBe(1697000000);
    });
  });

  describe('ExpirationSettingsRecord interface', () => {
    it('should create a valid ExpirationSettingsRecord object', () => {
      const record: ExpirationSettingsRecord = {
        ID: 'settings-123',
        DataType: EXPIRATION_SETTINGS_DATA_TYPE,
        TerminalID: 'terminal-456',
        NotificationHour: 9,
        DaysBeforeNotify: 3,
        Create: 1697000000,
        Update: 1697000000,
      };

      expect(record.ID).toBe('settings-123');
      expect(record.DataType).toBe('ExpirationSettings');
      expect(record.TerminalID).toBe('terminal-456');
      expect(record.NotificationHour).toBe(9);
      expect(record.DaysBeforeNotify).toBe(3);
      expect(record.Create).toBe(1697000000);
      expect(record.Update).toBe(1697000000);
    });

    it('should extend RecordTypeBase interface', () => {
      const record: ExpirationSettingsRecord = {
        ID: 'settings-id',
        DataType: EXPIRATION_SETTINGS_DATA_TYPE,
        TerminalID: 'terminal-id',
        NotificationHour: 12,
        DaysBeforeNotify: 5,
        Create: 1697000000,
        Update: 1697000000,
      };

      const base: RecordTypeBase = record;
      expect(base.ID).toBe('settings-id');
      expect(base.DataType).toBe('ExpirationSettings');
      expect(base.TerminalID).toBe('terminal-id');
      expect(base.Create).toBe(1697000000);
      expect(base.Update).toBe(1697000000);
    });
  });
});

describe('ExpirationConsts', () => {
  describe('DataType constants', () => {
    it('should have correct DataType values', () => {
      expect(EXPIRATION_DATA_TYPE).toBe('Expiration');
      expect(EXPIRATION_SETTINGS_DATA_TYPE).toBe('ExpirationSettings');
    });
  });

  describe('Default settings constants', () => {
    it('should have correct default notification hour', () => {
      expect(DEFAULT_NOTIFICATION_HOUR).toBe(9);
    });

    it('should have correct default days before notify', () => {
      expect(DEFAULT_DAYS_BEFORE_NOTIFY).toBe(3);
    });
  });

  describe('Validation constraint constants', () => {
    it('should have correct max title length', () => {
      expect(MAX_TITLE_LENGTH).toBe(100);
    });

    it('should have correct max memo length', () => {
      expect(MAX_MEMO_LENGTH).toBe(500);
    });

    it('should have correct notification hour range', () => {
      expect(MIN_NOTIFICATION_HOUR).toBe(0);
      expect(MAX_NOTIFICATION_HOUR).toBe(23);
    });

    it('should have correct days before notify range', () => {
      expect(MIN_DAYS_BEFORE_NOTIFY).toBe(0);
      expect(MAX_DAYS_BEFORE_NOTIFY).toBe(365);
    });

    it('should have valid notification hour range', () => {
      expect(MAX_NOTIFICATION_HOUR - MIN_NOTIFICATION_HOUR).toBe(23);
      expect(MIN_NOTIFICATION_HOUR).toBeGreaterThanOrEqual(0);
      expect(MAX_NOTIFICATION_HOUR).toBeLessThan(24);
    });
  });

  describe('Date format constant', () => {
    it('should have correct date format', () => {
      expect(DATE_FORMAT).toBe('YYYY-MM-DD');
    });
  });
});
