'use client';

import React, { useState } from 'react';

import AdminManagement from '@client-common/components/admin/AdminManagement';
import { Column } from '@client-common/components/data/table/BasicTable';
import IdentifierUtil from '@client-common/utils/IdentifierUtil.client';
import { SelectOptionType } from '@client-common/interfaces/SelectOptionType';

import { ToDoData } from '@tools/interfaces/ToDoData';
import { PRIORITY_LEVELS } from '@tools/consts/ToDoConsts';
import { PriorityType } from '@tools/types/ToDoTypes';
import ToDoFetchService from '@/services/ToDoFetchService.client';
import EditDialogContent from './EditDialogContent';

export default function ToDoTool() {
  const [terminalId, setTerminalId] = useState<string>('');

  // Initialize terminal ID on mount
  React.useEffect(() => {
    (async () => {
      const id = await IdentifierUtil.getTerminalId();
      setTerminalId(id);
    })();
  }, []);

  // Priority options for select field
  const priorityOptions: SelectOptionType[] = PRIORITY_LEVELS.map(priority => ({
    value: priority,
    label: priority === 'Must' ? 'Must（必須）' : 
           priority === 'Should' ? 'Should（推奨）' : 
           'Could（可能なら）'
  }));

  // Default ToDo item
  const defaultToDo: ToDoData = {
    id: '',
    terminalId: '',
    title: '',
    dueDate: new Date().toISOString().split('T')[0], // YYYY-MM-DD format
    priority: 'Must',
    create: 0,
    update: 0
  };

  // Column definitions for the table
  const columns: Column<ToDoData & { action: React.ReactNode }>[] = [
    {
      id: 'title',
      label: 'タイトル',
      minWidth: 300,
    },
    {
      id: 'dueDate',
      label: '期日',
      minWidth: 150,
      format: (value) => {
        if (!value) return '';
        // Format date as YYYY年MM月DD日
        const date = new Date(value + 'T00:00:00.000Z');
        return `${date.getUTCFullYear()}年${String(date.getUTCMonth() + 1).padStart(2, '0')}月${String(date.getUTCDate()).padStart(2, '0')}日`;
      },
    },
    {
      id: 'priority',
      label: '優先度',
      minWidth: 120,
      format: (value: PriorityType) => {
        const styles: Record<PriorityType, React.CSSProperties> = {
          Must: { 
            backgroundColor: '#d32f2f', 
            color: 'white',
            padding: '4px 12px',
            borderRadius: '16px',
            fontSize: '12px',
            fontWeight: 'bold',
            display: 'inline-block'
          },
          Should: { 
            backgroundColor: '#ed6c02', 
            color: 'white',
            padding: '4px 12px',
            borderRadius: '16px',
            fontSize: '12px',
            fontWeight: 'bold',
            display: 'inline-block'
          },
          Could: { 
            backgroundColor: '#0288d1', 
            color: 'white',
            padding: '4px 12px',
            borderRadius: '16px',
            fontSize: '12px',
            fontWeight: 'bold',
            display: 'inline-block'
          },
        };
        return <span style={styles[value]}>{value}</span>;
      },
    },
    {
      id: 'action',
      label: '操作',
      minWidth: 200,
      align: 'center',
    },
  ];

  // Fetch all ToDo items for this terminal
  const fetchData = async (): Promise<ToDoData[]> => {
    return await ToDoFetchService.fetchTodos(terminalId);
  };

  // Create a new ToDo item
  const onCreate = async (item: ToDoData): Promise<ToDoData> => {
    return await ToDoFetchService.createTodo(terminalId, item);
  };

  // Update an existing ToDo item
  const onUpdate = async (item: ToDoData): Promise<ToDoData> => {
    return await ToDoFetchService.updateTodo(terminalId, item);
  };

  // Delete a ToDo item
  const onDelete = async (id: string): Promise<void> => {
    await ToDoFetchService.deleteTodo(terminalId, id);
  };

  // Validate ToDo item before save
  const validateItem = (data: ToDoData): string | null => {
    if (!data.title || data.title.trim() === '') {
      return 'タイトルは必須です';
    }
    if (!data.dueDate) {
      return '期日は必須です';
    }
    if (!data.priority) {
      return '優先度は必須です';
    }
    return null;
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '16px' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '8px' }}>ToDo 管理</h1>
      
      <p style={{ textAlign: 'center', color: '#666', marginBottom: '24px' }}>
        タスクを管理して期日通りに完了させましょう
      </p>

      {terminalId ? (
        <AdminManagement
          columns={columns}
          fetchData={fetchData}
          itemName="ToDo"
          defaultItem={defaultToDo}
          validateItem={validateItem}
          onCreate={onCreate}
          onUpdate={onUpdate}
          onDelete={onDelete}
        >
          {(item, _state, onItemChange) => (
            <EditDialogContent
              item={item}
              onItemChange={onItemChange}
              priorityOptions={priorityOptions}
            />
          )}
        </AdminManagement>
      ) : (
        <p style={{ textAlign: 'center', color: '#666' }}>
          Loading...
        </p>
      )}
    </div>
  );
}
