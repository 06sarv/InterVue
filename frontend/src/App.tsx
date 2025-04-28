import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Typography, AppBar, Toolbar, IconButton, Box } from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import { ThemeAccentProvider, useThemeAccent } from './context/ThemeAccentContext';
import './App.css';
import backgroundLight from './assets/background-light.png';
import backgroundDark from './assets/background-dark.png';
import LandingPage from './pages/LandingPage';
import InterviewPage from './pages/InterviewPage';
import ReportPage from './pages/ReportPage';

const AppContent: React.FC = () => {
  const { mode, toggleMode, accentColor } = useThemeAccent();

  const bgImage = mode === 'light' ? backgroundLight : backgroundDark;

  // Dynamic MUI theme
  const theme = React.useMemo(() =>
    createTheme({
      palette: {
        mode,
        primary: { main: accentColor },
        text: { primary: accentColor },
      },
      typography: {
        allVariants: {
          color: accentColor,
          transition: 'color 0.5s',
        },
      },
    }), [mode, accentColor]
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div
        className="app-background"
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        <Typography
          variant="h3"
          sx={{
            textAlign: 'center',
            color: mode === 'dark' ? '#fff' : accentColor,
            fontWeight: 700,
            letterSpacing: 2,
            fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
            mt: 4,
            mb: 1,
          }}
        >
          InterVue
        </Typography>
        <Typography
          variant="subtitle1"
          sx={{
            textAlign: 'center',
            color: mode === 'dark' ? '#fff' : accentColor,
            fontWeight: 400,
            fontSize: { xs: '1.35rem', sm: '1.6rem', md: '1.8rem' },
            mb: 4,
          }}
        >
          Empowering Every Candidate, One Smart Conversation at a Time.
        </Typography>
        <IconButton
          onClick={toggleMode}
          color="inherit"
          sx={{ position: 'absolute', top: 24, right: 48, zIndex: 1000 }}
          aria-label="Toggle theme"
        >
          {mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
        </IconButton>
        <Router>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/interview" element={<InterviewPage />} />
            <Route path="/report" element={<ReportPage />} />
          </Routes>
        </Router>
      </div>
    </ThemeProvider>
  );
};

const App: React.FC = () => (
  <ThemeAccentProvider>
    <AppContent />
  </ThemeAccentProvider>
);

export default App; 