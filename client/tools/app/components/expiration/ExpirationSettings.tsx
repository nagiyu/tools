'use client';

import React, { useState, useEffect } from 'react';
import BasicSelect from '@client-common/components/inputs/Selects/BasicSelect';
import ContainedButton from '@client-common/components/inputs/Buttons/ContainedButton';
import LoadingContent from '@client-common/components/content/LoadingContent';
import LoadingPage from '@client-common/pages/LoadingPage';
import { SelectOptionType } from '@client-common/interfaces/SelectOptionType';
import ExpirationSettingsFetchService from '@/services/ExpirationSettingsFetchService.client';
import { ExpirationSettingsData } from '@tools/types/ExpirationTypes';
import { DEFAULT_NOTIFICATION_HOUR, DEFAULT_DAYS_BEFORE_NOTIFY } from '@tools/consts/ExpirationConsts';

interface ExpirationSettingsProps {
  terminalId: string;
}

export default function ExpirationSettings({ terminalId }: ExpirationSettingsProps) {
  const [settings, setSettings] = useState<ExpirationSettingsData>({
    id: '',
    terminalId: '',
    notificationHour: DEFAULT_NOTIFICATION_HOUR,
    daysBeforeNotify: DEFAULT_DAYS_BEFORE_NOTIFY,
    create: 0,
    update: 0,
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);

  // Hour options (0-23)
  const hourOptions: SelectOptionType[] = Array.from({ length: 24 }, (_, i) => ({
    value: i.toString(),
    label: `${i.toString().padStart(2, '0')}:00`,
  }));

  // Days before notify options (1-14 days)
  const daysOptions: SelectOptionType[] = Array.from({ length: 14 }, (_, i) => ({
    value: (i + 1).toString(),
    label: `${i + 1}日前`,
  }));

  // Fetch settings on mount
  useEffect(() => {
    const fetchSettings = async () => {
      if (!terminalId) return;

      try {
        setLoading(true);
        const data = await ExpirationSettingsFetchService.fetchSettings(terminalId);
        setSettings(data);
      } catch (error) {
        setMessage('設定の取得に失敗しました');
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, [terminalId]);

  const handleSave = async (runWithLoading: (fn: () => Promise<void>) => Promise<void>) => {
    await runWithLoading(async () => {
      try {
        setMessage(null);
        const updatedSettings = await ExpirationSettingsFetchService.updateSettings(terminalId, {
          notificationHour: settings.notificationHour,
          daysBeforeNotify: settings.daysBeforeNotify,
        });
        setSettings(updatedSettings);
        setMessage('設定を保存しました');
      } catch (error) {
        setMessage('設定の保存に失敗しました');
      }
    });
  };

  if (loading) {
    return <LoadingPage />;
  }

  return (
    <LoadingContent>
      {(saving, runWithLoading) => (
        <div style={{ 
          marginTop: '24px', 
          padding: '24px', 
          border: '1px solid #ddd',
          borderRadius: '8px',
          backgroundColor: '#fff'
        }}>
          <h2 style={{ marginTop: 0, marginBottom: '8px', fontSize: '20px' }}>
            通知設定
          </h2>
          
          <p style={{ color: '#666', marginBottom: '24px', fontSize: '14px' }}>
            賞味期限の通知を受け取る時間と、何日前から通知するかを設定できます
          </p>

          {message && (
            <div style={{
              padding: '12px 16px',
              marginBottom: '16px',
              backgroundColor: message.includes('失敗') ? '#fee' : '#efe',
              border: `1px solid ${message.includes('失敗') ? '#fcc' : '#cfc'}`,
              borderRadius: '4px',
              fontSize: '14px'
            }}>
              {message}
            </div>
          )}

          <div style={{ marginBottom: '24px', maxWidth: '300px' }}>
            <BasicSelect
              label="通知時間"
              value={settings.notificationHour.toString()}
              onChange={(value: string) => setSettings({ 
                ...settings, 
                notificationHour: parseInt(value, 10) 
              })}
              options={hourOptions}
            />
            <p style={{ fontSize: '12px', color: '#666', marginTop: '8px' }}>
              毎日この時間に期限切れや期限間近の商品を通知します
            </p>
          </div>

          <div style={{ marginBottom: '24px', maxWidth: '300px' }}>
            <BasicSelect
              label="事前通知日数"
              value={settings.daysBeforeNotify.toString()}
              onChange={(value: string) => setSettings({ 
                ...settings, 
                daysBeforeNotify: parseInt(value, 10) 
              })}
              options={daysOptions}
            />
            <p style={{ fontSize: '12px', color: '#666', marginTop: '8px' }}>
              賞味期限の何日前から「期限間近」として通知するか設定します
            </p>
          </div>

          <ContainedButton
            label={saving ? '保存中...' : '保存'}
            disabled={saving}
            onClick={() => handleSave(runWithLoading)}
          />
        </div>
      )}
    </LoadingContent>
  );
}
