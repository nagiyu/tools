'use client';

import React from 'react';

import Auth from '@/app/components/Auth';
import ExchangeTable from '@/app/components/exchange/ExchangeTable';

export default function ExchangesPage() {
    return (
        <Auth
            adminContent={<ExchangeTable />}
            userContent={
                <div>権限がありません。</div>
            }
        />
    );
}
