'use client';

import React, { useState, useEffect, useCallback } from 'react';
import BasicSelect from '@client-common/components/inputs/Selects/BasicSelect';
import ContainedButton from '@client-common/components/inputs/Buttons/ContainedButton';
import LoadingContent from '@client-common/components/content/LoadingContent';
import LoadingPage from '@client-common/pages/LoadingPage';
import { SelectOptionType } from '@client-common/interfaces/SelectOptionType';
import ExpirationSettingsFetchService from '@/services/ExpirationSettingsFetchService.client';
import { ExpirationSettingsData } from '@tools/types/ExpirationTypes';
import { DEFAULT_NOTIFICATION_HOUR, DEFAULT_DAYS_BEFORE_NOTIFY } from '@tools/consts/ExpirationConsts';

/**
 * Push notification permission status
 */
type NotificationPermissionStatus = 'default' | 'granted' | 'denied' | 'unsupported';

interface ExpirationSettingsProps {
  terminalId: string;
}

/**
 * Register service worker for push notifications
 * @returns ServiceWorkerRegistration or null if not supported
 */
async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (!('serviceWorker' in navigator)) {
    return null;
  }
  
  try {
    const registration = await navigator.serviceWorker.register('/sw.js');
    return registration;
  } catch {
    return null;
  }
}

/**
 * Check current notification permission status
 * @returns Current permission status
 */
function getNotificationPermissionStatus(): NotificationPermissionStatus {
  if (!('Notification' in window)) {
    return 'unsupported';
  }
  return Notification.permission as NotificationPermissionStatus;
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
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermissionStatus>('default');
  const [isSubscribing, setIsSubscribing] = useState(false);

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

  // Check notification permission on mount
  useEffect(() => {
    setNotificationPermission(getNotificationPermissionStatus());
  }, []);

  /**
   * Request push notification permission and register subscription
   */
  const handleRequestNotificationPermission = useCallback(async () => {
    // Check if notifications are supported
    if (!('Notification' in window)) {
      setMessage('このブラウザはプッシュ通知に対応していません');
      return;
    }

    // Check if service worker is supported
    if (!('serviceWorker' in navigator)) {
      setMessage('このブラウザはサービスワーカーに対応していません');
      return;
    }

    setIsSubscribing(true);
    setMessage(null);

    try {
      // Request notification permission
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission as NotificationPermissionStatus);

      if (permission !== 'granted') {
        setMessage('通知の許可が得られませんでした');
        return;
      }

      // Register service worker
      const registration = await registerServiceWorker();
      if (!registration) {
        setMessage('サービスワーカーの登録に失敗しました');
        return;
      }

      setMessage('プッシュ通知の登録が完了しました');
    } catch {
      setMessage('プッシュ通知の登録に失敗しました');
    } finally {
      setIsSubscribing(false);
    }
  }, []);

  /**
   * Get status text for notification permission
   */
  const getNotificationStatusText = (): string => {
    switch (notificationPermission) {
      case 'granted':
        return '✓ 通知が許可されています';
      case 'denied':
        return '✗ 通知がブロックされています（ブラウザ設定で許可してください）';
      case 'unsupported':
        return '✗ このブラウザはプッシュ通知に対応していません';
      default:
        return '通知の許可が必要です';
    }
  };

  /**
   * Get status color for notification permission
   */
  const getNotificationStatusColor = (): string => {
    switch (notificationPermission) {
      case 'granted':
        return '#4caf50';
      case 'denied':
      case 'unsupported':
        return '#f44336';
      default:
        return '#ff9800';
    }
  };

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

          {/* Push notification registration section */}
          <div style={{
            marginBottom: '24px',
            padding: '16px',
            backgroundColor: '#f5f5f5',
            borderRadius: '8px',
            border: '1px solid #e0e0e0'
          }}>
            <h3 style={{ marginTop: 0, marginBottom: '8px', fontSize: '16px' }}>
              プッシュ通知登録
            </h3>
            <p style={{ 
              fontSize: '14px', 
              color: getNotificationStatusColor(),
              marginBottom: '12px'
            }}>
              {getNotificationStatusText()}
            </p>
            {notificationPermission === 'default' && (
              <ContainedButton
                label={isSubscribing ? '登録中...' : '通知を許可する'}
                disabled={isSubscribing}
                onClick={handleRequestNotificationPermission}
              />
            )}
            {notificationPermission === 'denied' && (
              <p style={{ fontSize: '12px', color: '#666', marginTop: '8px' }}>
                ブラウザの設定から通知を許可してください。
                設定後、ページを再読み込みしてください。
              </p>
            )}
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
