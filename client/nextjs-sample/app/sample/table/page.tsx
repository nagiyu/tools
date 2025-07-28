import React from 'react';
import BasicTable, { Column } from '@client-common/components/data/table/BasicTable';

interface Data {
  id: number;
  name: string;
  age: number;
  email: string;
}

const columns: Column<Data>[] = [
  { id: 'id', label: 'ID', minWidth: 50 },
  { id: 'name', label: 'Name', minWidth: 100 },
  { id: 'age', label: 'Age', minWidth: 50, align: 'right' },
  { id: 'email', label: 'Email', minWidth: 150 },
];

const data: Data[] = [
  { id: 1, name: 'Alice', age: 25, email: 'alice@example.com' },
  { id: 2, name: 'Bob', age: 30, email: 'bob@example.com' },
  { id: 3, name: 'Charlie', age: 35, email: 'charlie@example.com' },
];

export default function TableSamplePage() {
  return (
    <div>
      <h1>BasicTable Sample with Pagination</h1>
      <BasicTable columns={columns} data={data} />
    </div>
  );
}
