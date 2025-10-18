import { DataTypeBase } from '@common/interfaces/data/DataTypeBase';
import { PriorityType } from '@tools/types/ToDoTypes';

/**
 * ToDo Data interface for application layer
 * Extends DataTypeBase for standard application fields
 */
export interface ToDoData extends DataTypeBase {
  terminalId: string;            // TerminalID（フロントエンドで必要）
  title: string;
  dueDate: string;               // YYYY-MM-DD形式
  priority: PriorityType;        // 'Must' | 'Should' | 'Could'
  createdAt: string;             // ISO 8601形式
  updatedAt: string;             // ISO 8601形式
}
