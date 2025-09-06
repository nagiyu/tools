# Freshness Notifier Business Logic

This directory contains the business logic for managing freshness notifications and related settings.

## Overview

The Freshness Notifier service provides CRUD operations for:
- **Freshness items**: Track expiration dates and notification preferences for various items
- **Settings**: Manage terminal-specific notification configurations

## Architecture

The implementation follows a clean separation of concerns with composition over inheritance and dedicated data access components:

### Data Types
- `FreshnessDataType`: Represents a freshness item with name, expiry date, and notification settings
- `SettingDataType`: Represents notification settings for a specific terminal

### Record Types (DynamoDB)
- `FreshnessRecordType`: DynamoDB record format for freshness items
- `SettingRecordType`: DynamoDB record format for settings
- `FreshnessNotifierRecordTypeBase`: Base interface for all record types

### Core Components
- `FreshnessDataService`: Handles Freshness CRUD operations, extends `CRUDServiceBase`
- `FreshnessDataAccessor`: Dedicated data accessor for Freshness operations
- `SettingDataService`: Handles Setting CRUD operations, extends `CRUDServiceBase`
- `SettingDataAccessor`: Dedicated data accessor for Setting operations
- `FreshnessNotifierService`: Orchestrates both DataServices using composition

### Architecture Benefits
- Each data type has its own dedicated DataAccessor extending `DataAccessorBase`
- Better separation of concerns between data access and business logic
- Improved maintainability with focused responsibilities
- Follows composition over inheritance principles

## Usage

```typescript
import FreshnessNotifierService from '@freshness-notifier/services/FreshnessNotifierService';

// Create service
const service = new FreshnessNotifierService();

// Create a freshness item
await service.createFreshness({
  id: 'unique-id',
  name: 'Milk',
  expiryDate: '2024-01-15',
  notificationEnabled: true,
  create: Date.now(),
  update: Date.now()
});

// Get all freshness items
const items = await service.getFreshness();

// Get freshness item by ID
const item = await service.getFreshnessById('unique-id');

// Create notification settings
await service.createSetting({
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
const setting = await service.getSettingByTerminalId('terminal-123');

// Get all settings
const settings = await service.getSettings();
```

## Database Tables

The services use environment-aware table naming:
- Development: `DevFreshnessNotifier`
- Production: `FreshnessNotifier`

Both data types are stored in the same table using different `DataType` values:
- Freshness items: `DataType = 'Freshness'`
- Settings: `DataType = 'Setting'`