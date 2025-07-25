'use client';

import React, { useEffect, useState } from 'react';

import CandleStick, { CandleStickData } from '@client-common/components/echarts/CandleStick';

type GraphProps = {
    exchange: string;
    ticker: string;
};

export default function Graph({ exchange, ticker }: GraphProps) {
    const [data, setData] = useState<CandleStickData[] | null>(null);

    useEffect(() => {
        (async () => {
            if (!exchange || !ticker) {
                setData(null);
                return;
            }

            const response = await fetch('/api/candle-stick', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ exchange, ticker }),
            });

            if (!response.ok) throw new Error('Network response was not ok');

            const json = await response.json();

            setData(json);
        })();
    }, [ticker]);

    if (!data) {
        return <div>Loading...</div>;
    }

    return <CandleStick data={data} />;
}
