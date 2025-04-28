import React from 'react';
import { Box, Typography, Chip, List, ListItem, ListItemText, Divider } from '@mui/material';

interface EvaluationDisplayProps {
  sentiment: 'Positive' | 'Negative' | 'Mixed';
  score: number;
  strengths: string[];
  suggestions: string[];
}

const EvaluationDisplay: React.FC<EvaluationDisplayProps> = ({ sentiment, score, strengths, suggestions }) => (
  <Box>
    <Typography variant="h6" gutterBottom>Overall Evaluation</Typography>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
      <Chip
        label={sentiment}
        color={
          sentiment === 'Positive' ? 'success' :
          sentiment === 'Negative' ? 'error' : 'warning'
        }
      />
      <Typography variant="h5">Score: {score}/10</Typography>
    </Box>
    <Divider sx={{ my: 2 }} />
    <Typography variant="h6" gutterBottom>Strengths</Typography>
    <List>
      {strengths.map((strength, idx) => (
        <ListItem key={idx}><ListItemText primary={strength} /></ListItem>
      ))}
    </List>
    <Typography variant="h6" gutterBottom>Suggestions for Improvement</Typography>
    <List>
      {suggestions.map((suggestion, idx) => (
        <ListItem key={idx}><ListItemText primary={suggestion} /></ListItem>
      ))}
    </List>
  </Box>
);

export default EvaluationDisplay;
export {}; 