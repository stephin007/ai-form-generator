"use client";

import React, { useState } from 'react';
import axios from 'axios';
import styles from './FormGenerator.module.css';

const loadingTexts = [
    'Amazing things take time...',
    'Generating form...',
    'Just a moment...',
    'Thinking...',
    'Hold on...',
    'Almost there...',
    'Creating form...',
    'Processing...',
    'Just a sec...',
    'Loading...'
];

const FormGenerator = () => {
    const [prompt, setPrompt] = useState('');
    const [numFields, setNumFields] = useState(5);
    const [formSchema, setFormSchema] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [loadingText, setLoadingText] = useState("");

    const handleGenerateForm = async () => {
        setLoading(true);
        setLoadingText(loadingTexts[Math.floor(Math.random() * loadingTexts.length)]);
        const openaiApiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;

        try {
            const response = await axios.post(
                'https://api.openai.com/v1/chat/completions',
                {
                    model: 'gpt-3.5-turbo',
                    temperature: 0,
                    messages: [
                        {
                            role: 'system',
                            content: 'You are a helpful assistant that generates JSON schemas for forms.'
                        },
                        {
                            role: 'user',
                            content : `Generate a JSON schema for a form with ${numFields} fields based on the following description: ${prompt}`
                        }
                    ]
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
    const handleNumFieldsChange = (e) => {
        const value = parseInt(e.target.value);
            setNumFields(value);
    }

    const renderForm = () => {
        if (!formSchema || !formSchema.properties) {
            return null;
        }

        return Object.keys(formSchema.properties).map((key, index) => {
            const field = formSchema.properties[key];
            const isRequired = formSchema.required.includes(key);

            switch (field.type) {
                case 'string':
                    if (field.format === 'email') {
                        return (
                            <div key={index} className={styles.formField}>
                                <label>{field.title}</label>
                                <input type="email" name={key} required={isRequired} minLength={field.minLength} maxLength={field.maxLength} />
                            </div>
                        );
                    }
                    return (
                        <div key={index} className={styles.formField}>
                            <label>{field.title}</label>
                            <input type="text" name={key} required={isRequired} minLength={field.minLength} maxLength={field.maxLength} />
                        </div>
                    );
                case 'number':
                    case 'integer':
                    return (
                        <div key={index} className={styles.formField}>
                            <label>{field.title}</label>
                            <input type="number" name={key} required={isRequired} min={field.minimum} max={field.maximum} />
                        </div>
                    );
                case 'boolean':
                    return (
                        <div key={index} className={styles.formField}>
                            <label>{field.title}</label>
                            <input type="checkbox" name={key} required={isRequired} defaultChecked={false}/>
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
            <textarea
                className={styles.textarea}
                value={prompt}
                onChange={e => setPrompt(e.target.value)}
                placeholder="Enter form description"
            ></textarea>
            <div className={styles.inputContainer}>
                <label className={styles.label}>
                    Number of fields:
                    <input
                        type="number"
                        value={numFields}
                        onChange={handleNumFieldsChange}
                        min={1}
                        max={Object.keys(formSchema?.properties || {}).length || 10}
                        className={styles.inputNumber}
                    />
                </label>
                <button className={styles.button} onClick={handleGenerateForm}>Generate Form</button>
            </div>
            
            {loading && <p className={styles.loading}>{loadingText}</p>}
            {error && <p className={styles.error}>{error}</p>}
            {formSchema && (
                <form className={styles.form}>
                    {renderForm()}
                </form>
            )}
        </div>
    );
};

export default FormGenerator;
