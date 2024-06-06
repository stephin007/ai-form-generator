import React from 'react';
import { Paper, Typography, CircularProgress, Snackbar, Alert, Divider, Button, Grid, TextField, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio } from '@mui/material';

const FormPreview = ({ loading, loadingText, success, error, setSuccess, setError, formSchema, handleChange, handleSubmit, exportToCSV }) => {
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

                        switch (field.type) {
                            case 'string':
                                if (field.format === 'email') {
                                    return (
                                        <Grid item xs={12} key={index}>
                                            <TextField
                                                label={field.title}
                                                type="email"
                                                name={key}
                                                required={isRequired}
                                                minLength={field.minLength}
                                                maxLength={field.maxLength}
                                                onChange={handleChange}
                                                fullWidth
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
                                            onChange={handleChange}
                                            fullWidth
                                        />
                                    </Grid>
                                );
                            case 'number':
                            case 'integer':
                                return (
                                    <Grid item xs={12} key={index}>
                                        <TextField
                                            label={field.title}
                                            type="number"
                                            name={key}
                                            required={isRequired}
                                            inputProps={{ min: field.minimum, max: field.maximum }}
                                            onChange={handleChange}
                                            fullWidth
                                        />
                                    </Grid>
                                );
                            case 'boolean':
                                return (
                                    <Grid item xs={12} key={index}>
                                        <FormControl component="fieldset">
                                            <FormLabel component="legend">{field.title}</FormLabel>
                                            <RadioGroup row name={key} onChange={handleChange}>
                                                <FormControlLabel value="true" control={<Radio />} label="Yes" />
                                                <FormControlLabel value="false" control={<Radio />} label="No" />
                                            </RadioGroup>
                                        </FormControl>
                                    </Grid>
                                );
                            default:
                                return null;
                        }
                    })}
                </Grid>
                <Button type="button" variant="contained" color="primary" onClick={exportToCSV} style={{ marginTop: '16px' }}>
                    Export to CSV
                </Button>
            </form>
        );
    };

    return (
        <Paper elevation={3} style={{ padding: '24px' }}>
            <Typography variant="h5" gutterBottom>Form Preview</Typography>
            <Divider style={{ marginBottom: '16px' }} />
            {loading && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '16px' }}>
                    <CircularProgress />
                    <Typography variant="body1" style={{ marginLeft: '8px' }}>{loadingText}</Typography>
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
            {formSchema ? (
                renderForm()
            ) : (
                <>
                    {!loading && (
                        <Typography variant="body1" color="textSecondary">
                            Your form preview will appear here once generated.
                        </Typography>
                    )}
                </>
            )}
        </Paper>
    );
};

export default FormPreview;
