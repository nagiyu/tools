import React, { SyntheticEvent } from 'react';
import Autocomplete, { AutocompleteChangeReason, AutocompleteChangeDetails } from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { SelectOptionType } from '@client-common/interfaces/SelectOptionType';

export interface ComboBoxAutocompleteProps {
  options: SelectOptionType[];
  value: SelectOptionType | null;
  onChange: (event: SyntheticEvent<Element, Event>, value: SelectOptionType | null, reason: AutocompleteChangeReason, details?: AutocompleteChangeDetails<SelectOptionType> | undefined) => void;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  freeSolo?: boolean;
}

export default function ComboBoxAutocomplete(props: ComboBoxAutocompleteProps) {
  const {
    options,
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
      getOptionLabel={(option) => option.label}
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
