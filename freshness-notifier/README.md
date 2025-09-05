# Freshness Notifier Business Logic

This directory contains the business logic for managing freshness notifications and related settings.

## Overview

The Freshness Notifier service provides CRUD operations for:
- **Freshness items**: Track expiration dates and notification preferences for various items
- **Settings**: Manage terminal-specific notification configurations

## Architecture

### Data Types
- `FreshnessDataType`: Represents a freshness item with name, expiry date, and notification settings
- `SettingDataType`: Represents notification settings for a specific terminal

### Record Types (DynamoDB)
- `FreshnessRecordType`: DynamoDB record format for freshness items
- `SettingRecordType`: DynamoDB record format for settings
- `FreshnessNotifierRecordTypeBase`: Base interface for all record types

### Services
- `FreshnessNotifierService`: Base service with generic CRUD operations and data conversion utilities
- `FreshnessService`: Concrete service for managing freshness items
- `SettingService`: Concrete service for managing settings with additional terminal-specific methods
- `FreshnessNotifierDataAccessor`: Data access layer handling DynamoDB operations

## Usage

```typescript
import FreshnessService from './services/FreshnessService';
import SettingService from './services/SettingService';

// Create services
const freshnessService = new FreshnessService();
const settingService = new SettingService();

// Create a freshness item
await freshnessService.create({
  id: 'unique-id',
  name: 'Milk',
  expiryDate: '2024-01-15',
  notificationEnabled: true,
  create: Date.now(),
  update: Date.now()
});

// Get all freshness items
const items = await freshnessService.get();

// Create notification settings
await settingService.create({
  id: 'setting-id',
  terminalId: 'terminal-123',
  subscriptionEndpoint: 'https://...',
  subscriptionKeysP256dh: 'key...',
  subscriptionKeysAuth: 'auth...',
  notificationEnabled: true,
  notificationTime: 9, // 9 AM
  create: Date.now(),
  update: Date.now()
});

// Get settings by terminal ID
const setting = await settingService.getByTerminalId('terminal-123');
```

## Database Tables

The services use environment-aware table naming:
- Development: `DevFreshnessNotifier`
- Production: `FreshnessNotifier`

Both data types are stored in the same table using different `DataType` values:
- Freshness items: `DataType = 'Freshness'`
- Settings: `DataType = 'Setting'`