import React from 'react';

import { Geist, Geist_Mono } from 'next/font/google';

import AccountContent from '@client-common/components/content/AccountContent';
import BasicAppBar from '@client-common/components/surfaces/AppBars/BasicAppBar';
import DirectionStack from '@client-common/components/Layout/Stacks/DirectionStack';
import LinkMenu, { MenuItemData } from '@client-common/components/navigations/Menus/LinkMenu';
import NotificationSettingButton from '@client-common/components/inputs/buttons/NotificationSettingButton';
import SignInButton from '@client-common/components/inputs/Buttons/SignInButton';
import SignoutButton from '@client-common/components/inputs/Buttons/SignOutButton';

interface CommonLayoutProps {
    title: string;
    menuItems?: MenuItemData[];

    // Authentication
    enableAuthentication?: boolean;
    isAuthenticated?: boolean;

    // Notification
    enableNotification?: boolean;

    children: React.ReactNode;
}

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export default function CommonLayout({
    title,
    menuItems = [],
    enableAuthentication = false,
    isAuthenticated = false,
    enableNotification = false,
    children
}: CommonLayoutProps) {
    const authenticatedContent = (): React.ReactNode => {
        if (!enableAuthentication) {
            return null;
        }

        if (!isAuthenticated) {
            return <SignInButton />;
        } else {
            return <SignoutButton />;
        }
    }

    const notificationContent = (): React.ReactNode => {
        if (!enableNotification) {
            return null;
        }

        return (
            <NotificationSettingButton />
        );
    }

    const menuContent = (): React.ReactNode => {
        if (menuItems.length === 0) {
            return null;
        }

        return <LinkMenu menuItems={menuItems} />;
    }

    return (
        <html lang='ja'>
            <head>
                <link rel='manifest' href='/manifest.webmanifest' />
            </head>
            <body className={`${geistSans.variable} ${geistMono.variable}`}>
                <BasicAppBar
                    left={
                        <DirectionStack>
                            <AccountContent
                                enableAuthentication={enableAuthentication}
                                isAuthenticated={isAuthenticated}
                            />
                        </DirectionStack>
                    }
                    center={
                        <div>{title}</div>
                    }
                    right={
                        <DirectionStack>
                            {authenticatedContent()}
                            {notificationContent()}
                            {menuContent()}
                        </DirectionStack>
                    }
                />
                {children}
            </body>
        </html>
    )
}
