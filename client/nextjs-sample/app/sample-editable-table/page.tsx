'use client';

import React, { useState } from 'react';
import EditableTable, { EditableColumn, ActionButtonConfig } from '@client-common/components/data/table/EditableTable';

interface SampleData {
  id: string;
  name: string;
  age: number;
  email: string;
  department: string;
}

const initialData: SampleData[] = [
  {
    id: '1',
    name: 'John Doe',
    age: 30,
    email: 'john@example.com',
    department: 'Engineering',
  },
  {
    id: '2',
    name: 'Jane Smith',
    age: 28,
    email: 'jane@example.com',
    department: 'Marketing',
  },
  {
    id: '3',
    name: 'Bob Johnson',
    age: 35,
    email: 'bob@example.com',
    department: 'Sales',
  },
  {
    id: '4',
    name: 'Alice Williams',
    age: 32,
    email: 'alice@example.com',
    department: 'HR',
  },
  {
    id: '5',
    name: 'Charlie Brown',
    age: 29,
    email: 'charlie@example.com',
    department: 'Engineering',
  },
];

export default function SampleEditableTablePage() {
  const [data, setData] = useState<SampleData[]>(initialData);
  const [loading, setLoading] = useState(false);

  const columns: EditableColumn<SampleData>[] = [
    {
      id: 'name',
      label: 'Name',
      minWidth: 170,
      editable: true,
    },
    {
      id: 'age',
      label: 'Age',
      minWidth: 100,
      align: 'right',
      editable: true,
      editFormat: (value) => String(value),
      parseValue: (value) => parseInt(value) || 0,
    },
    {
      id: 'email',
      label: 'Email',
      minWidth: 200,
      editable: true,
    },
    {
      id: 'department',
      label: 'Department',
      minWidth: 150,
      editable: true,
    },
  ];

  const actionButtons: ActionButtonConfig = {
    showModify: true,
    showEdit: true,
    showDelete: true,
  };

  const handleModify = async (modifiedData: SampleData[]) => {
    console.log('Saving modified data:', modifiedData);
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setData(modifiedData);
    setLoading(false);
    alert('Data saved successfully!');
  };

  const handleEdit = (item: SampleData) => {
    console.log('Edit item:', item);
    alert(`Editing ${item.name}`);
  };

  const handleDelete = (item: SampleData) => {
    console.log('Delete item:', item);
    if (confirm(`Are you sure you want to delete ${item.name}?`)) {
      setData(prev => prev.filter(d => d.id !== item.id));
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>EditableTable Sample</h1>
      <p>このサンプルでは、編集可能なテーブルコンポーネントの機能を確認できます：</p>
      <ul>
        <li>セルをクリックして編集（Name, Age, Email, Department）</li>
        <li>Sortカラムで行の順序を変更</li>
        <li>Actionカラムで各行に対する操作（Edit/Delete）</li>
        <li>変更があった場合のみModifyボタンが有効化</li>
        <li>Cancelボタンで全ての変更を取り消し</li>
      </ul>
      
      <div style={{ marginTop: 20 }}>
        <EditableTable
          columns={columns}
          data={data}
          loading={loading}
          enableSorting={true}
          actionButtons={actionButtons}
          onModify={handleModify}
          onEdit={handleEdit}
          onDelete={handleDelete}
          pageSize={5}
        />
      </div>
    </div>
  );
}