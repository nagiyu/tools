'use client';

import React, { useState } from 'react';
import BasicTextField from '@client-common/components/inputs/TextFields/BasicTextField';
import MultilineTextField from '@client-common/components/inputs/TextFields/MultilineTextField';

export default function SampleTextFieldPage() {
  const [basicValue, setBasicValue] = useState('');
  const [multilineValue, setMultilineValue] = useState('');

  return (
    <div style={{ padding: 20 }}>
      <h1>BasicTextField サンプル</h1>
      <BasicTextField
        label="Basic Text Field"
        value={basicValue}
        onChange={(e) => setBasicValue(e.target.value)}
      />
      <BasicTextField
        label="Basic Text Field Readonly"
        value={basicValue}
        readonly
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
    </div>
  );
}
