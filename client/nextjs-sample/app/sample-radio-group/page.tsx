"use client";

import React, { useState } from 'react';
import SimpleRadioGroup, { SimpleRadioGroupOption } from '@client-common/components/Inputs/RadioGroups/SimpleRadioGroup';

const options1: SimpleRadioGroupOption[] = [
  { label: 'Option 1', value: '1' },
  { label: 'Option 2', value: '2' },
  { label: 'Option 3', value: '3' },
];

const options2: SimpleRadioGroupOption[] = [
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana' },
  { label: 'Cherry', value: 'cherry', disabled: true },
];

export default function SampleRadioGroupPage() {
  const [value1, setValue1] = useState('1');
  const [value2, setValue2] = useState('banana');

  return (
    <div style={{ padding: 20 }}>
      <h1>SimpleRadioGroup Sample</h1>

      <SimpleRadioGroup
        options={options1}
        value={value1}
        onChange={(e, val) => setValue1(val)}
        name="group1"
        label="Group 1"
      />

      <SimpleRadioGroup
        options={options2}
        value={value2}
        onChange={(e, val) => setValue2(val)}
        name="group2"
        label="Group 2"
        row
      />
    </div>
  );
}

  return (
    <div style={{ padding: 20 }}>
      <h1>SimpleRadioGroup Sample</h1>

      <section>
        <h2>Basic Usage</h2>
        <SimpleRadioGroup
          options={options1}
          value={value1}
          onChange={(e, val) => setValue1(val)}
          name="basic"
          label="Basic Radio Group"
        />
      </section>

      <section style={{ marginTop: 40 }}>
        <h2>With Disabled Option</h2>
        <SimpleRadioGroup
          options={options2}
          value={value2}
          onChange={(e, val) => setValue2(val)}
          name="disabled"
          label="Radio Group with Disabled Option"
        />
      </section>

      <section style={{ marginTop: 40 }}>
        <h2>Row Layout</h2>
        <SimpleRadioGroup
          options={options1}
          value={value1}
          onChange={(e, val) => setValue1(val)}
          name="row"
          label="Row Layout Radio Group"
          row
        />
      </section>
    </div>
  );
};

export default SampleRadioGroupPage;
