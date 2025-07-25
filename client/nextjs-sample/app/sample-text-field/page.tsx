'use client';

import React, { useState } from 'react';
import BasicTextField from '@client-common/components/inputs/TextFields/BasicTextField';
import MultilineTextField from '@client-common/components/inputs/TextFields/MultilineTextField';

export default function SampleTextFieldPage() {
  const [basicValue, setBasicValue] = useState('');
  const [basicErrorValue, setBasicErrorValue] = useState('');
  const [multilineValue, setMultilineValue] = useState('');
  const [multilineErrorValue, setMultilineErrorValue] = useState('');

  return (
    <div style={{ padding: 20 }}>
      <h1>BasicTextField サンプル</h1>
      <BasicTextField
        label="Basic Text Field"
        value={basicValue}
        onChange={(e) => setBasicValue(e.target.value)}
      />
      <BasicTextField
        label="Basic Text Field with Placeholder"
        value={basicValue}
        onChange={(e) => setBasicValue(e.target.value)}
        placeholder="Enter text here..."
      />
      <BasicTextField
        label="Basic Text Field Readonly"
        value={basicValue}
        readonly
      />
      <BasicTextField
        label="Basic Text Field with Error"
        value={basicErrorValue}
        onChange={(e) => setBasicErrorValue(e.target.value)}
        error={basicErrorValue.length < 5}
        helperText={basicErrorValue.length < 5 ? 'Minimum 5 characters required' : ''}
      />

      <h1>MultilineTextField サンプル</h1>
      <MultilineTextField
        label="Multiline Text Field"
        value={multilineValue}
        onChange={(e) => setMultilineValue(e.target.value)}
        rows={4}
      />
      <MultilineTextField
        label="Multiline Text Field Readonly"
        value={multilineValue}
        readonly
        rows={4}
      />
      <MultilineTextField
        label="Multiline Text Field with Error"
        value={multilineErrorValue}
        onChange={(e) => setMultilineErrorValue(e.target.value)}
        error={multilineErrorValue.length < 10}
        helperText={multilineErrorValue.length < 10 ? 'Minimum 10 characters required' : ''}
        rows={4}
      />
    </div>
  );
}
