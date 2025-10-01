import { useState, useEffect } from 'react';
import { IdeaWithVotes, UserVotesInfo } from '../types';
import { ideasApi } from '../services/api';

export function useIdeas() {
  const [ideas, setIdeas] = useState<IdeaWithVotes[]>([]);
  const [userVotesInfo, setUserVotesInfo] = useState<UserVotesInfo>({ votesCount: 0, maxVotes: 10 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchIdeas = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [ideasResponse, votesResponse] = await Promise.all([
        ideasApi.getAllIdeas(),
        ideasApi.getUserVotesInfo()
      ]);

      if (ideasResponse.success && ideasResponse.data) {
        setIdeas(ideasResponse.data);
      } else {
        setError(ideasResponse.error || 'Ошибка загрузки идей');
      }

      if (votesResponse.success && votesResponse.data) {
        setUserVotesInfo(votesResponse.data);
      }
    } catch (err) {
      setError('Ошибка сети');
      console.error('Error fetching ideas:', err);
    } finally {
      setLoading(false);
    }
  };

  const voteForIdea = async (ideaId: string): Promise<boolean> => {
    try {
      const response = await ideasApi.voteForIdea({ ideaId });
      
      if (response.success) {
        // Обновляем локальное состояние
        setIdeas(prevIdeas => 
          prevIdeas.map(idea => 
            idea.id === ideaId 
              ? { ...idea, hasVoted: true, votesCount: idea.votesCount + 1 }
              : idea
          )
        );
        
        // Обновляем информацию о голосах пользователя
        setUserVotesInfo(prev => ({
          ...prev,
          votesCount: prev.votesCount + 1
        }));
        
        return true;
      } else {
        setError(response.error || 'Ошибка голосования');
        return false;
      }
    } catch (err) {
      setError('Ошибка сети при голосовании');
      console.error('Error voting:', err);
      return false;
    }
  };

  useEffect(() => {
    fetchIdeas();
  }, []);

  return {
    ideas,
    userVotesInfo,
    loading,
    error,
    voteForIdea,
    refetch: fetchIdeas
  };
}

