"use client";

import React, { useState } from 'react';
import axios from 'axios';
import {
    AppBar, Toolbar, Typography, Container, TextField, Button, CircularProgress,
    Stepper, Step, StepLabel, Box, FormControlLabel, Radio, RadioGroup,
    FormLabel, FormControl, Grid, Paper, Snackbar, Alert, Divider, createTheme,
    ThemeProvider, CssBaseline, InputLabel, Select, MenuItem
} from '@mui/material';
import { teal, grey, purple } from '@mui/material/colors';
import { render } from 'react-dom';

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

const predefinedFormTypes = [
    'Registration',
    'Feedback',
    'Survey',
    'Application',
    'Contact Us',
    'Order Form',
    'Subscription',
    'Login',
    'Job Application',
    'Event RSVP',
    'Product Review',
    'Support Ticket',
    'Newsletter Signup',
    'Poll',
    'Appointment Booking',
    'User Profile',
    'Contest Entry',
];

const FormGenerator = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const [formType, setFormType] = useState('');
    const [numFields, setNumFields] = useState(5);
    const [formDescription, setFormDescription] = useState('');
    const [formSchema, setFormSchema] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [loadingText, setLoadingText] = useState('');
    const [formData, setFormData] = useState({});
    const [customFormType, setCustomFormType] = useState('');
    const [isCustom, setIsCustom] = useState(false);

    const handleFormTypeChange = (e) => {
        const value = e.target.value;
        if (value === 'custom') {
            setIsCustom(true);
            setFormType('');
        } else {
            setIsCustom(false);
            setFormType(value);
        }
    };

    const handleNextStep = () => {
        setCurrentStep(currentStep + 1);
    };

    const handlePreviousStep = () => {
        setCurrentStep(currentStep - 1);
    };

    const handleGenerateForm = async (selectedTemplate = null) => {
        setLoading(true);
        setLoadingText(getRandomLoadingText());
        const openaiApiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;

        if (!openaiApiKey) {
            setError('OpenAI API key is missing. Please set the API key.');
            setLoading(false);
            return;
        }

        const formTypeToUse = selectedTemplate ? selectedTemplate.formType : (formType || customFormType);
        const numFieldsToUse = selectedTemplate ? selectedTemplate.numFields : numFields;
        const formDescriptionToUse = selectedTemplate ? selectedTemplate.formDescription : formDescription;

        const prompt = `
            Create a JSON schema for a ${formTypeToUse} form with ${numFieldsToUse} fields.
            Form Description: ${formDescriptionToUse}.
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
                    setSuccess("Form generated successfully!");
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
                         <FormControl fullWidth margin="normal" variant="outlined">
                            <InputLabel>Form Type</InputLabel>
                            <Select
                                value={isCustom ? 'custom' : formType}
                                onChange={handleFormTypeChange}
                                label="Form Type"
                            >
                                <MenuItem value="custom">Add Custom</MenuItem>
                                {predefinedFormTypes.map((type) => (
                                    <MenuItem key={type} value={type}>
                                        {type}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        {isCustom && (
                            <TextField
                                label="Custom Form Type"
                                value={customFormType}
                                onChange={(e) => setCustomFormType(e.target.value)}
                                placeholder="Enter the custom form type"
                                fullWidth
                                margin="normal"
                                variant="outlined"
                            />
                        )} 
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
                            label="Form Description (At least 15 characters)"
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
                        <Typography><strong>Form Type:</strong> {formType || customFormType}</Typography>
                        <Typography><strong>Number of Fields:</strong> {numFields}</Typography>
                        <Typography><strong>Form Description:</strong> {formDescription}</Typography>
                    </Box>
                );
            default:
                return null;
        }
    };

    const templates = [
        { formType: 'Registration', numFields: 5, formDescription: 'User registration form for a new website' },
        { formType: 'Feedback', numFields: 4, formDescription: 'Feedback form to gather user opinions on a product' },
        { formType: 'Survey', numFields: 10, formDescription: 'Survey form to collect data on user preferences' },
        { formType: 'Application', numFields: 8, formDescription: 'Application form for a job or program' },
        { formType: 'Contact Us', numFields: 6, formDescription: 'Contact form for users to reach out to support' },
        { formType: 'Order Form', numFields: 7, formDescription: 'Order form for purchasing products or services' },
        { formType: 'Subscription', numFields: 5, formDescription: 'Subscription form for users to sign up for updates' },
        { formType: 'Login', numFields: 2, formDescription: 'Login form for users to access their accounts' },
        { formType: 'Job Application', numFields: 9, formDescription: 'Job application form for candidates to apply' },
        { formType: 'Event RSVP', numFields: 3, formDescription: 'Event RSVP form for attendees to confirm their presence' },
        { formType: 'Product Review', numFields: 6, formDescription: 'Product review form for users to share feedback' },
        { formType: 'Support Ticket', numFields: 5, formDescription: 'Support ticket form for users to report issues' },
        { formType: 'Newsletter Signup', numFields: 3, formDescription: 'Newsletter signup form for users to subscribe' },
        { formType: 'Poll', numFields: 4, formDescription: 'Poll form to gather opinions on a specific topic' },
        { formType: 'Appointment Booking', numFields: 6, formDescription: 'Appointment booking form for scheduling meetings' },
        { formType: 'User Profile', numFields: 7, formDescription: 'User profile form for updating personal information' },
        { formType: 'Contest Entry', numFields: 5, formDescription: 'Contest entry form for participating in a competition' }

    ];

    const renderTemplates = () => {
        if (currentStep !== 0) {
            return null;
        }
        return (
            <Box mt={3} style={{ overflowY: 'scroll', maxHeight: '400px' }}>
                <Typography variant="h5" gutterBottom style={{ position: 'sticky', top: 0, backgroundColor: 'white', padding: "10px", zIndex: 1 }}>
                    Need Help? Use a Template
                </Typography>
                <Divider style={{ marginBottom: '16px' }} />
                <Grid container spacing={2}>
                {templates.map((template, index) => (
    <Grid item xs={12} sm={6} md={4} key={index}>
        <Paper elevation={2} style={{ padding: '16px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
                <Typography variant="h6">{template.formType} Template</Typography>
                <Typography variant="body2"><strong>Number of Fields:</strong> {template.numFields}</Typography>
                <Typography variant="body2"><strong>Description:</strong> {template.formDescription}</Typography>
            </div>
            <Button 
                variant="contained" 
                color="primary" 
                style={{ marginTop: '16px' }} 
                onClick={() => handleGenerateForm(template)}
            >
                Use Template
            </Button>
        </Paper>
    </Grid>
))}

                </Grid>
            </Box>
        );
    };

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Box display="flex" flexDirection="column" minHeight="100vh">
                <AppBar position="fixed">
                    <Toolbar>
                        <Typography variant="h6">Formify AI</Typography>
                    </Toolbar>
                </AppBar>
                <Container maxWidth="lg" style={{ flex: 1, display: 'flex', marginTop: '80px' }}>
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

                                        <Button onClick={handleNextStep} disabled={(currentStep === 0 && (isCustom && !customFormType)) || (!isCustom && !formType) || (currentStep === 2 && (!formDescription || formDescription.length < 15))} variant="contained" color="primary" style={{ marginLeft: '8px' }}>
                                            Next
                                        </Button>
                                        
                                    )}
                                    {currentStep === steps.length - 1 && (
                                        <Button onClick={handleGenerateForm} variant="contained" color="primary" style={{ marginLeft: '8px' }}>
                                            Generate Form
                                        </Button>
                                    )}
                                </Box>
                                
                                
                            </Paper>
                            {renderTemplates()}
                        </Grid>
                        <Grid item xs={12} md={6}>
                            
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
                                    {
                                        !loading && (
                                            <Typography variant="body1" color="textSecondary">
                                                Your form preview will appear here once generated.
                                            </Typography>
                                        )
                                    }
                                    </>
                                )}
                            </Paper>
                        
                            
                        </Grid>
                    </Grid>
                </Container>
            </Box>
        </ThemeProvider>
    );
};

export default FormGenerator;
