# EditableTable Component

`EditableTable` is an advanced table component based on `BasicTable` that provides cell-level editing, row reordering, and configurable action buttons.

## Features

### 1. Cell-Level Editing
- Click on any editable cell to start editing
- Supports custom edit formatting and value parsing
- Save changes with Enter key or Save button
- Cancel changes with Escape key or Cancel button
- Visual feedback with inline editing controls

### 2. Row Reordering (Sort Column)
- Up/Down arrow buttons in the Sort column (second from right)
- Moves rows up or down in the table
- Tracks changes in row order
- Buttons are disabled at boundaries (first/last row)

### 3. Action Column
- Configurable buttons on the far right column
- Available actions:
  - **Edit**: Opens item for editing (configurable via props)
  - **Delete**: Deletes the item (configurable via props)
- Each button can be enabled/disabled via `actionButtons` prop

### 4. Change Tracking
- **Modify Button**: Only enabled when changes are detected
- **Cancel Button**: Reverts all changes to original state
- **Visual Indicators**: Changed rows highlighted with yellow background and left border
- Tracks both cell edits and row reordering

### 5. State Management
- Clear separation of original data and current edits
- Comprehensive change tracking
- Maintainable code structure

## Props

```typescript
interface EditableTableProps<T extends { id: string }> {
  columns: EditableColumn<T>[];
  data: T[];
  loading?: boolean;
  pageSize?: number;
  pageIndex?: number;
  pageSizeOptions?: number[];
  onPageChange?: (pageIndex: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  totalCount?: number;
  enableSorting?: boolean;
  actionButtons?: ActionButtonConfig;
  onModify?: (modifiedData: T[]) => Promise<void>;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
}
```

### Column Configuration

```typescript
interface EditableColumn<T> {
  id: keyof T;
  label: string;
  minWidth?: number;
  align?: 'right' | 'left' | 'center';
  editable?: boolean;  // Makes column editable
  format?: (value: any) => React.ReactNode;  // Display formatting
  editFormat?: (value: any) => string;  // Edit formatting
  parseValue?: (value: string) => any;  // Parse edited value
}
```

### Action Button Configuration

```typescript
interface ActionButtonConfig {
  showModify?: boolean;  // Show Modify button (default: true)
  showEdit?: boolean;    // Show Edit button (default: true)
  showDelete?: boolean;  // Show Delete button (default: true)
}
```

## Usage Example

```typescript
const columns: EditableColumn<SampleData>[] = [
  {
    id: 'name',
    label: 'Name',
    editable: true,
  },
  {
    id: 'age',
    label: 'Age',
    editable: true,
    editFormat: (value) => String(value),
    parseValue: (value) => parseInt(value) || 0,
  },
];

const actionButtons = {
  showModify: true,
  showEdit: true,
  showDelete: true,
};

<EditableTable
  columns={columns}
  data={data}
  enableSorting={true}
  actionButtons={actionButtons}
  onModify={handleModify}
  onEdit={handleEdit}
  onDelete={handleDelete}
/>
```

## Implementation Details

### State Structure
- `rowStates`: Array of row state objects containing data, indices, and change flags
- `editingCell`: Current cell being edited
- `hasAnyChanges`: Global flag for any changes

### Change Detection
- Cell edits: Compares current data with original data
- Row reordering: Compares current index with original index
- Visual feedback: Yellow highlighting for changed rows

### Data Flow
1. Initialize with original data
2. Track edits in separate state
3. On Modify: Pass modified data to parent component
4. On Cancel: Reset to original state

This implementation prioritizes clarity and maintainability over brevity, making it easy to understand and extend.