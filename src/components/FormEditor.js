import React from "react";
import {
  TextField,
  Button,
  Grid,
  MenuItem,
  Select,
  FormControl,
  Divider,
  Typography,
  useMediaQuery,
  useTheme,
  IconButton,
  Tooltip,
} from "@mui/material";
import { Add as AddIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { useAuth } from "../../AuthContext";

const fieldTypes = [
  "text",
  "number",
  "integer",
  "boolean",
  "date",
  "password",
  "select",
  "phone",
  "url",
  "time",
];

const FormEditor = ({ formSchema, setFormSchema }) => {
  const { setEdit } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleFieldChange = (key, prop, value) => {
    const updatedProperties = { ...formSchema.properties };
    updatedProperties[key][prop] = value;
    setFormSchema({ ...formSchema, properties: updatedProperties });
  };

  const handleAddField = () => {
    const newField = {
      title: "random data",
      type: "text",
    };
    const updatedProperties = {
      ...formSchema.properties,
      [`field_${Date.now()}`]: newField,
    };
    setFormSchema({ ...formSchema, properties: updatedProperties });
  };

  const handleDeleteField = (key) => {
    const updatedProperties = { ...formSchema.properties };
    delete updatedProperties[key];
    setFormSchema({ ...formSchema, properties: updatedProperties });
  };

  const renderFieldOptions = (key, field) => {
    switch (field.type) {
      case "string":
      case "password":
        return (
          <>
            <Grid item xs={6}>
              <TextField
                label="Min Length"
                type="number"
                value={field.minLength || ""}
                onChange={(e) =>
                  handleFieldChange(key, "minLength", e.target.value)
                }
                fullWidth
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Max Length"
                type="number"
                value={field.maxLength || ""}
                onChange={(e) =>
                  handleFieldChange(key, "maxLength", e.target.value)
                }
                fullWidth
              />
            </Grid>
            <Divider
              style={{ width: "100%", marginTop: "16px", marginLeft: "9px" }}
            />
          </>
        );
      case "number":
      case "integer":
        return (
          <>
            <Grid item xs={6}>
              <TextField
                label="Minimum"
                type="number"
                value={field.minimum || ""}
                onChange={(e) =>
                  handleFieldChange(key, "minimum", e.target.value)
                }
                fullWidth
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Maximum"
                type="number"
                value={field.maximum || ""}
                onChange={(e) =>
                  handleFieldChange(key, "maximum", e.target.value)
                }
                fullWidth
              />
            </Grid>

            <Divider
              style={{ width: "100%", marginTop: "16px", marginLeft: "9px" }}
            />
          </>
        );
      case "select":
        return (
          <>
            <Grid item xs={12}>
              <TextField
                label="Options (comma separated)"
                value={field.enum ? field.enum.join(", ") : ""}
                onChange={(e) =>
                  handleFieldChange(
                    key,
                    "enum",
                    e.target.value.split(",").map((opt) => opt.trim())
                  )
                }
                fullWidth
              />
            </Grid>
            <Divider
              style={{ width: "100%", marginTop: "16px", marginLeft: "9px" }}
            />
          </>
        );
      default:
        return null;
    }
  };

  if (!formSchema) return null;

  return (
    <div>
      <Typography variant="h6" gutterBottom>
        Editing {formSchema.title}
      </Typography>
      <Divider style={{ marginBottom: "16px" }} />
      <Grid container spacing={isMobile ? 1 : 2}>
        {Object.keys(formSchema.properties).map((key) => {
          const field = formSchema.properties[key];
          return (
            <Grid container item xs={12} spacing={isMobile ? 1 : 2} key={key}>
              <Grid item xs={12} sm={6} md={5}>
                <TextField
                  label="Field Title"
                  value={field.title}
                  onChange={(e) =>
                    handleFieldChange(key, "title", e.target.value)
                  }
                  fullWidth
                  variant="outlined"
                  size="small"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <FormControl fullWidth>
                  <Select
                    value={field.type}
                    onChange={(e) => {
                      const value = e.target.value;
                      handleFieldChange(key, "type", value);
                      if (value === "select" && !field.enum) {
                        handleFieldChange(key, "enum", []);
                      }
                    }}
                    fullWidth
                    variant="outlined"
                    size="small"
                  >
                    {fieldTypes.map((type) => (
                      <MenuItem key={type} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid
                item
                xs={12}
                sm={6}
                md={3}
                display="flex"
                alignItems="center"
              >
                <IconButton
                  color="secondary"
                  onClick={() => handleDeleteField(key)}
                >
                  <Tooltip title="Delete Field">
                    <DeleteIcon />
                  </Tooltip>
                </IconButton>
              </Grid>
              {renderFieldOptions(key, field)}
            </Grid>
          );
        })}
      </Grid>
      <Button
        variant="contained"
        color="primary"
        onClick={handleAddField}
        style={{ marginTop: "16px" }}
        fullWidth={isMobile}
        startIcon={<AddIcon />}
      >
        Add Field
      </Button>
      <Button
        variant="outlined"
        color="secondary"
        onClick={() => setEdit(false)}
        style={{ marginTop: "16px", marginLeft: "16px" }}
        fullWidth={isMobile}
      >
        Back
      </Button>
    </div>
  );
};

export default FormEditor;
