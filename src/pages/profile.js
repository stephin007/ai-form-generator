import React, { useState, useEffect } from "react";
import { useAuth } from "../../AuthContext";
import {
  Container,
  Typography,
  Avatar,
  Box,
  CircularProgress,
  IconButton,
  CardHeader,
  CardContent,
  CardActions,
  Button,
  Grid,
  TextField,
  Card,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import Masonry from "@mui/lab/Masonry";
import { useRouter } from "next/router";
import { logout, fetchForms } from "../../firebaseConfig";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const ProfilePage = () => {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [forms, setForms] = useState([]);
  const [loadingForms, setLoadingForms] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      const fetchUserForms = async () => {
        const userForms = await fetchForms(user.uid);
        setForms(userForms);
        console.log("userForms: ", userForms);
        setLoadingForms(false);
      };
      fetchUserForms();
    }
  }, [user]);

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  const handleBack = () => {
    router.push("/form-generator");
  };

  const renderForm = (formSchema) => {
    if (!formSchema || !formSchema.properties) {
      return null;
    }

    return (
      <Grid container spacing={2}>
        {Object.keys(formSchema.properties).map((key, index) => {
          const field = formSchema.properties[key];
          const isRequired = formSchema.required.includes(key);

          switch (field.type) {
            case "string":
              if (field.format === "email") {
                return (
                  <Grid item xs={12} key={index}>
                    <TextField
                      label={field.title}
                      type="email"
                      name={key}
                      required={isRequired}
                      minLength={field.minLength}
                      maxLength={field.maxLength}
                      fullWidth
                      disabled
                    />
                  </Grid>
                );
              }
              return (
                <Grid item xs={12} key={index}>
                  <TextField
                    label={field.title}
                    type="text"
                    name={key}
                    required={isRequired}
                    minLength={field.minLength}
                    maxLength={field.maxLength}
                    fullWidth
                    disabled
                  />
                </Grid>
              );
            case "number":
            case "integer":
              return (
                <Grid item xs={12} key={index}>
                  <TextField
                    label={field.title}
                    type="number"
                    name={key}
                    required={isRequired}
                    inputProps={{ min: field.minimum, max: field.maximum }}
                    fullWidth
                    disabled
                  />
                </Grid>
              );
            case "boolean":
              return (
                <Grid item xs={12} key={index}>
                  <FormControl component="fieldset">
                    <FormLabel component="legend">{field.title}</FormLabel>
                    <RadioGroup row name={key}>
                      <FormControlLabel
                        value="true"
                        control={<Radio />}
                        label="Yes"
                        disabled
                      />
                      <FormControlLabel
                        value="false"
                        control={<Radio />}
                        label="No"
                        disabled
                      />
                    </RadioGroup>
                  </FormControl>
                </Grid>
              );
            default:
              return null;
          }
        })}
      </Grid>
    );
  };

  const jsonToCSV = (jsonData) => {
    const keys = Object.keys(jsonData.properties);
    const csvRows = keys.map((key) => {
      const field = jsonData.properties[key];
      return `${key}, ${field.title || ""}, ${field.type || ""}, ${
        field.format || ""
      }`;
    });
    return ["Key, Title, Type, Format", ...csvRows].join("\n");
  };

  const downloadCSV = (csvString, filename) => {
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `${filename}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportToCSV = (form) => {
    const csvString = jsonToCSV(form.formSchema);
    downloadCSV(csvString, form.formSchema.title || "UntitledForm");
  };

  if (loading || loadingForms) {
    return (
      <Container
        style={{
          display: "flex",
          alignItems: "center",
          height: "100vh",
          justifyContent: "center",
        }}
      >
        <CircularProgress color="secondary" />
        <span style={{ marginLeft: "40px" }}>Fetching your details...</span>
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
          <Typography variant="h4" style={{ marginLeft: "16px" }}>
            Profile
          </Typography>
        </Box>
        <Box display="flex" alignItems="center" mt={5}>
          <Avatar
            src={user.photoURL}
            alt={user.displayName}
            style={{ width: "100px", height: "100px", marginRight: "20px" }}
          />
          <Box>
            <Typography variant="h4">{user.displayName}</Typography>
            <div style={{ display: "flex", alignItems: "center" }}>
              <Typography variant="h6">{user.email}</Typography>
              {user.reloadUserInfo.emailVerified && (
                <CheckCircleIcon
                  color="primary"
                  style={{ marginLeft: "8px" }}
                />
              )}
            </div>
          </Box>
        </Box>
        <Box mt={3}>
          <Typography variant="body1">
            <strong>User ID:</strong> {user.uid}
          </Typography>
        </Box>
        <Box mt={3}>
          <Typography variant="h5">Saved Forms</Typography>
          {forms.length > 0 ? (
            <Masonry columns={3} spacing={2} style={{ marginTop: "20px" }}>
              {forms.map((form) => (
                <Card
                  key={form.id}
                  style={{
                    breakInside: "avoid",
                    borderRadius: "8px",
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <CardHeader
                    title={form.formSchema.title || "Untitled Form"}
                    subheader={`Created At: ${new Date(
                      form.createdAt.seconds * 1000
                    ).toLocaleString()}`}
                    titleTypographyProps={{ variant: "h6" }}
                  />
                  <CardContent>{renderForm(form.formSchema)}</CardContent>
                  <CardActions>
                    <Button
                      size="small"
                      color="secondary"
                      onClick={() => handleExportToCSV(form)}
                    >
                      Export to CSV
                    </Button>
                    <Button size="small" color="error">
                      Delete
                    </Button>
                  </CardActions>
                </Card>
              ))}
            </Masonry>
          ) : (
            <Typography variant="body1">No forms saved yet.</Typography>
          )}
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
