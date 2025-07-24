'use client';

import { signIn } from 'next-auth/react';
import Button from '@mui/material/Button';

export default function SignInButton() {
    const handleSignIn = (): void => {
        signIn();
    };

    return (
        <Button color="inherit" onClick={handleSignIn}>
            Login
        </Button>
    );
}
