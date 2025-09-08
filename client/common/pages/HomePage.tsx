'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useMediaQuery, useTheme } from '@mui/material';

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
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    // モバイルなら3つずつ、PCなら4つずつグループ化
    const groupSize = isMobile ? 3 : 4;
    const buttonSize = isMobile ? '30vw' : '20vw';
    
    const grouped: HomePageButton[][] = Array.from(
        { length: Math.ceil(buttons.length / groupSize) },
        (_, i) => buttons.slice(i * groupSize, i * groupSize + groupSize)
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
                            size={buttonSize}
                            onClick={() => { router.push(btn.url) }}
                        />
                    ))}
                </DirectionStack>
            ))}
        </BasicStack>
    );
}
