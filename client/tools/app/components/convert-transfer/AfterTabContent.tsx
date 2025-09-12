'use client';

import React from 'react';

import BasicStack from '@client-common/components/Layout/Stacks/BasicStack';
import ContainedButton from '@client-common/components/inputs/Buttons/ContainedButton';
import DirectionStack from '@client-common/components/Layout/Stacks/DirectionStack';
import MultilineTextField from '@client-common/components/inputs/TextFields/MultilineTextField';
import BasicDatePicker from '@client-common/components/inputs/Dates/BasicDatePicker';

interface AfterTabContentProps {
    value: string;
    selectedDate: Date | null;
    onDateChange: (date: Date | null) => void;
    runWithLoading: <T>(func: () => Promise<T>) => Promise<T>;
};

export default function AfterTabContent({
    value,
    selectedDate,
    onDateChange,
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
            <MultilineTextField value={value} readonly={true} />
            <DirectionStack>
                <ContainedButton label='Copy' onClick={() => runWithLoading(copy)} />
            </DirectionStack>
        </BasicStack>
    );
}
