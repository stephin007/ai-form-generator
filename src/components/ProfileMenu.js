import React from 'react';
import { Avatar, Menu, MenuItem, IconButton } from '@mui/material';
import { logout } from '../../firebaseConfig';
import { useAuth } from '../../AuthContext';
import { useRouter } from 'next/router';

const ProfileMenu = () => {
    const { user } = useAuth();
    console.log(user)
    const [anchorEl, setAnchorEl] = React.useState(null);
    const router = useRouter();

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        logout();
        handleClose();
    };

   const handleProfile = () => {
        router.push('/profile');
        handleClose();
    };

    return (
        <>
            <IconButton onClick={handleMenu} color="inherit">
                <Avatar src={user.photoURL} />
            </IconButton>
            <Menu
                anchorEl={anchorEl}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                keepMounted
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                <MenuItem onClick={handleProfile}>Profile</MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
        </>
    );
};

export default ProfileMenu;
