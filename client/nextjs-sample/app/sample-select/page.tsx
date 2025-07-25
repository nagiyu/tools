import React, { useState } from 'react';
import BasicSelect, { Option } from '@client-common/components/inputs/Selects/BasicSelect';

export default function SampleSelectPage() {
  const [selectedValue, setSelectedValue] = useState('');

  const options: Option[] = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' },
  ];

  const handleChange = (value: string) => {
    setSelectedValue(value);
  };

  return (
    <div>
      <h1>BasicSelect Sample</h1>
      <BasicSelect
        label="Select an option"
        options={options}
        value={selectedValue}
        onChange={handleChange}
      />
      <p>Selected Value: {selectedValue}</p>
    </div>
  );
}
