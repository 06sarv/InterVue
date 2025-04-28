import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Typography,
  Paper,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Divider,
  Chip,
} from '@mui/material';
import { motion } from 'framer-motion';
import html2pdf from 'html2pdf.js';
import { Question, Evaluation, evaluateInterview } from '../services/geminiService';

const ReportPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { questions, answers } = location.state as { questions: Question[]; answers: string[] };
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const reportRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!questions || !answers) {
      navigate('/');
      return;
    }

    const loadEvaluation = async () => {
      try {
        const result = await evaluateInterview(questions, answers);
        setEvaluations(result);
      } catch (error) {
        console.error('Error loading evaluation:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadEvaluation();
  }, [questions, answers, navigate]);

  const handleDownload = () => {
    if (reportRef.current) {
      const element = reportRef.current;
      const opt = {
        margin: 1,
        filename: 'interview-report.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
      };

      html2pdf().set(opt).from(element).save();
    }
  };

  if (isLoading) {
    return (
      <Container maxWidth="sm">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Paper elevation={3} sx={{ p: 4, mt: 8 }} ref={reportRef} className="pdf-report">
          <Typography variant="h4" component="h1" gutterBottom align="center">
            Interview Report
          </Typography>

          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom>
              Question & Answer Analysis
            </Typography>
            <List>
              {questions.map((question, index) => (
                <React.Fragment key={index}>
                  <ListItem alignItems="flex-start">
                    <ListItemText
                      primary={`Q${index + 1}: ${question.text}`}
                      secondary={
                        <>
                          <Typography variant="body2" color="text.secondary">
                            <strong>Your Answer:</strong> {answers[index]}
                          </Typography>
                          {question.followUp && (
                            <Typography variant="body2" color="primary">
                              <strong>Follow-up:</strong> {question.followUp}
                            </Typography>
                          )}
                          {evaluations[index] && (
                            <Box sx={{ mt: 1 }}>
                              <Chip
                                label={evaluations[index].sentiment}
                                color={
                                  evaluations[index].sentiment === 'Positive'
                                    ? 'success'
                                    : evaluations[index].sentiment === 'Negative'
                                    ? 'error'
                                    : 'warning'
                                }
                                sx={{ mr: 1 }}
                              />
                              <Typography variant="body2" display="inline">
                                <strong>Score:</strong> {evaluations[index].score}/10
                              </Typography>
                              <Typography variant="body2" sx={{ mt: 1 }}>
                                <strong>Strengths:</strong> {evaluations[index].strengths.join(', ')}
                              </Typography>
                              <Typography variant="body2" sx={{ mt: 1 }}>
                                <strong>Suggestions:</strong> {evaluations[index].suggestions.join(', ')}
                              </Typography>
                              <Typography variant="body2" sx={{ mt: 1 }}>
                                <strong>Sample Answer:</strong> {evaluations[index].sampleAnswer}
                              </Typography>
                            </Box>
                          )}
                        </>
                      }
                    />
                  </ListItem>
                  {index < questions.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </Box>

          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', gap: 2 }}>
            <Button
              variant="contained"
              onClick={handleDownload}
              sx={{ minWidth: 200 }}
            >
              Download Report
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate('/')}
              sx={{ minWidth: 200 }}
            >
              Start New Interview
            </Button>
          </Box>
        </Paper>
      </motion.div>
    </Container>
  );
};

export default ReportPage; 