import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import ReplayIcon from '@mui/icons-material/Replay';

interface RetryButtonProps {
  onClick: () => void;
}

const RetryButton: React.FC<RetryButtonProps> = ({ onClick }) => (
  <Tooltip title="Retry">
    <IconButton onClick={onClick} color="primary">
      <ReplayIcon />
    </IconButton>
  </Tooltip>
);

export default RetryButton;
export {}; 