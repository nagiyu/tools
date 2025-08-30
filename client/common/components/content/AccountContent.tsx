'use client';

import React, { useState } from 'react';

import AccountSettingDialog from '@client-common/components/feedback/dialog/AccountSettingDialog';
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
