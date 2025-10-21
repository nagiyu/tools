'use client';

import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  Switch, 
  FormControlLabel,
  Button,
  Alert,
  CircularProgress,
} from '@mui/material';
import BasicSelect from '@client-common/components/inputs/Selects/BasicSelect';
import { SelectOptionType } from '@client-common/interfaces/SelectOptionType';

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
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

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
        const response = await fetch(`/api/todo/notification?terminalId=${terminalId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch notification settings');
        }
        const data = await response.json();
        setSettings({
          enabled: data.enabled,
          notificationHour: data.notificationHour,
          timezone: data.timezone,
        });
      } catch (error) {
        console.error('Error fetching notification settings:', error);
        setMessage({ type: 'error', text: '通知設定の取得に失敗しました' });
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, [terminalId]);

  // Save notification settings
  const handleSave = async () => {
    if (!terminalId) return;

    try {
      setSaving(true);
      setMessage(null);

      const response = await fetch('/api/todo/notification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          terminalId,
          enabled: settings.enabled,
          notificationHour: settings.notificationHour,
          timezone: settings.timezone,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save notification settings');
      }

      setMessage({ type: 'success', text: '通知設定を保存しました' });
    } catch (error) {
      console.error('Error saving notification settings:', error);
      setMessage({ type: 'error', text: '通知設定の保存に失敗しました' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" p={3}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Card sx={{ mt: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          通知設定
        </Typography>
        
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          期日が今日のToDoについて、指定した時間に通知を受け取ることができます
        </Typography>

        {message && (
          <Alert severity={message.type} sx={{ mb: 2 }} onClose={() => setMessage(null)}>
            {message.text}
          </Alert>
        )}

        <Box sx={{ mb: 2 }}>
          <FormControlLabel
            control={
              <Switch
                checked={settings.enabled}
                onChange={(e) => setSettings({ ...settings, enabled: e.target.checked })}
                color="primary"
              />
            }
            label="通知を有効にする"
          />
        </Box>

        <Box sx={{ mb: 3, maxWidth: 300 }}>
          <BasicSelect
            label="通知時間"
            value={settings.notificationHour.toString()}
            onChange={(value: string) => setSettings({ ...settings, notificationHour: parseInt(value, 10) })}
            options={hourOptions}
            disabled={!settings.enabled}
          />
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography variant="caption" color="text.secondary">
            タイムゾーン: {settings.timezone}
          </Typography>
        </Box>

        <Button
          variant="contained"
          color="primary"
          onClick={handleSave}
          disabled={saving}
          sx={{ mt: 1 }}
        >
          {saving ? '保存中...' : '保存'}
        </Button>
      </CardContent>
    </Card>
  );
}
