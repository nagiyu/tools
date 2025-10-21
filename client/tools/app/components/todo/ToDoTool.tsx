'use client';

import React, { useState } from 'react';
import { Box, Chip, Typography } from '@mui/material';

import AdminManagement from '@client-common/components/admin/AdminManagement';
import { Column } from '@client-common/components/data/table/BasicTable';
import IdentifierUtil from '@client-common/utils/IdentifierUtil.client';
import BasicDatePicker from '@client-common/components/inputs/Dates/BasicDatePicker';
import BasicSelect from '@client-common/components/inputs/Selects/BasicSelect';
import BasicTextField from '@client-common/components/inputs/TextFields/BasicTextField';
import BasicStack from '@client-common/components/Layout/Stacks/BasicStack';
import { SelectOptionType } from '@client-common/interfaces/SelectOptionType';

import { ToDoData } from '@tools/interfaces/ToDoData';
import { PRIORITY_LEVELS } from '@tools/consts/ToDoConsts';
import { PriorityType } from '@tools/types/ToDoTypes';

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
        const colors = {
          Must: 'error',
          Should: 'warning',
          Could: 'info',
        } as const;
        return <Chip label={value} color={colors[value]} size="small" />;
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
    if (!terminalId) {
      return [];
    }

    const response = await fetch(`/api/todo?terminalId=${terminalId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch ToDo items');
    }
    
    const { todos } = await response.json();
    return todos;
  };

  // Create a new ToDo item
  const onCreate = async (item: ToDoData): Promise<ToDoData> => {
    const response = await fetch('/api/todo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        terminalId,
        title: item.title,
        dueDate: item.dueDate,
        priority: item.priority,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to create ToDo item');
    }

    const { todo } = await response.json();
    return todo;
  };

  // Update an existing ToDo item
  const onUpdate = async (item: ToDoData): Promise<ToDoData> => {
    const response = await fetch('/api/todo', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: item.id,
        terminalId,
        title: item.title,
        dueDate: item.dueDate,
        priority: item.priority,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to update ToDo item');
    }

    const { todo } = await response.json();
    return todo;
  };

  // Delete a ToDo item
  const onDelete = async (id: string): Promise<void> => {
    const response = await fetch('/api/todo', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id,
        terminalId,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to delete ToDo item');
    }
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
    <Box sx={{ maxWidth: 1200, margin: '0 auto', padding: 2 }}>
      <Typography variant="h4" gutterBottom align="center">
        ToDo 管理
      </Typography>
      
      <Typography variant="body1" gutterBottom align="center" color="text.secondary" sx={{ mb: 3 }}>
        タスクを管理して期日通りに完了させましょう
      </Typography>

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
            <BasicStack spacing={2}>
              <BasicTextField
                label="タイトル"
                value={item.title}
                onChange={(e) => onItemChange({ ...item, title: e.target.value })}
              />
              <BasicDatePicker
                label="期日"
                value={item.dueDate ? new Date(item.dueDate + 'T00:00:00.000Z') : null}
                onChange={(date) => {
                  if (date) {
                    const year = date.getFullYear();
                    const month = String(date.getMonth() + 1).padStart(2, '0');
                    const day = String(date.getDate()).padStart(2, '0');
                    onItemChange({ ...item, dueDate: `${year}-${month}-${day}` });
                  }
                }}
              />
              <BasicSelect
                label="優先度"
                value={item.priority}
                onChange={(value) => onItemChange({ ...item, priority: value as PriorityType })}
                options={priorityOptions}
              />
            </BasicStack>
          )}
        </AdminManagement>
      ) : (
        <Typography align="center" color="text.secondary">
          Loading...
        </Typography>
      )}
    </Box>
  );
}
