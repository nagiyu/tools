'use client';

import React from 'react';

import BasicStack from '@client-common/components/Layout/Stacks/BasicStack';
import ContainedButton from '@client-common/components/inputs/Buttons/ContainedButton';
import DirectionStack from '@client-common/components/Layout/Stacks/DirectionStack';
import MultilineTextField from '@client-common/components/inputs/TextFields/MultilineTextField';

interface AfterTabContentProps {
    value: string;
    runWithLoading: <T>(func: () => Promise<T>) => Promise<T>;
};

export default function AfterTabContent({
    value,
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
            <MultilineTextField value={value} readonly={true} />
            <DirectionStack>
                <ContainedButton label='Copy' onClick={() => runWithLoading(copy)} />
            </DirectionStack>
        </BasicStack>
    );
}
