import React from 'react';

import { Select, MenuItem, FormControl, InputLabel, SelectChangeEvent } from '@mui/material';

export interface Option {
    value: string;
    label: string;
}

interface BasicSelectProps {
    label?: string;
    options: Option[];
    value: string;
    defaultValue?: string;
    onChange: (value: string) => void;
}

export default function BasicSelect({
    label,
    options,
    value,
    defaultValue,
    onChange,
}: BasicSelectProps) {
    const labelId = label ? `${label.replace(/\s+/g, '-').toLowerCase()}-label` : undefined;

    const handleChange = (event: SelectChangeEvent) => {
        onChange(event.target.value as string);
    };

    return (
        <FormControl fullWidth>
            {label && <InputLabel id={labelId}>{label}</InputLabel>}
            <Select
                labelId={label ? labelId : undefined}
                value={value}
                defaultValue={defaultValue}
                label={label}
                onChange={handleChange}
            >
                {options.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                        {option.label}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
}
