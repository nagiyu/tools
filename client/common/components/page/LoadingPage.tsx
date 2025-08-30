'use client';

import React, { useState } from 'react';

interface LoadingPageProps {
    children: (
        loading: boolean,
        runWithLoading: <T>(func: () => Promise<T>) => Promise<T>
    ) => React.ReactNode;
}

export default function LoadingPage({
    children
}: LoadingPageProps) {
    const [loading, setLoading] = useState(false);

    async function runWithLoading<T>(func: () => Promise<T>): Promise<T> {
        setLoading(true);
        const result = await func();
        setLoading(false);
        return result;
    }

    // return children(loading, runWithLoading);

    return (
        <>{children(loading, runWithLoading)}</>
    )
}
