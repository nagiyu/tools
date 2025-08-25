import React from 'react';

import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';

interface ControlledCheckboxProps {
    label?: string;
    checked: boolean;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function ControlledCheckbox({
    label,
    checked,
    onChange
}: ControlledCheckboxProps) {
    if (label) {
        return (
            <FormControlLabel
                control={
                    <Checkbox
                        checked={checked}
                        onChange={onChange}
                    />
                }
                label={label}
            />
        );
    }

    return (
        <Checkbox
            checked={checked}
            onChange={onChange}
        />
    );
};
