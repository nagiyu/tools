'use client';

import CandleStick from '@client-common/components/echarts/CandleStick';

export default function Home() {
  return (
    <CandleStick data={[
      { date: '2017-10-24', data: [20, 34, 10, 38] },
      { date: '2017-10-25', data: [40, 35, 30, 50] },
      { date: '2017-10-26', data: [31, 38, 33, 44] },
      { date: '2017-10-27', data: [38, 15, 5, 42] }
    ]} />
  );
}
