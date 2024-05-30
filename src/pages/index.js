import React from 'react';
import Link from 'next/link';
import {
    AppBar, Toolbar, Typography, Button, Container, Box, Grid, Paper, CssBaseline, IconButton
} from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { teal, grey } from '@mui/material/colors';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const theme = createTheme({
    palette: {
        primary: {
            main: '#0072ff',
        },
        secondary: {
            main: '#ff4e50',
        },
        background: {
            default: '#f7f8fc',
        },
    },
    typography: {
        h1: {
            fontWeight: 700,
            fontSize: '3rem',
            marginBottom: '1rem',
            background: 'linear-gradient(90deg, #00c6ff, #0072ff)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
        },
        h2: {
            fontWeight: 500,
            marginBottom: '0.5rem',
            color: '#0072ff',
        },
        h3: {
            fontWeight: 500,
            marginBottom: '0.5rem',
            color: '#ff4e50',
        },
        body1: {
            fontSize: '1.2rem',
            color: '#333',
        },
        button: {
            fontWeight: 700,
        },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: '30px',
                    textTransform: 'none',
                    padding: '10px 30px',
                },
                containedPrimary: {
                    background: 'linear-gradient(90deg, #00c6ff, #0072ff)',
                    color: '#fff',
                },
                containedSecondary: {
                    background: 'linear-gradient(90deg, #ff4e50, #f9d423)',
                    color: '#fff',
                },
            },
        },
    },
});

const LandingPage = () => {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <AppBar position="fixed" elevation={1} >
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 700 }}>
                        Formify AI
                    </Typography>
                    <Button color="primary" href="/form-generator" variant="contained" endIcon={<ArrowForwardIcon />}>
                        Get Started
                    </Button>
                </Toolbar>
            </AppBar>
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}  style={{ marginTop: '74px' }}>
                <Box sx={{ textAlign: 'center', mb: 6 }}>
                    <Typography variant="h1" component="h1" gutterBottom>
                        AI Form Generator
                    </Typography>
                    <Typography variant="h5" component="p" gutterBottom>
                        Seamlessly design and deploy sophisticated forms powered by AI.
                    </Typography>
                    <Link href="/form-generator" passHref legacyBehavior>
                        <Button variant="contained" color="primary" size="large" sx={{ mt: 3 }} endIcon={<ArrowForwardIcon />}>
                            Start Now
                        </Button>
                    </Link>
                </Box>
                <Box component="section" sx={{ mb: 6 }}>
                    <Typography variant="h2" component="h2" gutterBottom>
                        Key Features
                    </Typography>
                    <Grid container spacing={4}>
                        <Grid item xs={12} md={4}>
                            <Paper elevation={3} sx={{ p: 3, textAlign: 'center', borderRadius: '20px', transition: 'transform 0.3s', '&:hover': { transform: 'translateY(-10px)' } }}>
                                <Typography variant="h3" component="h3">
                                    Fully Customizable
                                </Typography>
                                <Typography variant="body1" component="p">
                                    Tailor every aspect of your forms to match your brand and requirements.
                                </Typography>
                            </Paper>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Paper elevation={3} sx={{ p: 3, textAlign: 'center', borderRadius: '20px', transition: 'transform 0.3s', '&:hover': { transform: 'translateY(-10px)' } }}>
                                <Typography variant="h3" component="h3">
                                    Real-Time Preview
                                </Typography>
                                <Typography variant="body1" component="p">
                                    Instantly visualize changes to your forms as you build them.
                                </Typography>
                            </Paper>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Paper elevation={3} sx={{ p: 3, textAlign: 'center', borderRadius: '20px', transition: 'transform 0.3s', '&:hover': { transform: 'translateY(-10px)' } }}>
                                <Typography variant="h3" component="h3">
                                    AI Integration
                                </Typography>
                                <Typography variant="body1" component="p">
                                    Utilize AI to create intelligent and dynamic forms effortlessly.
                                </Typography>
                            </Paper>
                        </Grid>
                    </Grid>
                </Box>
                <Box component="section" sx={{ textAlign: 'center', mb: 6 }}>
                    <Typography variant="h2" component="h2" gutterBottom>
                        Ready to Get Started?
                    </Typography>
                    <Link href="/form-generator" passHref legacyBehavior>
                        <Button variant="contained" color="secondary" size="large" sx={{ mt: 3 }} endIcon={<ArrowForwardIcon />}>
                            Create Your Form
                        </Button>
                    </Link>
                </Box>
            </Container>
            <Box component="footer" sx={{ py: 3, textAlign: 'center', bgcolor: '#f7f8fc' }}>
                <Typography variant="body1">
                    &copy; 2024 FormifyAI. All rights reserved.
                </Typography>
            </Box>
        </ThemeProvider>
    );
};

export default LandingPage;
