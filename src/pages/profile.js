import React from 'react';
import { useAuth } from '../../AuthContext';
import { Container, Typography, Avatar, Box, CircularProgress, Button, IconButton } from '@mui/material';
import { useRouter } from 'next/router';
import { logout } from '../../firebaseConfig';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const ProfilePage = () => {
    const { user, loading } = useAuth();
    const router = useRouter();

    React.useEffect(() => {
        if (!loading && !user) {
            router.push('/');
        }
    }, [user, loading, router]);

    const handleLogout = async () => {
        await logout();
        router.push('/');
    };

    const handleBack = () => {
        router.push('/form-generator');
    }

    if (loading) {
        return (
            <Container style={{display: 'flex',alignItems: 'center',height: '100vh',justifyContent: 'center'}}>
                <CircularProgress color='secondary' />
                <span style={{marginLeft: "40px"}}>Fetching your details...</span>
            </Container>
        );
    }

    return (
        user && (
            <Container>
            <Box display="flex" alignItems="center" mt={3}>
                    <IconButton onClick={handleBack}>
                        <ArrowBackIcon />
                    </IconButton>
                    <Typography variant="h4" style={{ marginLeft: '16px' }}>Profile</Typography>
                </Box>
                <Box display="flex" alignItems="center" mt={5}>
                    <Avatar src={user.photoURL} alt={user.displayName} style={{ width: '100px', height: '100px', marginRight: '20px' }} />
                    <Box>
                        <Typography variant="h4">{user.displayName}</Typography>
                        <div style={{display: "flex", alignItems: "center"}}>
                        <Typography variant="h6">{user.email}</Typography>
                        {user.reloadUserInfo.emailVerified && (
                                <CheckCircleIcon color="primary" style={{ marginLeft: '8px' }} />
                            )}
                        </div>
                        
                    </Box>
                </Box>
                <Box mt={3}>
                    <Typography variant="body1"><strong>User ID:</strong> {user.uid}</Typography>
                </Box>
                <Box mt={3}>
                    <Button variant="contained" color="secondary" onClick={handleLogout}>
                        Logout
                    </Button>
                </Box>
            </Container>
        )
    );
};

export default ProfilePage;
