import React from 'react';
import { Alert } from '@mui/material';

interface SuccessMessageProps {
  message: string;
}

const SuccessMessage: React.FC<SuccessMessageProps> = ({ message }) => (
  <Alert severity="success">{message}</Alert>
);

export default SuccessMessage;
export {}; 