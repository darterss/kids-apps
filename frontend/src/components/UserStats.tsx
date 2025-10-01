import React from 'react';
import { Paper, Typography, Box, LinearProgress } from '@mui/material';
import { UserVotesInfo } from '../types';

interface UserStatsProps {
  userVotesInfo: UserVotesInfo;
}

export const UserStats: React.FC<UserStatsProps> = ({ userVotesInfo }) => {
  const progressValue = (userVotesInfo.votesCount / userVotesInfo.maxVotes) * 100;
  const votesRemaining = userVotesInfo.maxVotes - userVotesInfo.votesCount;

  return (
    <Paper
      elevation={2}
      sx={{
        p: 3,
        mb: 3,
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Ваша статистика голосования
        </Typography>
      </Box>

      <Box sx={{ mb: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="body2">
            Использовано голосов: {userVotesInfo.votesCount}
          </Typography>
          <Typography variant="body2">
            Осталось: {votesRemaining}
          </Typography>
        </Box>

        <LinearProgress
          variant="determinate"
          value={progressValue}
          sx={{
            height: 8,
            borderRadius: 4,
            backgroundColor: 'rgba(255, 255, 255, 0.3)',
            '& .MuiLinearProgress-bar': {
              borderRadius: 4,
              backgroundColor: '#4caf50',
            },
          }}
        />
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography variant="body2">
          Максимум голосов: {userVotesInfo.maxVotes}
        </Typography>
      </Box>

      {votesRemaining === 0 && (
        <Box sx={{ mt: 2, p: 2, backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: 1 }}>
          <Typography variant="body2" sx={{ textAlign: 'center', fontWeight: 500 }}>
            Вы использовали все доступные голоса!
          </Typography>
        </Box>
      )}
    </Paper>
  );
};

