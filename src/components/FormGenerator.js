"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Typography,
  Container,
  Box,
  Grid,
  Paper,
  ThemeProvider,
  CssBaseline,
  Modal,
  TextField,
  Button,
} from "@mui/material";
import Header from "./Header";
import FormStepper from "./FormStepper";
import FormContent from "./FormContent";
import FormPreview from "./FormPreview";
import TemplatesList from "./TemplatesList";
import theme from "../styles/themes";
import { useAuth } from "../../AuthContext";
import {
  getUserApiCallCount,
  incrementApiCallCount,
} from "../../firebaseConfig";

const FormGenerator = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formType, setFormType] = useState("");
  const [numFields, setNumFields] = useState(5);
  const [formDescription, setFormDescription] = useState("");
  const [formSchema, setFormSchema] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [loadingText, setLoadingText] = useState("");
  const [formData, setFormData] = useState({});
  const [customFormType, setCustomFormType] = useState("");
  const [isCustom, setIsCustom] = useState(false);
  const {
    user,
    feedback,
    setFeedback,
    success,
    setSuccess,
    apiCallCount,
    setApiCallCount,
    openModal,
    setOpenModal,
    handleModalClose,
    handleFeedback,
  } = useAuth();

  useEffect(() => {
    const fetchApiCallCount = async () => {
      if (user) {
        const count = await getUserApiCallCount(user.uid);
        setApiCallCount(count);
      }
    };

    fetchApiCallCount();
  }, [user]);

  useEffect(() => {
    if (apiCallCount >= 5) {
      setOpenModal(true);
    }
  }, [apiCallCount]);

  const handleFormTypeChange = (e) => {
    const value = e.target.value;
    if (value === "custom") {
      setIsCustom(true);
      setFormType("");
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
    if (apiCallCount >= 5) {
      setOpenModal(true);
      return;
    }
    setLoading(true);
    setLoadingText(getRandomLoadingText());
    const openaiApiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;

    if (!openaiApiKey) {
      setError("OpenAI API key is missing. Please set the API key.");
      setLoading(false);
      return;
    }

    const formTypeToUse = selectedTemplate
      ? selectedTemplate.formType
      : formType || customFormType;
    const numFieldsToUse = selectedTemplate
      ? selectedTemplate.numFields
      : numFields;
    const formDescriptionToUse = selectedTemplate
      ? selectedTemplate.formDescription
      : formDescription;

    const prompt = `
            Create a JSON schema for a ${formTypeToUse} form with ${numFieldsToUse} fields.
            Form Description: ${formDescriptionToUse}.
            The questions should be meaningful and not contain placeholders like question 1, question 2, etc.
            The form should be user-friendly.
        `;

    try {
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content:
                "You are an assistant that generates user-friendly JSON schemas for forms.",
            },
            {
              role: "user",
              content: prompt,
            },
          ],
          temperature: 0,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${openaiApiKey}`,
          },
        }
      );

      if (response.data.choices && response.data.choices.length > 0) {
        try {
          const formSchema = JSON.parse(
            response.data.choices[0].message.content.trim()
          );
          setFormSchema(formSchema);
          setError(null);
          setSuccess("Form generated successfully!");
          const newCount = await incrementApiCallCount(user.uid, user.email);
          setApiCallCount(newCount.apiCallCount);
        } catch (jsonError) {
          setError("The generated JSON is malformed. Please Try Again.");
        }
      } else {
        setError("Did not receive a valid response from OpenAI.");
      }
    } catch (error) {
      console.error("Error generating form:", error);
      setError(
        "Failed to generate form. Please check the console for more details."
      );
    } finally {
      setLoading(false);
    }
  };

  const getRandomLoadingText = () => {
    const loadingTexts = [
      "Building your form...",
      "Almost there...",
      "Just a moment...",
      "Hang tight, preparing your form...",
      "Formifying your form...",
      "Formifying AI at work...",
      "Formifying your thoughts...",
      "Formifying your ideas...",
      "Formifying your imagination...",
      "Formifying your creativity...",
      "Formifying your vision...",
      "Formifying your dreams...",
      "Formifying your aspirations...",
      "Formifying your goals...",
      "Formifying your desires...",
      "Formifying your wishes...",
      "Formifying your requests...",
      "Formifying your requirements...",
      "Formifying your needs...",
      "Formifying your expectations...",
    ];
    return loadingTexts[Math.floor(Math.random() * loadingTexts.length)];
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

  const exportToCSV = () => {
    const csvRows = [
      [
        "Field Name",
        "Type",
        "Title",
        "Min Length",
        "Max Length",
        "Minimum",
        "Maximum",
      ],
      ...Object.keys(formSchema.properties).map((key) => {
        const field = formSchema.properties[key];
        return [
          key,
          field.type,
          field.title,
          field.minLength,
          field.maxLength,
          field.minimum,
          field.maximum,
        ];
      }),
    ];
    const csv = csvRows.map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "form-data.csv";
    a.click();
  };

  const templates = [
    {
      formType: "Registration",
      numFields: 5,
      formDescription: "User registration form for a new website",
    },
    {
      formType: "Feedback",
      numFields: 4,
      formDescription: "Feedback form to gather user opinions on a product",
    },
    {
      formType: "Survey",
      numFields: 10,
      formDescription: "Survey form to collect data on user preferences",
    },
    {
      formType: "Application",
      numFields: 8,
      formDescription: "Application form for a job or program",
    },
    {
      formType: "Contact Us",
      numFields: 6,
      formDescription: "Contact form for users to reach out to support",
    },
    {
      formType: "Order Form",
      numFields: 7,
      formDescription: "Order form for purchasing products or services",
    },
    {
      formType: "Subscription",
      numFields: 5,
      formDescription: "Subscription form for users to sign up for updates",
    },
    {
      formType: "Login",
      numFields: 2,
      formDescription: "Login form for users to access their accounts",
    },
    {
      formType: "Job Application",
      numFields: 9,
      formDescription: "Job application form for candidates to apply",
    },
    {
      formType: "Event RSVP",
      numFields: 3,
      formDescription:
        "Event RSVP form for attendees to confirm their presence",
    },
    {
      formType: "Product Review",
      numFields: 6,
      formDescription: "Product review form for users to share feedback",
    },
    {
      formType: "Support Ticket",
      numFields: 5,
      formDescription: "Support ticket form for users to report issues",
    },
    {
      formType: "Newsletter Signup",
      numFields: 3,
      formDescription: "Newsletter signup form for users to subscribe",
    },
    {
      formType: "Poll",
      numFields: 4,
      formDescription: "Poll form to gather opinions on a specific topic",
    },
    {
      formType: "Appointment Booking",
      numFields: 6,
      formDescription: "Appointment booking form for scheduling meetings",
    },
    {
      formType: "User Profile",
      numFields: 7,
      formDescription: "User profile form for updating personal information",
    },
    {
      formType: "Contest Entry",
      numFields: 5,
      formDescription: "Contest entry form for participating in a competition",
    },
  ];

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box display="flex" flexDirection="column" minHeight="100vh">
        <Header apiCallCount={apiCallCount} />
        <Container maxWidth="lg" style={{ display: "flex", marginTop: "80px" }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Paper elevation={3} style={{ padding: "24px" }}>
                <Typography variant="h5" gutterBottom>
                  Follow the Steps
                </Typography>
                <FormStepper
                  currentStep={currentStep}
                  handlePreviousStep={handlePreviousStep}
                  handleNextStep={handleNextStep}
                  renderStepContent={(step) => (
                    <FormContent
                      currentStep={step}
                      formType={formType}
                      isCustom={isCustom}
                      handleFormTypeChange={handleFormTypeChange}
                      customFormType={customFormType}
                      setCustomFormType={setCustomFormType}
                      numFields={numFields}
                      setNumFields={setNumFields}
                      formDescription={formDescription}
                      setFormDescription={setFormDescription}
                    />
                  )}
                  handleGenerateForm={handleGenerateForm}
                  isCustom={isCustom}
                  customFormType={customFormType}
                  formType={formType}
                  formDescription={formDescription}
                />
              </Paper>
              <TemplatesList
                currentStep={currentStep}
                templates={templates}
                handleGenerateForm={handleGenerateForm}
                handleEditTemplate={({
                  formType,
                  numFields,
                  formDescription,
                }) => {
                  setFormType(formType);
                  setNumFields(numFields);
                  setFormDescription(formDescription);
                  setIsCustom(false);
                  setCurrentStep(0);
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormPreview
                loading={loading}
                loadingText={loadingText}
                success={success}
                error={error}
                setSuccess={setSuccess}
                setError={setError}
                formSchema={formSchema}
                handleChange={handleChange}
                handleSubmit={handleSubmit}
                exportToCSV={exportToCSV}
              />
            </Grid>
          </Grid>
        </Container>
        <Modal
          open={openModal}
          onClose={handleModalClose}
          aria-labelledby="feedback-modal-title"
          aria-describedby="feedback-modal-description"
        >
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              bgcolor: "background.paper",
              boxShadow: 24,
              p: 4,
              borderRadius: 2,
              maxWidth: 400,
              textAlign: "center",
            }}
          >
            <Typography id="feedback-modal-title" variant="h6" component="h2">
              Feedback Request
            </Typography>
            <Typography id="feedback-modal-description" sx={{ mt: 2 }}>
              You have reached the limit of 5 form generations. Would you
              consider buying this product for your company or personal use?
            </Typography>
            <TextField
              margin="normal"
              fullWidth
              multiline
              rows={4}
              placeholder="Your feedback..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleFeedback}
              style={{ marginTop: "16px" }}
            >
              Submit Feedback
            </Button>
          </Box>
        </Modal>
      </Box>
    </ThemeProvider>
  );
};

export default FormGenerator;
