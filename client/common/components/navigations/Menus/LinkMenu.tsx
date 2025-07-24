'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { IconButton, Menu, MenuItem } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

export type MenuItemData = {
    title: string;
    url: string;
};

type LinkMenuProps = {
    menuItems: MenuItemData[];
};

export default function LinkMenu({ menuItems }: LinkMenuProps) {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <>
            <IconButton
                edge="start"
                color="inherit"
                aria-label="menu"
                onClick={handleClick}
                sx={{ mr: 2 }}
            >
                <MenuIcon />
            </IconButton>
            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
            >
                {menuItems.map((item) => (
                    <MenuItem onClick={handleClose} key={item.url}>
                        <Link href={item.url} style={{ textDecoration: 'none', color: 'inherit', width: '100%' }}>
                            {item.title}
                        </Link>
                    </MenuItem>
                ))}
            </Menu>
        </>
    );
}
