import React from 'react';
import { Alert } from '@mui/material';

interface WarningMessageProps {
  message: string;
}

const WarningMessage: React.FC<WarningMessageProps> = ({ message }) => (
  <Alert severity="warning">{message}</Alert>
);

export default WarningMessage;
export {}; 