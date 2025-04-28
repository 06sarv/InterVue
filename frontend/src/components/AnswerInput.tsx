import React from 'react';
import { TextField } from '@mui/material';

interface AnswerInputProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}

const AnswerInput: React.FC<AnswerInputProps> = ({ value, onChange, placeholder }) => (
  <TextField
    fullWidth
    multiline
    minRows={3}
    value={value}
    onChange={e => onChange(e.target.value)}
    placeholder={placeholder || 'Type your answer here...'}
    variant="outlined"
  />
);

export default AnswerInput;
export {}; 