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

interface ExpirationSettingsProps {
  terminalId: string;
}

/**
 * Check if push notifications are supported in the current browser
 */
const isPushSupported = (): boolean => {
  return typeof window !== 'undefined' 
    && 'serviceWorker' in navigator 
    && 'PushManager' in window 
    && 'Notification' in window;
};

/**
 * Get current notification permission status
 */
const getNotificationPermission = (): NotificationPermission | null => {
  if (typeof window !== 'undefined' && 'Notification' in window) {
    return Notification.permission;
  }
  return null;
};

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
  const [pushEnabled, setPushEnabled] = useState(false);
  const [pushSupported, setPushSupported] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState<NotificationPermission | null>(null);
  const [pushLoading, setPushLoading] = useState(false);

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

  /**
   * Check if user has an existing push subscription for this terminalId
   */
  const checkExistingSubscription = useCallback(async () => {
    if (!terminalId) return;

    try {
      const response = await fetch(`/api/subscription?terminalId=${terminalId}`);
      if (response.ok) {
        setPushEnabled(true);
      } else if (response.status === 404) {
        setPushEnabled(false);
      }
    } catch {
      setPushEnabled(false);
    }
  }, [terminalId]);

  // Fetch settings and check push notification status on mount
  useEffect(() => {
    const initialize = async () => {
      if (!terminalId) return;

      try {
        setLoading(true);
        
        // Check push support
        const supported = isPushSupported();
        setPushSupported(supported);
        setPermissionStatus(getNotificationPermission());

        // Fetch settings and subscription status in parallel
        const [settingsData] = await Promise.all([
          ExpirationSettingsFetchService.fetchSettings(terminalId),
          checkExistingSubscription(),
        ]);
        
        setSettings(settingsData);
      } catch {
        setMessage('設定の取得に失敗しました');
      } finally {
        setLoading(false);
      }
    };

    initialize();
  }, [terminalId, checkExistingSubscription]);

  /**
   * Subscribe to push notifications
   */
  const subscribeToPush = async (): Promise<void> => {
    if (!pushSupported) {
      setMessage('このブラウザはプッシュ通知に対応していません');
      return;
    }

    setPushLoading(true);
    setMessage(null);

    try {
      // Request notification permission
      const permission = await Notification.requestPermission();
      setPermissionStatus(permission);

      if (permission !== 'granted') {
        setMessage('通知の許可が必要です。ブラウザの設定から通知を許可してください');
        return;
      }

      // Register service worker if not already registered
      const registration = await navigator.serviceWorker.ready;

      // Get VAPID public key from server
      const vapidResponse = await fetch('/api/notification');
      if (!vapidResponse.ok) {
        throw new Error('VAPID key fetch failed');
      }
      const { VAPID_PUBLIC_KEY } = await vapidResponse.json();

      // Convert VAPID key to Uint8Array
      const urlBase64ToUint8Array = (base64String: string): Uint8Array => {
        const padding = '='.repeat((4 - base64String.length % 4) % 4);
        const base64 = (base64String + padding)
          .replace(/-/g, '+')
          .replace(/_/g, '/');
        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);
        for (let i = 0; i < rawData.length; ++i) {
          outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
      };

      // Subscribe to push notifications
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
      });

      // Save subscription to server
      const subscriptionJson = subscription.toJSON();
      const saveResponse = await fetch('/api/subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          terminalId,
          subscription: {
            endpoint: subscriptionJson.endpoint,
            keys: subscriptionJson.keys,
          },
        }),
      });

      if (!saveResponse.ok) {
        throw new Error('Subscription save failed');
      }

      setPushEnabled(true);
      setMessage('プッシュ通知を有効にしました');
    } catch (error) {
      console.error('Push subscription error:', error);
      setMessage('プッシュ通知の設定に失敗しました');
    } finally {
      setPushLoading(false);
    }
  };

  /**
   * Unsubscribe from push notifications
   */
  const unsubscribeFromPush = async (): Promise<void> => {
    setPushLoading(true);
    setMessage(null);

    try {
      // Get existing subscription from server to get the ID
      const getResponse = await fetch(`/api/subscription?terminalId=${terminalId}`);
      
      if (getResponse.ok) {
        const existingSubscription = await getResponse.json();
        
        // Delete from server
        const deleteResponse = await fetch(`/api/subscription?id=${existingSubscription.id}`, {
          method: 'DELETE',
        });

        if (!deleteResponse.ok) {
          throw new Error('Subscription deletion failed');
        }
      }

      // Also unsubscribe from browser
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      if (subscription) {
        await subscription.unsubscribe();
      }

      setPushEnabled(false);
      setMessage('プッシュ通知を無効にしました');
    } catch (error) {
      console.error('Push unsubscription error:', error);
      setMessage('プッシュ通知の解除に失敗しました');
    } finally {
      setPushLoading(false);
    }
  };

  /**
   * Toggle push notification subscription
   */
  const handlePushToggle = async (): Promise<void> => {
    if (pushEnabled) {
      await unsubscribeFromPush();
    } else {
      await subscribeToPush();
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
      } catch {
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
              backgroundColor: message.includes('失敗') || message.includes('必要') ? '#fee' : '#efe',
              border: `1px solid ${message.includes('失敗') || message.includes('必要') ? '#fcc' : '#cfc'}`,
              borderRadius: '4px',
              fontSize: '14px'
            }}>
              {message}
            </div>
          )}

          {/* Push Notification Registration Section */}
          <div style={{ 
            marginBottom: '24px', 
            padding: '16px', 
            backgroundColor: '#f5f5f5', 
            borderRadius: '8px' 
          }}>
            <h3 style={{ marginTop: 0, marginBottom: '8px', fontSize: '16px' }}>
              プッシュ通知
            </h3>
            
            {!pushSupported ? (
              <p style={{ color: '#666', fontSize: '14px', margin: 0 }}>
                このブラウザはプッシュ通知に対応していません
              </p>
            ) : (
              <>
                <p style={{ fontSize: '12px', color: '#666', marginBottom: '12px' }}>
                  {permissionStatus === 'denied' 
                    ? 'ブラウザの設定で通知がブロックされています。ブラウザの設定から許可してください。'
                    : pushEnabled 
                      ? 'プッシュ通知は有効です。期限切れや期限間近の商品についてお知らせします。'
                      : 'プッシュ通知を有効にすると、設定した時間に通知を受け取れます。'}
                </p>
                
                <ContainedButton
                  label={
                    pushLoading 
                      ? '処理中...' 
                      : pushEnabled 
                        ? 'プッシュ通知を無効にする' 
                        : 'プッシュ通知を有効にする'
                  }
                  disabled={pushLoading || permissionStatus === 'denied'}
                  onClick={handlePushToggle}
                />

                {pushEnabled && (
                  <p style={{ fontSize: '12px', color: '#4caf50', marginTop: '8px', marginBottom: 0 }}>
                    ✓ プッシュ通知が有効です
                  </p>
                )}
              </>
            )}
          </div>

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
