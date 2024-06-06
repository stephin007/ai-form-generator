import React, { useState } from 'react';
import { Box, Typography, TextField, Grid, Paper, Button, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import UseTemplateIcon from '@mui/icons-material/LibraryAdd';

const TemplatesList = ({ currentStep, templates, handleGenerateForm, handleEditTemplate }) => {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredTemplates = templates.filter(template =>
        template.formType.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (currentStep !== 0) {
        return null;
    }

    return (
        <Box mt={3} style={{ overflowY: 'scroll', maxHeight: '400px' }}>
            <Typography variant="h5" style={{ position: 'sticky', top: 0, backgroundColor: 'white', padding: "10px", zIndex: 1 }}>
                Need Help? Use a Template
            </Typography>
            <TextField
                style={{ position: 'sticky', top: 50, backgroundColor: 'white', zIndex: 1 }}
                label="Search Templates"
                variant="filled"
                fullWidth
                margin="normal"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <SearchIcon />
                        </InputAdornment>
                    ),
                }}
            />
            <Grid container spacing={2}>
                {filteredTemplates.length > 0 ? (
                    filteredTemplates.map((template, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                            <Paper elevation={2} style={{ padding: '10px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                <div>
                                    <Typography variant="h6">{template.formType} Template</Typography>
                                    <Typography variant="body2"><strong>Number of Fields:</strong> {template.numFields}</Typography>
                                    <Typography variant="body2"><strong>Description:</strong> {template.formDescription}</Typography>
                                </div>
                                <Box display="flex" flexDirection="column" height="80px" justifyContent="space-between" mt={2}>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        startIcon={<UseTemplateIcon />}
                                        onClick={() => handleGenerateForm(template)}
                                    >
                                        Use
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        color="secondary"
                                        startIcon={<EditIcon />}
                                        onClick={() => handleEditTemplate(template)}
                                    >
                                        Edit
                                    </Button>
                                </Box>
                            </Paper>
                        </Grid>
                    ))
                ) : (
                    <Typography variant="body1" color="textSecondary" style={{ margin: '16px', textAlign: "center", width: "100%" }}>
                        Hmm... looks like your ask is a bit more unique, try adding manually.
                    </Typography>
                )}
            </Grid>
        </Box>
    );
};

export default TemplatesList;
