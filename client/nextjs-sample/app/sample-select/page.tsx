'use client';

import React, { useState } from 'react';
import BasicSelect from '@client-common/components/inputs/Selects/BasicSelect'
import { SelectOptionType } from '@client-common/interfaces/SelectOptionType'
import ComboBoxAutocomplete from '@client-common/components/inputs/autocomplete/ComboBoxAutocomplete';

export default function SampleSelectPage() {
  const [selectedValue, setSelectedValue] = useState('');
  const [selectedOption, setSelectedOption] = useState<SelectOptionType | null>(null);

  const options: SelectOptionType[] = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' },
  ];

  const handleSelectChange = (value: string) => {
    setSelectedValue(value);
  };

  const handleAutocompleteChange = (event: React.SyntheticEvent, value: SelectOptionType | null) => {
    setSelectedOption(value);
  };

  return (
    <div>
      <h1>BasicSelect Sample</h1>
      <BasicSelect
        label="Select an option"
        options={options}
        value={selectedValue}
        onChange={handleSelectChange}
      />
      <p>Selected Value: {selectedValue}</p>

      <h1>ComboBoxAutocomplete Sample</h1>
      <ComboBoxAutocomplete
        options={options}
        value={selectedOption}
        onChange={handleAutocompleteChange}
        label="Autocomplete"
        placeholder="Select or type an option"
      />
      <p>Selected Option: {selectedOption ? selectedOption.label : 'None'}</p>
    </div>
  );
}
