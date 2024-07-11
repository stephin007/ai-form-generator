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
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
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
                    onChange={(e) =>
                      handleFieldChange(key, "type", e.target.value)
                    }
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
              {field.type === "select" && (
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    label="Options (comma separated)"
                    value={field.enum ? field.enum.join(",") : ""}
                    onChange={(e) =>
                      handleFieldChange(key, "enum", e.target.value.split(","))
                    }
                    fullWidth
                    variant="outlined"
                    size="small"
                  />
                </Grid>
              )}
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
                  <DeleteIcon />
                </IconButton>
              </Grid>
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
