import React from 'react';
import { AppBar, Toolbar, Typography } from '@mui/material';

const Header = () => (
    <AppBar position="fixed">
        <Toolbar>
            <img src="https://firebasestorage.googleapis.com/v0/b/cristomathewmemorial.appspot.com/o/2.png?alt=media&token=dc7379e4-488e-447e-9644-aef33cc8cccd" alt="Logo" style={{ height: '60px' }} />
            <Typography variant="h6">Formify AI</Typography>
        </Toolbar>
    </AppBar>
);

export default Header;
