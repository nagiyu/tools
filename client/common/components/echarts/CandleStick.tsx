import React from 'react';

import ReactECharts from 'echarts-for-react';

export interface CandleStickData {
    date: string;
    data: [number, number, number, number];
}

type CandleStickProps = {
    data: CandleStickData[];
}

function getOption(data: CandleStickData[]) {
    return {
        xAxis: {
            data: data.map(item => item.date)
        },
        yAxis: {
            scale: true
        },
        series: [
            {
                type: 'candlestick',
                data: data.map(item => item.data)
            }
        ]
    }
}

export default function CandleStick({ data }: CandleStickProps) {
    return (
        <ReactECharts option={getOption(data)} />
    );
}
