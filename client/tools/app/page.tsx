'use client';

import React from 'react';

import HomePage, { HomePageButton } from '@client-common/pages/HomePage';
import Train from '@client-common/components/data/icon/Train';

export default function Home() {
  const buttons: HomePageButton[] = [
    {
      label: 'Convert Transfer',
      icon: <Train />,
      url: '/convert-transfer',
    },
  ];

  return (
    <HomePage buttons={buttons} />
  );
}
