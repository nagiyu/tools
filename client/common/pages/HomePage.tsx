'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

import BasicStack from '@client-common/components/Layout/Stacks/BasicStack';
import DirectionStack from '@client-common/components/Layout/Stacks/DirectionStack';
import SquareButton from '@client-common/components/inputs/buttons/SquareButton';

export interface HomePageButton {
    label: string;
    icon: React.ReactElement;
    url: string;
}

interface HomePageProps {
    buttons: HomePageButton[];
}

export default function HomePage({
    buttons
}: HomePageProps) {
    const router = useRouter();

    // 4つずつグループ化
    const grouped: HomePageButton[][] = Array.from(
        { length: Math.ceil(buttons.length / 4) },
        (_, i) => buttons.slice(i * 4, i * 4 + 4)
    );

    return (
        <BasicStack>
            {grouped.map((group, idx) => (
                <DirectionStack key={idx}>
                    {group.map((btn, i) => (
                        <SquareButton
                            key={i}
                            label={btn.label}
                            icon={btn.icon}
                            onClick={() => { router.push(btn.url) }}
                        />
                    ))}
                </DirectionStack>
            ))}
        </BasicStack>
    );
}
