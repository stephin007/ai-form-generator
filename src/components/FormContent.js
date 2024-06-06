import React from 'react';
import { Box, FormControl, InputLabel, Select, MenuItem, TextField } from '@mui/material';

const predefinedFormTypes = [
    'Registration', 'Feedback', 'Survey', 'Application', 'Contact Us', 'Order Form',
    'Subscription', 'Login', 'Job Application', 'Event RSVP', 'Product Review',
    'Support Ticket', 'Newsletter Signup', 'Poll', 'Appointment Booking', 'User Profile', 'Contest Entry',
];

const FormContent = ({ currentStep, formType, isCustom, handleFormTypeChange, customFormType, setCustomFormType, numFields, setNumFields, formDescription, setFormDescription }) => {
    switch (currentStep) {
        case 0:
            return (
                <Box>
                    <FormControl fullWidth margin="normal" variant="outlined">
                        <InputLabel>Form Type</InputLabel>
                        <Select value={isCustom ? 'custom' : formType} onChange={handleFormTypeChange} label="Form Type">
                            <MenuItem value="custom">Add New</MenuItem>
                            {predefinedFormTypes.map((type) => (
                                <MenuItem key={type} value={type}>{type}</MenuItem>
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
                        placeholder="Enter a description of the form's purpose or the type of questions"
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
                    <Typography><strong>Form Type:</strong> {formType || customFormType}</Typography>
                    <Typography><strong>Number of Fields:</strong> {numFields}</Typography>
                    <Typography><strong>Form Description:</strong> {formDescription}</Typography>
                </Box>
            );
        default:
            return null;
    }
};

export default FormContent;
