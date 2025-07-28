import React, { SyntheticEvent } from 'react';
import Autocomplete, { AutocompleteChangeReason, AutocompleteChangeDetails } from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

export interface ComboBoxAutocompleteProps<T> {
  options: T[];
  getOptionLabel: (option: string | T) => string;
  value: T | null;
  onChange: (event: SyntheticEvent<Element, Event>, value: string | T | null, reason: AutocompleteChangeReason, details?: AutocompleteChangeDetails<T> | undefined) => void;
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
