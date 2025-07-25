import * as React from 'react';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import TextField from '@mui/material/TextField';

interface BasicDatePickerProps {
  value: Date | null;
  onChange: (date: Date | null) => void;
  minDate?: Date;
  maxDate?: Date;
}

export const BasicDatePicker: React.FC<BasicDatePickerProps> = ({ value, onChange, minDate, maxDate }) => {
  return (
    <DatePicker
      label="日付を選択"
      value={value}
      onChange={onChange}
      minDate={minDate}
      maxDate={maxDate}
      renderInput={(params) => <TextField {...params} />}
    />
  );
};
