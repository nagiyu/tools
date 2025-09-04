import type { Metadata } from 'next';

import CommonLayout from '@client-common/components/layout/CommonLayout';

import "./globals.css";

export const metadata: Metadata = {
  title: 'Freshness Notifier',
  description: 'Freshness Notifier Application',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <CommonLayout
      title='Freshness Notifier'
      enableNotification={true}
    >
      {children}
    </CommonLayout>
  );
}
