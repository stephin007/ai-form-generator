"use client";

import React, { useState } from 'react';
import axios from 'axios';
import styles from '../styles/FormGenerator.module.css';

const FormGenerator = () => {
    const [currentStep, setCurrentStep] = useState(1);
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

        const prompt = `
            Generate a JSON schema for a ${formType} form with ${numFields} fields.
            Form Description: ${formDescription}.
            The questions in the form should be meaningful and should not contain the words question 1, question 2, etc.
            The form should be easy to fill out.
        `;

        try {
            const response = await axios.post(
                'https://api.openai.com/v1/chat/completions',
                {
                    model: 'gpt-3.5-turbo',
                    messages: [
                        {
                            role: 'system',
                            content: 'You are a helpful assistant that generates JSON schemas for forms.'
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
                    setError('Invalid form description. Please try again.');
                }
            } else {
                setError('Invalid response from OpenAI');
            }
        } catch (error) {
            console.error('Error generating form:', error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const getRandomLoadingText = () => {
        const loadingTexts = [
            'Generating your form...',
            'Creating form fields...',
            'Almost ready...',
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
    }

    const renderForm = () => {
        if (!formSchema || !formSchema.properties) {
            return null;
        }

        return (
            <form className={styles.form} >
                <div className={styles.gridContainer}>
                    {Object.keys(formSchema.properties).map((key, index) => {
                        const field = formSchema.properties[key];
                        const isRequired = formSchema.required.includes(key);

                        switch (field.type) {
                            case 'string':
                                if (field.format === 'email') {
                                    return (
                                        <div key={index} className={styles.formField}>
                                            <label>{field.title}</label>
                                            <input type="email" name={key} required={isRequired} minLength={field.minLength} maxLength={field.maxLength} onChange={handleChange} className={styles.input} />
                                        </div>
                                    );
                                }
                                return (
                                    <div key={index} className={styles.formField}>
                                        <label>{field.title}</label>
                                        <input type="text" name={key} required={isRequired} minLength={field.minLength} maxLength={field.maxLength} onChange={handleChange} className={styles.input} />
                                    </div>
                                );
                            case 'number':
                            case 'integer':
                                return (
                                    <div key={index} className={styles.formField}>
                                        <label>{field.title}</label>
                                        <input type="number" name={key} required={isRequired} min={field.minimum} max={field.maximum} onChange={handleChange} className={styles.input} />
                                    </div>
                                );
                            case 'boolean':
                                return (
                                    <div key={index} className={styles.formField}>
                                        <label>{field.title}</label>
                                        <div className={styles.radioGroup}>
                                            <label>
                                                <input type="radio" name={key} value="true" onChange={handleChange} /> Yes
                                            </label>
                                            <label>
                                                <input type="radio" name={key} value="false" onChange={handleChange} /> No
                                            </label>
                                        </div>
                                    </div>
                                );
                            default:
                                return null;
                        }
                    })}
                </div>
                <button type="submit" className={styles.exportButton} onClick={exportToCSV}>Export to CSV</button>
            </form>
        );
    };

    const renderStep = () => {
        switch (currentStep) {
            case 1:
                return (
                    <div>
                        <h2>Step 1: Select Form Type</h2>
                        <input
                            type="text"
                            value={formType}
                            onChange={(e) => setFormType(e.target.value)}
                            placeholder="Enter the type of form (e.g., Registration, Feedback)"
                            className={styles.input}
                        />
                        <button className={`${styles.button} ${!formType ? styles.disabledButton : ''}`}
                                onClick={handleNextStep}
                                disabled={!formType}>Next</button>
                    </div>
                );
            case 2:
                return (
                    <div>
                        <h2>Step 2: Number of Fields</h2>
                        <input
                            type="number"
                            value={numFields}
                            onChange={(e) => setNumFields(e.target.value)}
                            min={1}
                            max={20}
                            className={styles.input}
                        />
                        <button className={styles.button} onClick={handlePreviousStep}>Previous</button>
                        <button className={styles.button} onClick={handleNextStep}>Next</button>
                    </div>
                );
            case 3:
                return (
                    <div>
                        <h2>Step 3: Form Description</h2>
                        <textarea
                            value={formDescription}
                            onChange={(e) => setFormDescription(e.target.value)}
                            placeholder="Enter a description of the form's purpose or the type of questions (e.g., Collecting user feedback on a new product)"
                            className={styles.textarea}
                        ></textarea>
                        <button className={styles.button} onClick={handlePreviousStep}>Previous</button>
                        <button className={`${styles.button} ${!formDescription ? styles.disabledButton : ''}`}
                                onClick={handleNextStep}
                                disabled={!formDescription}>Next</button>
                    </div>
                );
            case 4:
                return (
                    <div>
                        <h2>Step 4: Confirm and Generate</h2>
                        <p><strong>Form Type:</strong> {formType}</p>
                        <p><strong>Number of Fields:</strong> {numFields}</p>
                        <p><strong>Form Description:</strong> {formDescription}</p>
                        <button className={styles.button} onClick={handlePreviousStep}>Previous</button>
                        <button className={styles.button} onClick={handleGenerateForm}>Generate Form</button>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>AI Form Generator</h1>
            {loading && <p className={styles.loading}>{loadingText}</p>}
            {error && <p className={styles.error}>{error}</p>}
            {!loading && renderStep()}
            {currentStep === 4 && formSchema && (
                <div className={styles.formContainer}>
                    {renderForm()}
                </div>
            )}
        </div>
    );
};

export default FormGenerator;
