'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

import ConvertTransferService from '@tools/services/ConvertTransferService';

import LoadingContent from '@client-common/components/content/LoadingContent';
import LoadingPage from '@client-common/pages/LoadingPage';
import SimpleTab from '@client-common/components/navigations/Tabs/SimpleTab';

import AfterTabContent from '@/app/components/convert-transfer/AfterTabContent';
import BeforeTabContent from '@/app/components/convert-transfer/BeforeTabContent';

function ConvertTransferContent() {
    const searchParams = useSearchParams();
    const [tabIndex, setTabIndex] = useState(0);
    const [before, setBefore] = useState('');
    const [after, setAfter] = useState('');
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);

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
        const result = service.convert(before, selectedDate || undefined);
        setAfter(result);
        setTabIndex(1);
    };

    const handleDateChange = (date: Date | null) => {
        setSelectedDate(date);
        // Re-convert if we already have converted text
        if (after) {
            const result = service.convert(before, date || undefined);
            setAfter(result);
        }
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
                    selectedDate={selectedDate}
                    onDateChange={handleDateChange}
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

export default function ConvertTransferPage() {
    return (
        <Suspense fallback={<LoadingPage />}>
            <ConvertTransferContent />
        </Suspense>
    );
}
