'use client';

import React from 'react';
import { useNotificationManager } from '@client-common/hooks/notification-manager';
import ContainedButton from '@client-common/components/inputs/Buttons/ContainedButton';
import LoadingContent from '@client-common/components/content/LoadingContent';

export default function PushNotificationManager() {
  const {
    isSupported,
    subscription,
    error,
    subscribeToPush,
    unsubscribeFromPush,
  } = useNotificationManager();

  if (!isSupported) {
    return (
      <div style={{
        marginTop: '24px',
        padding: '24px',
        border: '1px solid #ddd',
        borderRadius: '8px',
        backgroundColor: '#fff3cd',
      }}>
        <h2 style={{ marginTop: 0, marginBottom: '8px', fontSize: '20px' }}>
          プッシュ通知
        </h2>
        <p style={{ color: '#856404', marginBottom: 0, fontSize: '14px' }}>
          お使いのブラウザはプッシュ通知をサポートしていません
        </p>
      </div>
    );
  }

  return (
    <LoadingContent>
      {(loading, runWithLoading) => (
        <div style={{
          marginTop: '24px',
          padding: '24px',
          border: '1px solid #ddd',
          borderRadius: '8px',
          backgroundColor: '#fff',
        }}>
          <h2 style={{ marginTop: 0, marginBottom: '8px', fontSize: '20px' }}>
            プッシュ通知
          </h2>

          <p style={{ color: '#666', marginBottom: '16px', fontSize: '14px' }}>
            ブラウザのプッシュ通知を有効にして、期日のToDoを確実に把握できます
          </p>

          {error && (
            <div style={{
              padding: '12px 16px',
              marginBottom: '16px',
              backgroundColor: '#fee',
              border: '1px solid #fcc',
              borderRadius: '4px',
              fontSize: '14px',
              color: '#c33',
            }}>
              エラー: {error}
            </div>
          )}

          <div style={{ marginBottom: '16px' }}>
            <p style={{ margin: '0 0 8px 0', fontSize: '14px' }}>
              <strong>状態:</strong>{' '}
              {subscription ? (
                <span style={{ color: '#28a745' }}>✓ 購読中</span>
              ) : (
                <span style={{ color: '#666' }}>未購読</span>
              )}
            </p>
          </div>

          {subscription ? (
            <ContainedButton
              label={loading ? '解除中...' : '通知を解除'}
              disabled={loading}
              onClick={() => runWithLoading(async () => {
                await unsubscribeFromPush();
              })}
            />
          ) : (
            <ContainedButton
              label={loading ? '購読中...' : '通知を有効化'}
              disabled={loading}
              onClick={() => runWithLoading(async () => {
                await subscribeToPush();
              })}
            />
          )}

          <p style={{ marginTop: '16px', fontSize: '12px', color: '#999' }}>
            ※ 通知を有効化すると、ブラウザから通知の許可を求められます
          </p>
        </div>
      )}
    </LoadingContent>
  );
}
