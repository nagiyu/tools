'use client';

import React, { useState } from 'react';

import AdminManagement from '@client-common/components/admin/AdminManagement';
import { Column } from '@client-common/components/data/table/BasicTable';
import IdentifierUtil from '@client-common/utils/IdentifierUtil.client';
import BasicDialog from '@client-common/components/feedback/dialog/BasicDialog';
import ContainedButton from '@client-common/components/inputs/Buttons/ContainedButton';

import { ExpirationData } from '@tools/types/ExpirationTypes';
import { DEFAULT_DAYS_BEFORE_NOTIFY } from '@tools/consts/ExpirationConsts';
import ExpirationFetchService from '@/services/ExpirationFetchService.client';
import ExpirationForm from './ExpirationForm';
import ExpirationSettings from './ExpirationSettings';

/**
 * Get the status of an expiration item based on the expiration date
 * @param expirationDate - The expiration date in YYYY-MM-DD format
 * @param daysBeforeNotify - Number of days before expiration to show warning
 * @returns 'expired' | 'soon' | 'normal'
 */
function getExpirationStatus(expirationDate: string, daysBeforeNotify: number = DEFAULT_DAYS_BEFORE_NOTIFY): 'expired' | 'soon' | 'normal' {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const expDate = new Date(expirationDate + 'T00:00:00.000Z');
  const diffTime = expDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays < 0) {
    return 'expired';
  } else if (diffDays <= daysBeforeNotify) {
    return 'soon';
  } else {
    return 'normal';
  }
}

/**
 * Get the background color based on expiration status
 * @param status - The expiration status
 * @returns CSS color string
 */
function getStatusColor(status: 'expired' | 'soon' | 'normal'): string {
  switch (status) {
    case 'expired':
      return '#ffebee'; // Light red
    case 'soon':
      return '#fff9c4'; // Light yellow
    default:
      return '#ffffff'; // White
  }
}

export default function ExpirationManagementContainer() {
  const [terminalId, setTerminalId] = useState<string>('');
  const [settingsDialogOpen, setSettingsDialogOpen] = useState(false);

  // Initialize terminal ID on mount
  React.useEffect(() => {
    (async () => {
      const id = await IdentifierUtil.getTerminalId();
      setTerminalId(id);
    })();
  }, []);

  // Default expiration item
  const defaultExpiration: ExpirationData = {
    id: '',
    terminalId: '',
    title: '',
    expirationDate: new Date().toISOString().split('T')[0], // YYYY-MM-DD format
    memo: '',
    create: 0,
    update: 0
  };

  // Create status badge
  const createStatusBadge = (expirationDate: string): React.ReactNode => {
    const status = getExpirationStatus(expirationDate);
    const color = getStatusColor(status);
    const label = status === 'expired' ? '期限切れ' : status === 'soon' ? '期限間近' : '通常';
    return (
      <div style={{
        backgroundColor: color,
        padding: '4px 8px',
        borderRadius: '4px',
        fontSize: '12px',
        fontWeight: 'bold',
        display: 'inline-block',
        border: '1px solid #ccc'
      }}>
        {label}
      </div>
    );
  };

  // Column definitions for the table
  const columns: Column<ExpirationData & { action: React.ReactNode; statusBadge?: React.ReactNode }>[] = [
    {
      id: 'statusBadge',
      label: '状態',
      minWidth: 100,
      align: 'center',
    },
    {
      id: 'title',
      label: 'タイトル',
      minWidth: 200,
    },
    {
      id: 'expirationDate',
      label: '賞味期限',
      minWidth: 150,
      format: (value) => {
        if (!value) return '';
        // Format date as YYYY年MM月DD日
        const date = new Date(value + 'T00:00:00.000Z');
        return `${date.getUTCFullYear()}年${String(date.getUTCMonth() + 1).padStart(2, '0')}月${String(date.getUTCDate()).padStart(2, '0')}日`;
      },
    },
    {
      id: 'memo',
      label: 'メモ',
      minWidth: 200,
    },
    {
      id: 'action',
      label: '操作',
      minWidth: 200,
      align: 'center',
    },
  ];

  // Fetch all expiration items for this terminal
  const fetchData = async (): Promise<ExpirationData[]> => {
    const data = await ExpirationFetchService.fetchExpirations(terminalId);
    // Add status badge to each item
    return data.map(item => ({
      ...item,
      statusBadge: createStatusBadge(item.expirationDate)
    })) as ExpirationData[];
  };

  // Create a new expiration item
  const onCreate = async (item: ExpirationData): Promise<ExpirationData> => {
    const created = await ExpirationFetchService.createExpiration(terminalId, item);
    return {
      ...created,
      statusBadge: createStatusBadge(created.expirationDate)
    } as ExpirationData;
  };

  // Update an existing expiration item
  const onUpdate = async (item: ExpirationData): Promise<ExpirationData> => {
    const updated = await ExpirationFetchService.updateExpiration(terminalId, item);
    return {
      ...updated,
      statusBadge: createStatusBadge(updated.expirationDate)
    } as ExpirationData;
  };

  // Delete an expiration item
  const onDelete = async (id: string): Promise<void> => {
    await ExpirationFetchService.deleteExpiration(terminalId, id);
  };

  // Validate expiration item before save
  const validateItem = (data: ExpirationData): string | null => {
    if (!data.title || data.title.trim() === '') {
      return 'タイトルは必須です';
    }
    if (!data.expirationDate) {
      return '賞味期限は必須です';
    }
    return null;
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '16px' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '8px' }}>賞味期限管理</h1>
      
      <p style={{ textAlign: 'center', color: '#666', marginBottom: '24px' }}>
        食品や商品の賞味期限を管理して、期限切れを防ぎましょう
      </p>

      {terminalId ? (
        <>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
            <ContainedButton
              label="通知設定"
              onClick={() => setSettingsDialogOpen(true)}
            />
          </div>

          <AdminManagement
            columns={columns}
            fetchData={fetchData}
            itemName="Expiration"
            defaultItem={defaultExpiration}
            validateItem={validateItem}
            onCreate={onCreate}
            onUpdate={onUpdate}
            onDelete={onDelete}
          >
            {(item, _state, onItemChange) => (
              <ExpirationForm
                item={item}
                onItemChange={onItemChange}
              />
            )}
          </AdminManagement>

          <BasicDialog
            open={settingsDialogOpen}
            title="通知設定"
            onClose={() => setSettingsDialogOpen(false)}
          >
            {() => (
              <ExpirationSettings
                terminalId={terminalId}
                onClose={() => setSettingsDialogOpen(false)}
              />
            )}
          </BasicDialog>
        </>
      ) : (
        <p style={{ textAlign: 'center', color: '#666' }}>
          Loading...
        </p>
      )}
    </div>
  );
}
