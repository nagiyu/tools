'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

import ConvertTransferService from '@tools/services/ConvertTransferService';

import LoadingContent from '@client-common/components/content/LoadingContent';
import SimpleTab from '@client-common/components/navigations/Tabs/SimpleTab';

import AfterTabContent from '@/app/components/convert-transfer/AfterTabContent';
import BeforeTabContent from '@/app/components/convert-transfer/BeforeTabContent';

export default function ConvertTransferPage() {
    const searchParams = useSearchParams();
    const [tabIndex, setTabIndex] = useState(0);
    const [before, setBefore] = useState('');
    const [after, setAfter] = useState('');

    useEffect(() => {
        // Handle shared data from share sheet
        const sharedUrl = searchParams.get('url');
        const sharedText = searchParams.get('text');
        
        if (sharedUrl) {
            setBefore(sharedUrl);
        } else if (sharedText) {
            setBefore(sharedText);
        }
    }, [searchParams]);

    const service = new ConvertTransferService();

    const handleConvert = () => {
        const result = service.convert(before);
        setAfter(result);
        setTabIndex(1);
    };

    const tabs = (runWithLoading: <T>(func: () => Promise<T>) => Promise<T>) => [
        {
            label: '変換前',
            content: (
                <BeforeTabContent
                    value={before}
                    setValue={setBefore}
                    onConvert={handleConvert}
                    runWithLoading={runWithLoading}
                />
            )
        },
        {
            label: '変換後',
            content: (
                <AfterTabContent
                    value={after}
                    runWithLoading={runWithLoading}
                />
            )
        }
    ];

    return (
        <LoadingContent>
            {(_, runWithLoading) => (
                <SimpleTab
                    tabs={tabs(runWithLoading)}
                    tabIndex={tabIndex}
                    onChange={setTabIndex}
                />
            )}
        </LoadingContent>
    );
}
