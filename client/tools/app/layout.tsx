import type { Metadata } from 'next';

import CommonLayout, { AdsenseConfig } from '@client-common/components/layout/CommonLayout';
import { MenuItemData } from '@client-common/components/navigations/Menus/LinkMenu';

import "./globals.css";

export const metadata: Metadata = {
  title: 'Tools',
  description: 'A collection of useful tools.',
};

const menuItems: MenuItemData[] = [
  {
    title: 'Home',
    url: '/',
  },
  {
    title: 'Convert Transfer',
    url: '/convert-transfer'
  }
];

// Google Adsense configuration example (uncomment and configure to enable)
// const adsenseConfig: AdsenseConfig = {
//   publisherId: 'ca-pub-xxxxxxxxxx',
//   enableAutoAds: true,
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <CommonLayout
      title='Tools'
      menuItems={menuItems}
      enableAdSense={true}
      enableAutoAds={true}
      // adsenseConfig={adsenseConfig} // Use this to override the dynamic config if needed
    >
      {children}
    </CommonLayout>
  );
}
