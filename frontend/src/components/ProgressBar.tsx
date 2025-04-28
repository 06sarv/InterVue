import React from 'react';
import { LinearProgress, Box } from '@mui/material';

interface ProgressBarProps {
  value: number; // 0-100
}

const ProgressBar: React.FC<ProgressBarProps> = ({ value }) => (
  <Box sx={{ width: '100%', mb: 2 }}>
    <LinearProgress variant="determinate" value={value} />
  </Box>
);

export default ProgressBar;
export {}; 