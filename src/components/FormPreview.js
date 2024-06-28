import React from "react";
import {
  Paper,
  Typography,
  CircularProgress,
  Snackbar,
  Alert,
  Divider,
  Button,
  Grid,
  TextField,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import { useAuth } from "../../AuthContext";
import { saveToProfile } from "../../firebaseConfig";

const FormPreview = ({
  loading,
  loadingText,
  error,
  setError,
  formSchema,
  handleChange,
  handleSubmit,
  exportToCSV,
}) => {
  const { user, success, setSuccess } = useAuth();

  const handleSaveToProfile = async () => {
    if (user) {
      try {
        await saveToProfile(formSchema, user.email, user.uid);
        setSuccess("Form saved to profile successfully!");
      } catch (error) {
        setError("Error saving form to profile: " + error.message);
      }
    } else {
      setError("You must be logged in to save the form to your profile.");
    }
  };

  const renderFormField = (field, key, isRequired) => {
    switch (field.type) {
      case "string":
        return (
          <TextField
            label={field.title}
            type={field.format === "email" ? "email" : "text"}
            name={key}
            required={isRequired}
            minLength={field.minLength}
            maxLength={field.maxLength}
            onChange={handleChange}
            fullWidth
          />
        );
      case "number":
      case "integer":
        return (
          <TextField
            label={field.title}
            type="number"
            name={key}
            required={isRequired}
            inputProps={{ min: field.minimum, max: field.maximum }}
            onChange={handleChange}
            fullWidth
          />
        );
      case "boolean":
        return (
          <FormControl component="fieldset">
            <FormLabel component="legend">{field.title}</FormLabel>
            <RadioGroup row name={key} onChange={handleChange}>
              <FormControlLabel value="true" control={<Radio />} label="Yes" />
              <FormControlLabel value="false" control={<Radio />} label="No" />
            </RadioGroup>
          </FormControl>
        );
      default:
        return null;
    }
  };

  const renderForm = () => {
    if (!formSchema || !formSchema.properties) {
      return null;
    }

    return (
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          {Object.keys(formSchema.properties).map((key, index) => {
            const field = formSchema.properties[key];
            const isRequired = formSchema.required.includes(key);
            return (
              <Grid item xs={12} key={index}>
                {renderFormField(field, key, isRequired)}
              </Grid>
            );
          })}
        </Grid>
        <Grid container spacing={2} style={{ marginTop: "16px" }}>
          <Grid item>
            <Button
              type="button"
              variant="contained"
              color="primary"
              onClick={exportToCSV}
            >
              Export to CSV
            </Button>
          </Grid>
          <Grid item>
            <Button
              type="button"
              variant="contained"
              color="secondary"
              onClick={handleSaveToProfile}
            >
              Save to Profile
            </Button>
          </Grid>
        </Grid>
      </form>
    );
  };

  return (
    <Paper elevation={3} style={{ padding: "24px" }}>
      <Typography variant="h5" gutterBottom>
        Form Preview
      </Typography>
      <Divider style={{ marginBottom: "16px" }} />
      {loading && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginTop: "16px",
          }}
        >
          <CircularProgress />
          <Typography variant="body1" style={{ marginLeft: "8px" }}>
            {loadingText}
          </Typography>
        </div>
      )}
      {success && (
        <Snackbar open autoHideDuration={6000} onClose={() => setSuccess(null)}>
          <Alert onClose={() => setSuccess(null)} severity="success">
            {success}
          </Alert>
        </Snackbar>
      )}
      {error && (
        <Snackbar open autoHideDuration={6000} onClose={() => setError(null)}>
          <Alert onClose={() => setError(null)} severity="error">
            {error}
          </Alert>
        </Snackbar>
      )}
      {formSchema
        ? renderForm()
        : !loading && (
            <Typography variant="body1" color="textSecondary">
              Your form preview will appear here once generated.
            </Typography>
          )}
    </Paper>
  );
};

export default FormPreview;
