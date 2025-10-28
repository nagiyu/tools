'use client';

import React, { useState, useEffect } from 'react';
import BasicSelect from '@client-common/components/inputs/Selects/BasicSelect';
import ContainedButton from '@client-common/components/inputs/Buttons/ContainedButton';
import LoadingContent from '@client-common/components/content/LoadingContent';
import LoadingPage from '@client-common/pages/LoadingPage';
import { SelectOptionType } from '@client-common/interfaces/SelectOptionType';
import ToDoNotificationFetchService from '@/services/ToDoNotificationFetchService.client';

interface NotificationSettingsProps {
  terminalId: string;
}

interface NotificationSetting {
  enabled: boolean;
  notificationHour: number;
  timezone: string;
}

export default function NotificationSettings({ terminalId }: NotificationSettingsProps) {
  const [settings, setSettings] = useState<NotificationSetting>({
    enabled: false,
    notificationHour: 9,
    timezone: 'Asia/Tokyo',
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);

  // Hour options (0-23)
  const hourOptions: SelectOptionType[] = Array.from({ length: 24 }, (_, i) => ({
    value: i.toString(),
    label: `${i.toString().padStart(2, '0')}:00`,
  }));

  // Fetch notification settings on mount
  useEffect(() => {
    const fetchSettings = async () => {
      if (!terminalId) return;

      try {
        setLoading(true);
        const data = await ToDoNotificationFetchService.fetchNotificationSettings(terminalId);
        setSettings(data);
      } catch (error) {
        setMessage('通知設定の取得に失敗しました');
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, [terminalId]);

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
            期日が今日のToDoについて、指定した時間に通知を受け取ることができます
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

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={settings.enabled}
                onChange={(e) => setSettings({ ...settings, enabled: e.target.checked })}
                style={{ marginRight: '8px', width: '16px', height: '16px' }}
              />
              <span>通知を有効にする</span>
            </label>
          </div>

          <div style={{ marginBottom: '24px', maxWidth: '300px' }}>
            <BasicSelect
              label="通知時間"
              value={settings.notificationHour.toString()}
              onChange={(value: string) => setSettings({ ...settings, notificationHour: parseInt(value, 10) })}
              options={hourOptions}
              disabled={!settings.enabled}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <p style={{ fontSize: '12px', color: '#666', margin: 0 }}>
              タイムゾーン: {settings.timezone}
            </p>
          </div>

          <ContainedButton
            label={saving ? '保存中...' : '保存'}
            disabled={saving}
            onClick={() => runWithLoading(async () => {
              try {
                setMessage(null);
                await ToDoNotificationFetchService.saveNotificationSettings(terminalId, settings);
                setMessage('通知設定を保存しました');
              } catch (error) {
                setMessage('通知設定の保存に失敗しました');
              }
            })}
          />
        </div>
      )}
    </LoadingContent>
  );
}
