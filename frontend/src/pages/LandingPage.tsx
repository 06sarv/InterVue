import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  Paper,
  IconButton,
  InputAdornment,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import { Add, Remove } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { InterviewConfig } from '../services/geminiService';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [jobRole, setJobRole] = useState('');
  const [interviewType, setInterviewType] = useState<'HR' | 'Technical'>('Technical');
  const [numQuestions, setNumQuestions] = useState(3);
  const [timeMinutes, setTimeMinutes] = useState(2);
  const [timeSeconds, setTimeSeconds] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const config: InterviewConfig = {
      jobRole,
      interviewType,
      numQuestions,
      timePerQuestion: timeMinutes * 60 + timeSeconds,
    };
    navigate('/interview', { state: { config } });
  };

  return (
    <Container maxWidth="sm">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Paper elevation={3} sx={{ p: 4, mt: 8 }}>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 4 }}>
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1.3rem', mb: 1 }}>
                Job Role*
              </Typography>
              <TextField
                fullWidth
                value={jobRole}
                onChange={(e) => setJobRole(e.target.value)}
                margin="normal"
                required
                label=""
              />
            </Box>

            <Box sx={{ mt: 2, mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1.3rem', mb: 1 }}>
                Interview Type
              </Typography>
              <ToggleButtonGroup
                value={interviewType}
                exclusive
                onChange={(_e, value) => {
                  if (value) setInterviewType(value);
                }}
                aria-label="interview type"
                sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}
              >
                <ToggleButton value="HR" aria-label="HR" sx={{ flex: 1 }}>
                  HR
                </ToggleButton>
                <ToggleButton value="Technical" aria-label="Technical" sx={{ flex: 1 }}>
                  Technical
                </ToggleButton>
              </ToggleButtonGroup>
            </Box>

            <Box sx={{ mt: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1.3rem', mb: 1 }}>
                Number of Questions*
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', pt: 2 }}>
                <TextField
                  label=""
                  type="text"
                  inputProps={{ min: 1, max: 5, style: { fontSize: '2rem', height: '3.5rem', textAlign: 'center' }, inputMode: 'numeric', pattern: '[0-9]*' }}
                  InputLabelProps={{ style: { fontSize: '1.3rem' } }}
                  value={numQuestions}
                  onChange={(e) => setNumQuestions(Math.max(1, Math.min(5, Number(e.target.value))))}
                  fullWidth
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <IconButton
                          onClick={() => setNumQuestions((prev) => Math.max(1, prev - 1))}
                          size="small"
                          aria-label="decrease number of questions"
                          sx={{ background: 'none', borderRadius: 0, fontSize: '1.2rem', p: 0.1 }}
                        >
                          <Remove fontSize="inherit" />
                        </IconButton>
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setNumQuestions((prev) => Math.min(5, prev + 1))}
                          size="small"
                          aria-label="increase number of questions"
                          sx={{ background: 'none', borderRadius: 0, fontSize: '1.2rem', p: 0.1 }}
                        >
                          <Add fontSize="inherit" />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>
            </Box>
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1.3rem', mb: 1 }}>
                Time per Question (min, sec)*
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', pt: 2 }}>
                <TextField
                  label=""
                  type="text"
                  inputProps={{ min: 0, max: 59, style: { fontSize: '2rem', height: '3.5rem', textAlign: 'center' }, inputMode: 'numeric', pattern: '[0-9]*' }}
                  InputLabelProps={{ style: { fontSize: '1.3rem' } }}
                  value={timeMinutes}
                  onChange={(e) => setTimeMinutes(Math.max(0, Math.min(59, Number(e.target.value))))}
                  fullWidth
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <IconButton
                          onClick={() => setTimeMinutes((prev) => Math.max(0, prev - 1))}
                          size="small"
                          aria-label="decrease minutes"
                          sx={{ background: 'none', borderRadius: 0, fontSize: '1.2rem', p: 0.1 }}
                        >
                          <Remove fontSize="inherit" />
                        </IconButton>
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setTimeMinutes((prev) => Math.min(59, prev + 1))}
                          size="small"
                          aria-label="increase minutes"
                          sx={{ background: 'none', borderRadius: 0, fontSize: '1.2rem', p: 0.1 }}
                        >
                          <Add fontSize="inherit" />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  label=""
                  type="text"
                  inputProps={{ min: 0, max: 59, style: { fontSize: '2rem', height: '3.5rem', textAlign: 'center' }, inputMode: 'numeric', pattern: '[0-9]*' }}
                  InputLabelProps={{ style: { fontSize: '1.3rem' } }}
                  value={timeSeconds}
                  onChange={(e) => setTimeSeconds(Math.max(0, Math.min(59, Number(e.target.value))))}
                  fullWidth
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <IconButton
                          onClick={() => setTimeSeconds((prev) => Math.max(0, prev - 1))}
                          size="small"
                          aria-label="decrease seconds"
                          sx={{ background: 'none', borderRadius: 0, fontSize: '1.2rem', p: 0.1 }}
                        >
                          <Remove fontSize="inherit" />
                        </IconButton>
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setTimeSeconds((prev) => Math.min(59, prev + 1))}
                          size="small"
                          aria-label="increase seconds"
                          sx={{ background: 'none', borderRadius: 0, fontSize: '1.2rem', p: 0.1 }}
                        >
                          <Add fontSize="inherit" />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>
            </Box>

            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              sx={{ mt: 4 }}
              disabled={!jobRole}
            >
              Start Interview
            </Button>
          </Box>
        </Paper>
      </motion.div>
    </Container>
  );
};

export default LandingPage; 