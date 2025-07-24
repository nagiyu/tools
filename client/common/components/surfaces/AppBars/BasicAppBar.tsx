import React from 'react';
import { AppBar, Toolbar } from '@mui/material';

type BasicAppBarProps = {
    left?: React.ReactNode;
    center?: React.ReactNode;
    right?: React.ReactNode;
};

export default function BasicAppBar(props: BasicAppBarProps) {
    const { left, center, right } = props;

    return (
        <AppBar position="static">
            <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 0 }}>
                <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-start' }}>{left}</div>
                <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>{center}</div>
                <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>{right}</div>
            </Toolbar>
        </AppBar>
    );
}
