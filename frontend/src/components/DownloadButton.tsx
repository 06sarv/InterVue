import React from 'react';
import { Button } from '@mui/material';

interface DownloadButtonProps {
  onClick: () => void;
  label?: string;
}

const DownloadButton: React.FC<DownloadButtonProps> = ({ onClick, label }) => (
  <Button variant="contained" color="primary" onClick={onClick} sx={{ minWidth: 200 }}>
    {label || 'Download'}
  </Button>
);

export default DownloadButton;
export {}; 