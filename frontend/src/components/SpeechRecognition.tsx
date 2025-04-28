import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';

interface SpeechRecognitionProps {
  isRecording: boolean;
  onClick: () => void;
  disabled?: boolean;
}

const SpeechRecognition: React.FC<SpeechRecognitionProps> = ({ isRecording, onClick, disabled }) => (
  <Tooltip title={isRecording ? 'Stop Recording' : 'Start Recording'}>
    <IconButton onClick={onClick} color={isRecording ? 'error' : 'default'} disabled={disabled}>
      {isRecording ? <MicOffIcon /> : <MicIcon />}
    </IconButton>
  </Tooltip>
);

export default SpeechRecognition;
export {}; 