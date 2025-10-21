'use client';

import React from 'react';

import BasicDatePicker from '@client-common/components/inputs/Dates/BasicDatePicker';
import BasicSelect from '@client-common/components/inputs/Selects/BasicSelect';
import BasicTextField from '@client-common/components/inputs/TextFields/BasicTextField';
import BasicStack from '@client-common/components/Layout/Stacks/BasicStack';
import { SelectOptionType } from '@client-common/interfaces/SelectOptionType';

import { ToDoData } from '@tools/interfaces/ToDoData';
import { PriorityType } from '@tools/types/ToDoTypes';

interface EditDialogContentProps {
  item: ToDoData;
  onItemChange: (updates: ToDoData) => void;
  priorityOptions: SelectOptionType[];
}

export default function EditDialogContent({ 
  item, 
  onItemChange, 
  priorityOptions 
}: EditDialogContentProps) {
  return (
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
  );
}
