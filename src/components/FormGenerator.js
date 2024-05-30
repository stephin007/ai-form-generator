"use client";

import React, { useState } from 'react';
import axios from 'axios';
import {
    AppBar, Toolbar, Typography, Container, TextField, Button, CircularProgress,
    Stepper, Step, StepLabel, Box, FormControlLabel, Radio, RadioGroup,
    FormLabel, FormControl, Grid, Paper, Snackbar, Alert, Divider, createTheme,
    ThemeProvider, CssBaseline
} from '@mui/material';
import { teal, grey, purple } from '@mui/material/colors';

const theme = createTheme({
    palette: {
        primary: {
            main: purple[500],
        },
        secondary: {
            main: grey[500],
        },
        background: {
            default: grey[100],
        },
    },
    typography: {
        h5: {
            fontWeight: 600,
        },
        h6: {
            fontWeight: 500,
        },
        body1: {
            fontSize: '1rem',
        },
    },
});

const steps = ['Choose Form Type', 'Set Number of Fields', 'Describe Your Form', 'Review and Generate'];

const FormGenerator = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const [formType, setFormType] = useState('');
    const [numFields, setNumFields] = useState(5);
    const [formDescription, setFormDescription] = useState('');
    const [formSchema, setFormSchema] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [loadingText, setLoadingText] = useState('');
    const [formData, setFormData] = useState({});

    const handleNextStep = () => {
        setCurrentStep(currentStep + 1);
    };

    const handlePreviousStep = () => {
        setCurrentStep(currentStep - 1);
    };

    const handleGenerateForm = async () => {
        setLoading(true);
        setLoadingText(getRandomLoadingText());
        const openaiApiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;

        if (!openaiApiKey) {
            setError('OpenAI API key is missing. Please set the API key.');
            setLoading(false);
            return;
        }

        const prompt = `
            Create a JSON schema for a ${formType} form with ${numFields} fields.
            Form Description: ${formDescription}.
            The questions should be meaningful and not contain placeholders like question 1, question 2, etc.
            The form should be user-friendly.
        `;

        try {
            const response = await axios.post(
                'https://api.openai.com/v1/chat/completions',
                {
                    model: 'gpt-3.5-turbo',
                    messages: [
                        {
                            role: 'system',
                            content: 'You are an assistant that generates user-friendly JSON schemas for forms.'
                        },
                        {
                            role: 'user',
                            content: prompt
                        }
                    ],
                    temperature: 0
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${openaiApiKey}`
                    }
                }
            );

            if (response.data.choices && response.data.choices.length > 0) {
                try {
                    const formSchema = JSON.parse(response.data.choices[0].message.content.trim());
                    setFormSchema(formSchema);
                    setError(null);
                } catch (jsonError) {
                    setError('The generated JSON is malformed.');
                }
            } else {
                setError('Did not receive a valid response from OpenAI.');
            }
        } catch (error) {
            console.error('Error generating form:', error);
            setError('Failed to generate form. Please check the console for more details.');
        } finally {
            setLoading(false);
        }
    };

    const getRandomLoadingText = () => {
        const loadingTexts = [
            'Building your form...',
            'Creating form fields...',
            'Almost there...',
            'Just a moment...',
            'Hang tight, preparing your form...',
        ];
        return loadingTexts[Math.floor(Math.random() * loadingTexts.length)];
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form submitted:', formData);
    };

    const exportToCSV = () => {
        const csvRows = [
            ["Field Name", "Type", "Title", "Min Length", "Max Length", "Minimum", "Maximum"],
            ...Object.keys(formSchema.properties).map(key => {
                const field = formSchema.properties[key];
                return [
                    key,
                    field.type,
                    field.title,
                    field.minLength,
                    field.maxLength,
                    field.minimum,
                    field.maximum
                ];
            })
        ];
        const csv = csvRows.map(row => row.join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'form-data.csv';
        a.click();
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
                <Button type="button" variant="contained" color="primary" onClick={exportToCSV} style={{ marginTop: '16px'}}>
                    Export to CSV
                </Button>
            </form>
        );
    };

    const renderStepContent = (step) => {
        switch (step) {
            case 0:
                return (
                    <Box>
                        <TextField
                            label="Form Type"
                            value={formType}
                            onChange={(e) => setFormType(e.target.value)}
                            placeholder="Enter the type of form (e.g., Registration, Feedback)"
                            fullWidth
                            margin="normal"
                            variant="outlined"
                        />
                    </Box>
                );
            case 1:
                return (
                    <Box>
                        <TextField
                            label="Number of Fields"
                            type="number"
                            value={numFields}
                            onChange={(e) => setNumFields(e.target.value)}
                            inputProps={{ min: 1, max: 20 }}
                            fullWidth
                            margin="normal"
                            variant="outlined"
                        />
                    </Box>
                );
            case 2:
                return (
                    <Box>
                        <TextField
                            label="Form Description"
                            value={formDescription}
                            onChange={(e) => setFormDescription(e.target.value)}
                            placeholder="Enter a description of the form's purpose or the type of questions (e.g., Collecting user feedback on a new product)"
                            fullWidth
                            margin="normal"
                            multiline
                            rows={4}
                            variant="outlined"
                        />
                    </Box>
                );
            case 3:
                return (
                    <Box>
                        <Divider style={{ marginBottom: '16px' }} />
                        <Typography><strong>Form Type:</strong> {formType}</Typography>
                        <Typography><strong>Number of Fields:</strong> {numFields}</Typography>
                        <Typography><strong>Form Description:</strong> {formDescription}</Typography>
                    </Box>
                );
            default:
                return null;
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Box display="flex" flexDirection="column" minHeight="100vh">
                <AppBar position="static">
                    <Toolbar>
                        <Typography variant="h6">Formify AI</Typography>
                    </Toolbar>
                </AppBar>
                <Container maxWidth="lg" style={{ flex: 1, display: 'flex', marginTop: '24px' }}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <Paper elevation={3} style={{ padding: '24px' }}>
                                <Typography variant="h5" gutterBottom>Follow the Steps</Typography>
                                <Stepper activeStep={currentStep} alternativeLabel>
                                    {steps.map((label, index) => (
                                        <Step key={index}>
                                            <StepLabel>{label}</StepLabel>
                                        </Step>
                                    ))}
                                </Stepper>
                                <Box mt={3} mb={2}>
                                    {renderStepContent(currentStep)}
                                </Box>
                                <Box>
                                    {currentStep > 0 && (
                                        <Button onClick={handlePreviousStep} variant="outlined" color="primary">
                                            Back
                                        </Button>
                                    )}
                                    {currentStep < steps.length - 1 && (
                                        <Button onClick={handleNextStep} variant="contained" color="primary" style={{ marginLeft: '8px' }}>
                                            Next
                                        </Button>
                                    )}
                                    {currentStep === steps.length - 1 && (
                                        <Button onClick={handleGenerateForm} variant="contained" color="primary" style={{ marginLeft: '8px' }}>
                                            Generate Form
                                        </Button>
                                    )}
                                </Box>
                                {loading && <CircularProgress style={{ marginTop: '16px' }} />}
                                {error && (
                                    <Snackbar open autoHideDuration={6000} onClose={() => setError(null)}>
                                        <Alert onClose={() => setError(null)} severity="error">
                                            {error}
                                        </Alert>
                                    </Snackbar>
                                )}
                            </Paper>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            {currentStep === 3 && formSchema && (
                                <Paper elevation={3} style={{ padding: '24px' }}>
                                <Typography variant="h5" gutterBottom>Form Preview</Typography>
                                <Divider style={{ marginBottom: '16px' }} />
                                {formSchema ? (
                                    renderForm()
                                ) : (
                                    <Typography variant="body1" color="textSecondary">
                                        Your form preview will appear here once generated.
                                    </Typography>
                                )}
                            </Paper>
                            )}
                            
                        </Grid>
                    </Grid>
                </Container>
            </Box>
        </ThemeProvider>
    );
};

export default FormGenerator;
