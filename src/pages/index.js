import React, { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useAuth } from "../../AuthContext";
import { signInWithGoogle } from "../../firebaseConfig";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
  Grid,
  Paper,
  CssBaseline,
} from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import FloatingFeedbackButton from "@/components/FloatingFeedbackButton";
import LockIcon from "@mui/icons-material/Lock";

const theme = createTheme({
  palette: {
    primary: {
      main: "#0072ff",
    },
    secondary: {
      main: "#ff4e50",
    },
    background: {
      default: "#f7f8fc",
      paper: "#ffffff",
    },
  },
  typography: {
    h1: {
      fontWeight: 700,
      fontSize: "2.5rem",
      marginBottom: "1rem",
      WebkitBackgroundClip: "text",
      textAlign: "center",
      "@media (min-width:600px)": {
        fontSize: "3rem",
      },
    },
    h2: {
      fontWeight: 600,
      fontSize: "1.5rem",
      color: "#0072ff",
      marginBottom: "1rem",
      textAlign: "center",
      "@media (min-width:600px)": {
        fontSize: "2rem",
      },
    },
    h3: {
      fontWeight: 500,
      fontSize: "1.25rem",
      color: "#333333",
      marginBottom: "0.5rem",
      textAlign: "center",
      "@media (min-width:600px)": {
        fontSize: "1.5rem",
      },
    },
    body1: {
      fontSize: "0.875rem",
      color: "#666666",
      marginBottom: "1rem",
      textAlign: "center",
      "@media (min-width:600px)": {
        fontSize: "1rem",
      },
    },
    button: {
      fontWeight: 700,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "8px",
          textTransform: "none",
          padding: "10px 20px",
        },
        containedPrimary: {
          background: "linear-gradient(90deg, #00c6ff, #0072ff)",
          color: "#fff",
          "&:hover": {
            backgroundColor: "#005bb5",
          },
        },
        containedSecondary: {
          background: "linear-gradient(90deg, #ff4e50, #f9d423)",
          color: "#fff",
          "&:hover": {
            backgroundColor: "#d84040",
          },
        },
      },
    },
  },
});

const LandingPage = () => {
  const { user } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (user) {
      router.push("/form-generator");
    }
  }, [user, router]);
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar
        position="fixed"
        elevation={1}
        sx={{ bgcolor: "background.paper" }}
      >
        <Toolbar style={{ display: "flex", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <img
              src="https://firebasestorage.googleapis.com/v0/b/cristomathewmemorial.appspot.com/o/1.png?alt=media&token=55b753f2-fc97-4768-b091-1d4020412920"
              alt="Logo"
              style={{ height: "60px" }}
            />
            <Typography
              variant="h6"
              component="div"
              sx={{ flexGrow: 1, fontWeight: 700 }}
              color="secondary"
            >
              FormifyAI
            </Typography>
          </div>
          {/* <Button color="primary" sx={{ mr: 2 }}>Log in</Button> */}
          <Button
            variant="contained"
            color="primary"
            onClick={signInWithGoogle}
          >
            <LockIcon style={{ marginRight: "5px" }} />
            Login with Google
          </Button>
        </Toolbar>
      </AppBar>
      <Box sx={{ pt: 8, pb: 10, backgroundColor: "#fff", mt: 8 }}>
        <Container maxWidth="md" sx={{ textAlign: "center", py: 10 }}>
          <Typography variant="h1" component="h1" gutterBottom>
            Make <span style={{ color: "#ff4e50" }}>any form</span> in minutes
          </Typography>
          <Typography variant="h2" component="p" gutterBottom>
            Create powerful forms, surveys, and quizzes your audience will
            answer.
          </Typography>
          <Button
            onClick={signInWithGoogle}
            variant="outlined"
            color="primary"
            size="large"
            sx={{ mt: 3 }}
          >
            Get started - it's free
          </Button>
          <Box sx={{ mt: 5 }}>
            <img
              src="https://img.freepik.com/free-vector/flat-woman-chatting-with-chatbot-communicating-ai-robot-assistant_88138-959.jpg?t=st=1717252826~exp=1717256426~hmac=3ab4d15c06a6b4233962aa478d75c4e3ccafb968a3ca881f028cd380c059a643&w=826"
              alt="Form Example"
              width="100%"
              style={{ maxWidth: "800px", height: "auto" }}
            />
          </Box>
        </Container>
      </Box>
      <Container maxWidth="lg" sx={{ py: 10 }}>
        <Typography
          variant="h2"
          component="h2"
          gutterBottom
          sx={{ textAlign: "center", color: "#333333" }}
        >
          Build any form, without code
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Paper
              elevation={3}
              sx={{
                p: 3,
                textAlign: "center",
                borderRadius: "20px",
                transition: "transform 0.3s",
                "&:hover": { transform: "translateY(-10px)" },
              }}
            >
              <Typography variant="h3" component="h3">
                Fully Customizable
              </Typography>
              <Typography variant="body1" component="p">
                Tailor every aspect of your forms to match your brand and
                requirements.
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper
              elevation={3}
              sx={{
                p: 3,
                textAlign: "center",
                borderRadius: "20px",
                transition: "transform 0.3s",
                "&:hover": { transform: "translateY(-10px)" },
              }}
            >
              <Typography variant="h3" component="h3">
                Real-Time Preview
              </Typography>
              <Typography variant="body1" component="p">
                Instantly visualize changes to your forms as you build them.
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper
              elevation={3}
              sx={{
                p: 3,
                textAlign: "center",
                borderRadius: "20px",
                transition: "transform 0.3s",
                "&:hover": { transform: "translateY(-10px)" },
              }}
            >
              <Typography variant="h3" component="h3">
                AI Integration
              </Typography>
              <Typography variant="body1" component="p">
                Utilize AI to create intelligent and dynamic forms effortlessly.
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper
              elevation={3}
              sx={{
                p: 3,
                textAlign: "center",
                borderRadius: "20px",
                transition: "transform 0.3s",
                "&:hover": { transform: "translateY(-10px)" },
              }}
            >
              <Typography variant="h3" component="h3">
                Templates Available
              </Typography>
              <Typography variant="body1" component="p">
                Choose from a variety of pre-designed templates to quickly
                create forms tailored to your needs.
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Container>
      <Box component="section" sx={{ textAlign: "center", mb: 6 }}>
        <Typography variant="h2" component="h2" gutterBottom>
          Ready to Get Started?
        </Typography>
        <Link href="/form-generator" passHref legacyBehavior>
          <Button
            onClick={signInWithGoogle}
            variant="contained"
            color="secondary"
            size="large"
            sx={{ mt: 3 }}
            endIcon={<ArrowForwardIcon />}
          >
            Create Your Form
          </Button>
        </Link>
      </Box>
      <Box sx={{ py: 3, textAlign: "center", bgcolor: "#f7f8fc" }}>
        <Typography variant="body1">
          &copy; 2024 FormifyAI. All rights reserved.
        </Typography>
      </Box>
      <FloatingFeedbackButton />
    </ThemeProvider>
  );
};

export default LandingPage;
