import { RecordTypeBase } from '@common/interfaces/record/RecordTypeBase';
import { PriorityType } from '@tools/types/ToDoTypes';

/**
 * ToDo Record interface for DynamoDB
 * Extends RecordTypeBase for standard DynamoDB fields
 */
export interface ToDoRecord extends RecordTypeBase {
  TerminalID: string;            // TerminalID（デバイス識別子）
  Title: string;                 // ToDoタイトル
  DueDate: string;               // 期日 (YYYY-MM-DD形式)
  Priority: PriorityType;        // 優先度
}
