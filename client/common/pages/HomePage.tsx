'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

import BasicStack from '@client-common/components/Layout/Stacks/BasicStack';
import DirectionStack from '@client-common/components/Layout/Stacks/DirectionStack';
import SquareButton from '@client-common/components/inputs/buttons/SquareButton';
import ResponsiveUtil, { useResponsiveLayout } from '@client-common/utils/ResponsiveUtil';

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
    const { groupSize, buttonSize } = useResponsiveLayout();
    
    const grouped: HomePageButton[][] = ResponsiveUtil.groupArray(buttons, groupSize);

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
