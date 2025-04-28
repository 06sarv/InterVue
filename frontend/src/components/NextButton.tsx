import React from 'react';
import { Button } from '@mui/material';

interface NextButtonProps {
  onClick: () => void;
  label?: string;
  disabled?: boolean;
}

const NextButton: React.FC<NextButtonProps> = ({ onClick, label, disabled }) => (
  <Button variant="contained" color="primary" onClick={onClick} disabled={disabled} sx={{ mt: 2 }}>
    {label || 'Next'}
  </Button>
);

export default NextButton;
export {}; 