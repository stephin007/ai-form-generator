import React from 'react';
import { Stepper, Step, StepLabel, Box, Button } from '@mui/material';

const steps = ['Choose Form Type', 'Set Number of Fields', 'Describe Your Form', 'Review and Generate'];

const FormStepper = ({ currentStep, handlePreviousStep, handleNextStep, renderStepContent, handleGenerateForm, isCustom, customFormType, formType, formDescription }) => (
    <>
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
    </>
);

export default FormStepper;
