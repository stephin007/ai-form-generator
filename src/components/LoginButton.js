import React from 'react';
import { Button } from '@mui/material';
import { signInWithGoogle } from '../../firebaseConfig';

const LoginButton = () => {
    return (
        <Button color="inherit" onClick={signInWithGoogle}>Login with Google</Button>
    );
};

export default LoginButton;
