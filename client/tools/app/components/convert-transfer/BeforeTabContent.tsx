'use client';

import React from 'react';

import BasicStack from '@client-common/components/Layout/Stacks/BasicStack';
import ContainedButton from '@client-common/components/inputs/Buttons/ContainedButton';
import DirectionStack from '@client-common/components/Layout/Stacks/DirectionStack';
import MultilineTextField from '@client-common/components/inputs/TextFields/MultilineTextField';

interface BeforeTabContentProps {
    value: string;
    setValue: (v: string) => void;
    onConvert: () => void;
    runWithLoading: <T>(func: () => Promise<T>) => Promise<T>;
};

export default function BeforeTabContent({
    value,
    setValue,
    onConvert,
    runWithLoading
}: BeforeTabContentProps) {
    const read = async () => {
        try {
            const text = await navigator.clipboard.readText();
            setValue(text);
        } catch {
            // エラー時は何もしない
        }
    };

    return (
        <BasicStack>
            <MultilineTextField value={value} onChange={e => setValue(e.target.value)} />
            <DirectionStack>
                <ContainedButton label='Read' onClick={() => runWithLoading(read)} />
                <ContainedButton label='Convert' onClick={onConvert} />
            </DirectionStack>
        </BasicStack>
    );
}
