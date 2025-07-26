import React from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

export interface ComboBoxAutocompleteProps<T> {
  options: T[];
  getOptionLabel: (option: T) => string;
  value: T | null;
  onChange: (event: React.SyntheticEvent, value: T | null) => void;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  freeSolo?: boolean;
}

export default function ComboBoxAutocomplete<T>(props: ComboBoxAutocompleteProps<T>) {
  const {
    options,
    getOptionLabel,
    value,
    onChange,
    label,
    placeholder,
    disabled,
    freeSolo = false,
  } = props;

  return (
    <Autocomplete
      options={options}
      getOptionLabel={getOptionLabel}
      value={value}
      onChange={onChange}
      disabled={disabled}
      freeSolo={freeSolo}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          placeholder={placeholder}
          variant="outlined"
          fullWidth
        />
      )}
    />
  );
}
