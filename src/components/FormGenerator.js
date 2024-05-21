"use client";

import React, { useState } from 'react';
import axios from 'axios';
import styles from '../styles/FormGenerator.module.css';

const FormGenerator = () => {
    const [prompt, setPrompt] = useState('');
    const [numFields, setNumFields] = useState(5); // Default number of fields
    const [formSchema, setFormSchema] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [loadingText, setLoadingText] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({});

    const handleGenerateForm = async () => {
        setLoading(true);
        setLoadingText(getRandomLoadingText());
        const openaiApiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;

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
                            content : `Generate a JSON schema for a form with ${numFields} fields based on the following description: ${prompt}the questions in the form should be meaningful and should not contain the words question 1, question 2, etc. You can include fields like name, email, phone number, address, etc. The form should be easy to fill out.`
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
                    setError('Looks like you did not enter a valid form description. Please try again.');
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
            'Loading...',
            'Fetching data...',
            'Hold on, I\'m thinking...',
            'Just a moment...',
            'Working on it...',
            'One moment please...',
            'Almost there...',
            'Getting the data...',
            'Just a sec...',
        ];
        return loadingTexts[Math.floor(Math.random() * loadingTexts.length)];
    };

    const handleNumFieldsChange = (e) => {
        const value = parseInt(e.target.value);
        setNumFields(value);
    };


const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
        ...formData,
        [name]: value
    });
    console.log(formData);
};

    const renderForm = () => {
        if (!formSchema || !formSchema.properties) {
            return null;
        }

        const fieldsToShow = Object.keys(formSchema.properties).slice(0, numFields);

        return fieldsToShow.map((key, index) => {
            const field = formSchema.properties[key];
            const isRequired = formSchema.required.includes(key);

            switch (field.type) {
                case 'string':
                    if (field.format === 'email') {
                        return (
                            <div key={index} className={styles.formField}>
                                <label>{field.title}</label>
                                <input type="email" name={key} required={isRequired} minLength={field.minLength} maxLength={field.maxLength} onChange={handleChange} />
                            </div>
                        );
                    }
                    return (
                        <div key={index} className={styles.formField}>
                            <label>{field.title}</label>
                            <input type="text" name={key} required={isRequired} minLength={field.minLength} maxLength={field.maxLength} onChange={handleChange}/>
                        </div>
                    );
                case 'number':
                case 'integer':
                    return (
                        <div key={index} className={styles.formField}>
                            <label>{field.title}</label>
                            <input type="number" name={key} required={isRequired} min={field.minimum} max={field.maximum} onChange={handleChange}/>
                        </div>
                    );
                case 'boolean':
                    return (
                        <div key={index} className={styles.formField}>
                            <label>{field.title}</label>
                            <div className={styles.radioGroup}>
                                <label>
                                    <input type="radio" name={key} value="yes" onChange={handleChange} /> Yes
                                </label>
                                <label>
                                    <input type="radio" name={key} value="no" onChange={handleChange}/> No
                                </label>
                            </div>
                        </div>
                    );
                default:
                    return null;
            }
        });
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>AI Form Generator</h1>
            <div style={{width: "100%"}}>
            <textarea
                className={styles.textarea}
                value={prompt}
                onChange={e => setPrompt(e.target.value)}
                placeholder="Enter form description"
            ></textarea>
            </div>
            
            <div className={styles.inputContainer}>
                <label className={styles.label}>
                    Number of Fields:
                    <input
                        type="number"
                        value={numFields}
                        onChange={handleNumFieldsChange}
                        min={1}
                        max={numFields || 10}
                    />
                </label>
                <button className={styles.button} onClick={handleGenerateForm}>Generate Form</button>
            </div>
            {loading && <p className={styles.loading}>{loadingText}</p>}
            {error && <p className={styles.error}>{error}</p>}
            {formSchema && <form className={styles.form}>{renderForm()}</form>}
        </div>
    );
};

export default FormGenerator;
