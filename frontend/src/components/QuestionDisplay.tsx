import React from 'react';
import { Typography, Box } from '@mui/material';

interface QuestionDisplayProps {
  question: string;
  followUp?: string;
}

const QuestionDisplay: React.FC<QuestionDisplayProps> = ({ question, followUp }) => (
  <Box>
    <Typography variant="h5" gutterBottom>{question}</Typography>
    {followUp && (
      <Typography variant="body1" color="primary" sx={{ mt: 2, mb: 2 }}>
        Follow-up: {followUp}
      </Typography>
    )}
  </Box>
);

export default QuestionDisplay;
export {}; 