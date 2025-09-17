'use client';

import React from 'react';

import BasicStack from '@client-common/components/Layout/Stacks/BasicStack';
import ContainedButton from '@client-common/components/inputs/Buttons/ContainedButton';
import DirectionStack from '@client-common/components/Layout/Stacks/DirectionStack';
import MultilineTextField from '@client-common/components/inputs/TextFields/MultilineTextField';
import BasicDatePicker from '@client-common/components/inputs/Dates/BasicDatePicker';
import ControlledCheckbox from '@client-common/components/inputs/checkbox/ControlledCheckbox';

interface AfterTabContentProps {
    value: string;
    selectedDate: Date | null;
    onDateChange: (date: Date | null) => void;
    includeDayOfWeek: boolean;
    onDayOfWeekToggle: (include: boolean) => void;
    runWithLoading: <T>(func: () => Promise<T>) => Promise<T>;
};

export default function AfterTabContent({
    value,
    selectedDate,
    onDateChange,
    includeDayOfWeek,
    onDayOfWeekToggle,
    runWithLoading
}: AfterTabContentProps) {
    const copy = async () => {
        try {
            await navigator.clipboard.writeText(value);
            alert('コピーに成功しました');
        } catch {
            // エラー時は何もしない
        }
    };

    return (
        <BasicStack>
            <BasicDatePicker 
                label="日付" 
                value={selectedDate} 
                onChange={onDateChange} 
            />
            <ControlledCheckbox
                label="曜日を含める"
                checked={includeDayOfWeek}
                disabled={!selectedDate}
                onChange={(e) => onDayOfWeekToggle(e.target.checked)}
            />
            <MultilineTextField value={value} readonly={true} />
            <DirectionStack>
                <ContainedButton label='Copy' onClick={() => runWithLoading(copy)} />
            </DirectionStack>
        </BasicStack>
    );
}
