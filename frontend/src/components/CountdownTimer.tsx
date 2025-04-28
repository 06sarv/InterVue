import React from 'react';
import { Typography } from '@mui/material';

interface CountdownTimerProps {
  seconds: number;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ seconds }) => {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return (
    <Typography variant="h6">
      {minutes}:{secs.toString().padStart(2, '0')}
    </Typography>
  );
};

export default CountdownTimer;
export {}; 