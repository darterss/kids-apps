import React from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  CircularProgress,
  Alert,
  Paper,
  AppBar,
  Toolbar,
} from '@mui/material';
import { Refresh } from '@mui/icons-material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { IdeaCard } from './components/IdeaCard';
import { UserStats } from './components/UserStats';
import { useIdeas } from './hooks/useIdeas';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
  },
});

const App: React.FC = () => {
  const { ideas, userVotesInfo, loading, error, voteForIdea, refetch } = useIdeas();

  const canVote = userVotesInfo.votesCount < userVotesInfo.maxVotes;
  const votesRemaining = userVotesInfo.maxVotes - userVotesInfo.votesCount;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      
      <AppBar position="static" elevation={0}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, textAlign: 'center' }}>
            Голосование за идеи LogicLike
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Paper elevation={1} sx={{ p: 4, mb: 4, textAlign: 'center' }}>
          <Typography variant="h4" gutterBottom sx={{ color: 'primary.main', fontWeight: 600 }}>
            Идеи для развития LogicLike
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
            Помогите нам выбрать лучшие идеи для развития нашей платформы!
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Вы можете проголосовать за максимум {userVotesInfo.maxVotes} идей.
          </Typography>
        </Paper>

        <UserStats userVotesInfo={userVotesInfo} />

        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress size={60} />
          </Box>
        )}

        {error && (
          <Alert 
            severity="error" 
            action={
              <Refresh 
                sx={{ cursor: 'pointer' }} 
                onClick={refetch}
              />
            }
            sx={{ mb: 3 }}
          >
            {error}
          </Alert>
        )}

        {!loading && !error && (
          <Grid container spacing={3}>
            {ideas.map((idea) => (
              <Grid item xs={12} sm={6} lg={4} key={idea.id}>
                <IdeaCard
                  idea={idea}
                  onVote={voteForIdea}
                  canVote={canVote}
                  userVotesRemaining={votesRemaining}
                />
              </Grid>
            ))}
          </Grid>
        )}

        {!loading && !error && ideas.length === 0 && (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary">
              Идей пока нет. Будьте первым, кто предложит идею!
            </Typography>
          </Paper>
        )}

        {!loading && !error && ideas.length > 0 && (
          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Всего идей: {ideas.length} • Отсортировано по популярности
            </Typography>
          </Box>
        )}
      </Container>
    </ThemeProvider>
  );
};

export default App;