import React, { SyntheticEvent } from 'react';
import Autocomplete, { AutocompleteChangeReason, AutocompleteChangeDetails } from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { SelectOptionType } from '@/common/interfaces/SelectOptionType'

export interface ComboBoxAutocompleteProps {
  options: SelectOptionType[];
  getOptionLabel: (option: string | SelectOptionType) => string;
  value: SelectOptionType | null;
  onChange: (event: SyntheticEvent<Element, Event>, value: string | SelectOptionType | null, reason: AutocompleteChangeReason, details?: AutocompleteChangeDetails<SelectOptionType> | undefined) => void;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  freeSolo?: boolean;
}

export default function ComboBoxAutocomplete(props: ComboBoxAutocompleteProps) {
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
