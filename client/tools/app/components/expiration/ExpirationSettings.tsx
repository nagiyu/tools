'use client';

import React, { useState, useEffect } from 'react';

import BasicSelect from '@client-common/components/inputs/Selects/BasicSelect';
import BasicNumberField from '@client-common/components/inputs/TextFields/BasicNumberField';
import BasicStack from '@client-common/components/Layout/Stacks/BasicStack';
import ContainedButton from '@client-common/components/inputs/Buttons/ContainedButton';
import { SelectOptionType } from '@client-common/interfaces/SelectOptionType';

import { ExpirationSettingsData } from '@tools/types/ExpirationTypes';
import { DEFAULT_NOTIFICATION_HOUR, DEFAULT_DAYS_BEFORE_NOTIFY } from '@tools/consts/ExpirationConsts';

interface ExpirationSettingsProps {
  terminalId: string;
  onSettingsChange?: (settings: ExpirationSettingsData) => void;
  onClose?: () => void;
}

export default function ExpirationSettings({ 
  terminalId,
  onSettingsChange,
  onClose
}: ExpirationSettingsProps) {
  const [settings, setSettings] = useState<ExpirationSettingsData>({
    id: '',
    terminalId,
    notificationHour: DEFAULT_NOTIFICATION_HOUR,
    daysBeforeNotify: DEFAULT_DAYS_BEFORE_NOTIFY,
    create: 0,
    update: 0,
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Generate hour options (0-23)
  const hourOptions: SelectOptionType[] = Array.from({ length: 24 }, (_, i) => ({
    value: i.toString(),
    label: `${i}時`,
  }));

  // Fetch settings on mount
  useEffect(() => {
    const fetchSettings = async () => {
      if (!terminalId) return;

      setLoading(true);
      try {
        const response = await fetch(`/api/expiration/settings?terminalId=${terminalId}`);
        if (response.ok) {
          const { settings: fetchedSettings } = await response.json();
          setSettings(fetchedSettings);
        }
      } catch (error) {
        console.error('Failed to fetch settings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, [terminalId]);

  // Handle save
  const handleSave = async () => {
    setSaving(true);
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

      if (response.ok) {
        const { settings: updatedSettings } = await response.json();
        setSettings(updatedSettings);
        if (onSettingsChange) {
          onSettingsChange(updatedSettings);
        }
        if (onClose) {
          onClose();
        }
      }
    } catch (error) {
      console.error('Failed to save settings:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '16px', textAlign: 'center' }}>
        読み込み中...
      </div>
    );
  }

  return (
    <div style={{ padding: '16px', minWidth: '400px' }}>
      <BasicStack spacing={3}>
        <div>
          <BasicSelect
            label="通知時間"
            options={hourOptions}
            value={settings.notificationHour.toString()}
            onChange={(value) => {
              setSettings({ ...settings, notificationHour: parseInt(value, 10) });
            }}
          />
          <p style={{ fontSize: '12px', color: '#666', marginTop: '8px' }}>
            毎日この時間に通知を受け取ります
          </p>
        </div>

        <div>
          <BasicNumberField
            label="事前通知日数"
            value={settings.daysBeforeNotify}
            onChange={(e) => {
              const value = parseInt(e.target.value, 10);
              if (!isNaN(value) && value >= 0) {
                setSettings({ ...settings, daysBeforeNotify: value });
              }
            }}
          />
          <p style={{ fontSize: '12px', color: '#666', marginTop: '8px' }}>
            賞味期限の何日前から通知するか設定します
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '16px' }}>
          {onClose && (
            <ContainedButton
              label="キャンセル"
              onClick={onClose}
              disabled={saving}
            />
          )}
          <ContainedButton
            label={saving ? '保存中...' : '保存'}
            onClick={handleSave}
            disabled={saving}
          />
        </div>
      </BasicStack>
    </div>
  );
}
