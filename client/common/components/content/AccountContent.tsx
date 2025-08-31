'use client';

import React, { useEffect, useState } from 'react';

import AccountSettingDialog from '@client-common/components/feedback/dialog/AccountSettingDialog';
import AuthFetchService from '@client-common/services/auth/AuthFetchService.client';
import UserIconAvatar from '@client-common/components/data/avatar/UserIconAvatar';

interface AccountContentProps {
    enableAuthentication?: boolean;
    isAuthenticated?: boolean;
}

export default function AccountContent({
    enableAuthentication = false,
    isAuthenticated = false,
}: AccountContentProps) {
    const [accountSettingDialogOpen, setAccountSettingDialogOpen] = useState(false);

    const authFetchService = new AuthFetchService();

    useEffect(() => {
        (async () => {
            if (!enableAuthentication || !isAuthenticated) {
                return;
            }

            try {
                const user = await authFetchService.getUserByGoogle();

                if (!user) {
                    setAccountSettingDialogOpen(true);
                }
            } catch {
                setAccountSettingDialogOpen(true);
            }
        })();
    }, []);

    return (
        <>
            <UserIconAvatar onClick={() => setAccountSettingDialogOpen(true)} />
            <AccountSettingDialog
                open={accountSettingDialogOpen}
                onClose={() => setAccountSettingDialogOpen(false)}
            />
        </>
    )
}
