'use client';

import React, { useEffect, useState } from 'react';
import CandleStick, { CandleStickData } from '@client-common/components/echarts/CandleStick';

export default function Home() {
  const [data, setData] = useState<CandleStickData[] | null>(null);

  useEffect(() => {
    (async () => {
      const response = await fetch('/api/finance');

      if (!response.ok) throw new Error('Network response was not ok');

      const json = await response.json();

      setData(json);
    })();
  }, []);

  if (!data) {
    return <div>Loading...</div>;
  }

  return <CandleStick data={data} />;
}
