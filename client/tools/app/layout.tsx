import type { Metadata } from 'next';

import CommonLayout from '@client-common/components/layout/CommonLayout';
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
    title: 'AI Chat',
    url: '/ai-chat'
  },
  {
    title: 'ToDo',
    url: '/todo'
  },
  {
    title: 'Convert Transfer',
    url: '/convert-transfer'
  },
  {
    title: 'Splatoon3 Gear',
    url: '/splatoon-gear'
  }
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <CommonLayout
      title='Tools'
      menuItems={menuItems}
      enableAuthentication={false}
      enableNotification={true}
      enableAdSense={false}
    >
      {children}
    </CommonLayout>
  );
}
