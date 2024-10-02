// src/App.js
import React, { useState } from 'react';
import {
    Container,
    Typography,
    TextField,
    Button,
    CircularProgress,
    Paper,
    Box,
    InputAdornment,
} from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile'; // Icon for upload button
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer'; // Icon for question input
import './App.css';

function App() {
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState('');
    const [pdfFile, setPdfFile] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleInputChange = (event) => {
        setQuestion(event.target.value);
    };

    const handleFileChange = (event) => {
        setPdfFile(event.target.files[0]);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!pdfFile) {
            setAnswer("Please upload a PDF file.");
            return;
        }

        const formData = new FormData();
        formData.append('question', question);
        formData.append('pdf_file', pdfFile);

        setLoading(true);
        try {
            const response = await fetch('http://localhost:5000/ask', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "An error occurred while fetching the answer.");
            }

            const data = await response.json();
            setAnswer(data.answer);
        } catch (error) {
            console.error("Error fetching answer:", error);
            setAnswer("Sorry, I couldn't fetch the answer. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="md" className="App"> {/* Adjust maxWidth to "md" for 75% filling */}
            <Paper elevation={8} className="card">
                <Typography variant="h4" align="center" gutterBottom>
                    Legal Document Interrogation
                </Typography>
                <Typography variant="body1" align="center" gutterBottom>
                    Ask your question about the legal document you uploaded.
                </Typography>
                <form onSubmit={handleSubmit}>
                    <Box mb={2}>
                        <TextField
                            fullWidth
                            label="Question"
                            variant="outlined"
                            value={question}
                            onChange={handleInputChange}
                            placeholder="Enter your question here..."
                            required
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <QuestionAnswerIcon />
                                    </InputAdornment>
                                ),
                            }}
                            className="input"
                        />
                    </Box>
                    <Box mb={2}>
                        <input
                            accept="application/pdf"
                            style={{ display: 'none' }}
                            id="pdf-file-upload"
                            type="file"
                            onChange={handleFileChange}
                            required
                        />
                        <label htmlFor="pdf-file-upload">
                            <Button variant="contained" component="span" className="upload-button" startIcon={<UploadFileIcon />}>
                                Upload PDF
                            </Button>
                        </label>
                    </Box>
                    <Button type="submit" variant="contained" color="primary" className="submit-button">
                        Ask
                    </Button>
                </form>
                {loading && (
                    <Box display="flex" justifyContent="center" mt={2}>
                        <CircularProgress />
                    </Box>
                )}
                {answer && (
                    <Box mt={4} padding={2} border={1} borderColor="primary.main" borderRadius={1}>
                        <Typography variant="h6">Answer:</Typography>
                        <Typography>{answer}</Typography>
                    </Box>
                )}
            </Paper>
            <footer className="footer">
                <Typography variant="body2">
                    &copy; 2024 Legal Document Interrogation App
                </Typography>
            </footer>
        </Container>
    );
}

export default App;
