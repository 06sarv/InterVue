declare module 'framer-motion' {
  import * as React from 'react';

  export interface MotionProps {
    initial?: object;
    animate?: object;
    exit?: object;
    transition?: object;
    children?: React.ReactNode;
  }

  export const motion: {
    div: React.FC<MotionProps>;
    [key: string]: React.FC<MotionProps>;
  };
} 