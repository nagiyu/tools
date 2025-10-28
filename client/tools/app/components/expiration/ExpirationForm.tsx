'use client';

import React from 'react';

import BasicDatePicker from '@client-common/components/inputs/Dates/BasicDatePicker';
import BasicTextField from '@client-common/components/inputs/TextFields/BasicTextField';
import BasicStack from '@client-common/components/Layout/Stacks/BasicStack';

import { ExpirationData } from '@tools/types/ExpirationTypes';

interface ExpirationFormProps {
  item: ExpirationData;
  onItemChange: (updates: ExpirationData) => void;
}

export default function ExpirationForm({ 
  item, 
  onItemChange, 
}: ExpirationFormProps) {
  return (
    <BasicStack spacing={2}>
      <BasicTextField
        label="タイトル"
        value={item.title}
        onChange={(e) => onItemChange({ ...item, title: e.target.value })}
      />
      <BasicDatePicker
        label="賞味期限"
        value={item.expirationDate ? new Date(item.expirationDate + 'T00:00:00.000Z') : null}
        onChange={(date) => {
          if (date) {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            onItemChange({ ...item, expirationDate: `${year}-${month}-${day}` });
          }
        }}
      />
      <BasicTextField
        label="メモ"
        value={item.memo || ''}
        onChange={(e) => onItemChange({ ...item, memo: e.target.value })}
      />
    </BasicStack>
  );
}
