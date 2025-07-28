'use client';

import React, { useState } from 'react';
import BasicSelect from '@client-common/components/inputs/Selects/BasicSelect'
import { SelectOptionType } from '@client-common/interfaces/SelectOptionType'
import ComboBoxAutocomplete from '@client-common/components/inputs/autocomplete/ComboBoxAutocomplete';

export default function SampleSelectPage() {
  const [selectedValue, setSelectedValue] = useState('');
  const [selectedOption, setSelectedOption] = useState<SelectOptionType | null>(null);
  const [freeSoloValue, setFreeSoloValue] = useState<string>('');

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

  const handleFreeSoloChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFreeSoloValue(event.target.value);
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

      <h1>ComboBoxAutocomplete Free Solo Sample</h1>
      <ComboBoxAutocomplete
        options={options}
        value={freeSoloValue ? { value: freeSoloValue, label: freeSoloValue } : null}
        onChange={(event, value) => {
          if (value) {
            setFreeSoloValue(value.label);
          } else {
            setFreeSoloValue('');
          }
        }}
        label="Free Solo Autocomplete"
        placeholder="Type any value"
        freeSolo
      />
      <p>Free Solo Value: {freeSoloValue}</p>
    </div>
  );
}

