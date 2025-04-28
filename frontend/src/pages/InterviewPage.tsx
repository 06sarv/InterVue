import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
  LinearProgress,
  IconButton,
  CircularProgress,
  Fade,
} from '@mui/material';
import { Mic, MicOff, Replay } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { InterviewConfig, Question, generateQuestions, generateFollowUp } from '../services/geminiService';

const InterviewPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const config = location.state?.config as InterviewConfig;
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [timeLeft, setTimeLeft] = useState(config?.timePerQuestion);
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const [followUpAnswer, setFollowUpAnswer] = useState<string>('');
  const [showFollowUp, setShowFollowUp] = useState(false);
  const [showTimesUp, setShowTimesUp] = useState(false);

  // Ref to always have the latest value of showFollowUp in recognition handler
  const showFollowUpRef = useRef(showFollowUp);
  useEffect(() => {
    showFollowUpRef.current = showFollowUp;
  }, [showFollowUp]);

  useEffect(() => {
    if (!config) {
      navigate('/');
      return;
    }

    const loadQuestions = async () => {
      try {
        const generatedQuestions = await generateQuestions(config);
        setQuestions(generatedQuestions);
        setAnswers(new Array(generatedQuestions.length).fill(''));
      } catch (error) {
        console.error('Error loading questions:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadQuestions();
  }, [config, navigate]);

  useEffect(() => {
    if (timeLeft === 0) {
      setShowTimesUp(true);
      setTimeout(() => setShowTimesUp(false), 2000);
      // Force advance to next question or report, regardless of answer
      if (showFollowUp) {
        setShowFollowUp(false);
        setFollowUpAnswer('');
        if (currentQuestionIndex < questions.length - 1) {
          setCurrentQuestionIndex((prev) => prev + 1);
          setTimeLeft(config.timePerQuestion);
        } else {
          navigate('/report', { state: { questions, answers } });
        }
      } else {
        if (currentQuestionIndex < questions.length - 1) {
          setCurrentQuestionIndex((prev) => prev + 1);
          setTimeLeft(config.timePerQuestion);
        } else {
          navigate('/report', { state: { questions, answers } });
        }
      }
    }
  }, [timeLeft]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new (window as any).webkitSpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = Array.from(event.results)
          .map((result) => result[0].transcript)
          .join('');
        if (showFollowUpRef.current) {
          setFollowUpAnswer(transcript);
        } else {
          setAnswers((prev) => {
            const newAnswers = [...prev];
            newAnswers[currentQuestionIndex] = transcript;
            return newAnswers;
          });
        }
      };

      recognitionRef.current = recognition;
    }
  }, [currentQuestionIndex]);

  // When follow-up starts, restart speech recognition for a fresh transcript
  useEffect(() => {
    if (showFollowUp && recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
      setTimeout(() => {
        try {
          recognitionRef.current && recognitionRef.current.start();
        } catch {}
      }, 200); // Small delay to ensure stop/start cycle
    }
  }, [showFollowUp]);

  const handleNext = async () => {
    const currentAnswer = answers[currentQuestionIndex];
    const currentQuestion = questions[currentQuestionIndex];

    // If follow-up is being shown, only proceed if follow-up answer is provided (unless called by timer)
    if (showFollowUp) {
      if (!followUpAnswer.trim()) return; // Don't proceed if follow-up answer is empty (unless timer triggers)
      setShowFollowUp(false);
      setFollowUpAnswer('');
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex((prev) => prev + 1);
        setTimeLeft(config.timePerQuestion);
      } else {
        navigate('/report', { state: { questions, answers } });
      }
      return;
    }

    if (currentAnswer) {
      const followUp = await generateFollowUp(
        currentQuestion.text,
        currentAnswer
      );
      if (followUp) {
        setQuestions((prev) => {
          const newQuestions = [...prev];
          newQuestions[currentQuestionIndex].followUp = followUp;
          return newQuestions;
        });
        setShowFollowUp(true);
        return; // Wait for follow-up answer before proceeding
      }
    }
    // No follow-up, move to next question
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setTimeLeft(config.timePerQuestion);
    } else {
      navigate('/report', { state: { questions, answers } });
    }
  };

  const handleRetry = () => {
    if (showFollowUp) {
      setFollowUpAnswer('');
      // Do not reset timer or main answer
    } else {
      setTimeLeft(config.timePerQuestion);
      setAnswers((prev) => {
        const newAnswers = [...prev];
        newAnswers[currentQuestionIndex] = '';
        return newAnswers;
      });
    }
  };

  const toggleRecording = () => {
    if (recognitionRef.current) {
      if (isRecording) {
        recognitionRef.current.stop();
      } else {
        recognitionRef.current.start();
      }
      setIsRecording(!isRecording);
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

  if (!questions || questions.length === 0 || currentQuestionIndex >= questions.length) {
    return (
      <Container maxWidth="sm">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
          <Typography variant="h6">Loading questions...</Typography>
        </Box>
      </Container>
    );
  }

  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <Container maxWidth="sm">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Paper elevation={3} sx={{ p: 4, mt: 8 }}>
          <Box sx={{ mb: 4 }}>
            <LinearProgress variant="determinate" value={progress} sx={{ mb: 2 }} />
            <Typography variant="body2" color="text.secondary" align="right">
              Question {currentQuestionIndex + 1} of {questions.length}
            </Typography>
          </Box>

          <Typography variant="h5" gutterBottom>
            {questions[currentQuestionIndex].text}
          </Typography>

          {questions[currentQuestionIndex].followUp && (
            <Typography variant="body1" color="primary" sx={{ mt: 2, mb: 2 }}>
              Follow-up: {questions[currentQuestionIndex].followUp}
            </Typography>
          )}

          <Box sx={{ mt: 4, mb: 4 }}>
            <TextField
              fullWidth
              multiline
              rows={4}
              value={answers[currentQuestionIndex]}
              onChange={(e) => {
                setAnswers((prev) => {
                  const newAnswers = [...prev];
                  newAnswers[currentQuestionIndex] = e.target.value;
                  return newAnswers;
                });
              }}
              placeholder="Type your answer here..."
              disabled={showFollowUp}
              onKeyDown={(e) => {
                if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                  handleNext();
                }
              }}
            />
            {questions[currentQuestionIndex].followUp && showFollowUp && (
              <TextField
                fullWidth
                multiline
                rows={3}
                value={followUpAnswer}
                onChange={(e) => setFollowUpAnswer(e.target.value)}
                placeholder="Type your answer to the follow-up here..."
                sx={{ mt: 2 }}
                onKeyDown={(e) => {
                  if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                    handleNext();
                  }
                }}
              />
            )}
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <Fade in={showTimesUp} timeout={{ enter: 400, exit: 400 }}>
              <Typography variant="subtitle1" color="error" sx={{ mb: 1 }}>
                Time's up! Answer submitted.
              </Typography>
            </Fade>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
              <Typography variant="h6">
                {minutes}:{seconds.toString().padStart(2, '0')}
              </Typography>

              <Box>
                <IconButton onClick={toggleRecording} color={isRecording ? 'error' : 'default'}>
                  {isRecording ? <MicOff /> : <Mic />}
                </IconButton>
                <IconButton onClick={handleRetry}>
                  <Replay />
                </IconButton>
              </Box>
            </Box>
          </Box>

          <Button
            variant="contained"
            fullWidth
            onClick={handleNext}
            sx={{ mt: 4 }}
            disabled={
              (!answers[currentQuestionIndex] && !showFollowUp) ||
              (showFollowUp && !followUpAnswer.trim())
            }
          >
            {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Finish Interview'}
          </Button>
        </Paper>
      </motion.div>
    </Container>
  );
};

export default InterviewPage; 