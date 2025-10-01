import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
  Chip,
  Alert,
  Snackbar, CircularProgress,
} from '@mui/material';
import { ThumbUp, ThumbUpOutlined } from '@mui/icons-material';
import { IdeaWithVotes } from '../types';

interface IdeaCardProps {
  idea: IdeaWithVotes;
  onVote: (ideaId: string) => Promise<boolean>;
  canVote: boolean;
  userVotesRemaining: number;
}

export const IdeaCard: React.FC<IdeaCardProps> = ({
  idea,
  onVote,
  canVote,
  userVotesRemaining,
}) => {
  const [isVoting, setIsVoting] = useState(false);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const handleVote = async () => {
    setIsVoting(true);

    try {
      const success = await onVote(idea.id);

      setSnackbar({
        open: true,
        message: success ? 'Ваш голос засчитан!' : 'Ошибка при голосовании',
        severity: success ? 'success' : 'error',
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Ошибка сети',
        severity: 'error',
      });
    } finally {
      setIsVoting(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const getVoteButtonText = () => {
    if (isVoting) return 'Голосование...';
    if (idea.hasVoted) return 'Проголосовано';
    if (!canVote) return 'Лимит голосов исчерпан';
    if (userVotesRemaining === 0) return 'Нет голосов';
    return 'Проголосовать';
  };

  const isVoteDisabled = idea.hasVoted || !canVote || userVotesRemaining === 0 || isVoting;

  return (
    <>
      <Card
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: 4,
          }
        }}
      >
        <CardContent sx={{ flexGrow: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            <Typography variant="h6" component="h2" sx={{ fontWeight: 600, flexGrow: 1 }}>
              {idea.title}
            </Typography>
            <Chip
              icon={idea.hasVoted ? <ThumbUp /> : <ThumbUpOutlined />}
              label={`${idea.votesCount} голосов`}
              color={idea.hasVoted ? 'primary' : 'default'}
              variant={idea.hasVoted ? 'filled' : 'outlined'}
              size="small"
            />
          </Box>

          {idea.description && (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                lineHeight: 1.6,
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {idea.description}
            </Typography>
          )}
        </CardContent>

        <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
          <Typography variant="caption" color="text.secondary">
            {new Date(idea.createdAt).toLocaleDateString('ru-RU')}
          </Typography>

          <Button
              variant={idea.hasVoted ? 'outlined' : 'contained'}
              color={idea.hasVoted ? 'success' : 'primary'}
              startIcon={
                isVoting ?
                    <CircularProgress size={16} color="inherit" /> :
                    (idea.hasVoted ? <ThumbUp /> : <ThumbUpOutlined />)
              }
              onClick={handleVote}
              disabled={isVoteDisabled}
              size="small"
              sx={{ minWidth: 140 }}
          >
            {getVoteButtonText()}
          </Button>
        </CardActions>
      </Card>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

