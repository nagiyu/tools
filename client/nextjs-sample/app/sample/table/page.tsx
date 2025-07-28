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
  { id: 4, name: 'David', age: 28, email: 'david@example.com' },
  { id: 5, name: 'Eva', age: 22, email: 'eva@example.com' },
  { id: 6, name: 'Frank', age: 40, email: 'frank@example.com' },
  { id: 7, name: 'Grace', age: 33, email: 'grace@example.com' },
  { id: 8, name: 'Hannah', age: 27, email: 'hannah@example.com' },
  { id: 9, name: 'Ian', age: 31, email: 'ian@example.com' },
  { id: 10, name: 'Jane', age: 29, email: 'jane@example.com' },
];

export default function TableSamplePage() {
  return (
    <div>
      <h1>BasicTable Sample with Pagination</h1>
      <BasicTable
        columns={columns}
        data={data}
        pageSize={10}
        pageIndex={0}
        pageSizeOptions={[5, 10, 20, 50]}
        onPageChange={(page) => console.log('Page changed:', page)}
        onPageSizeChange={(size) => console.log('Page size changed:', size)}
        totalCount={data.length}
      />
    </div>
  );
}
