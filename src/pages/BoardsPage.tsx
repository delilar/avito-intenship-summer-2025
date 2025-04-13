import { FC } from 'react';
import { Box, CircularProgress, Button, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { Board } from '../types/board';
import { useBoards } from '../hooks/useApi';

export const BoardsPage: FC = () => {
  const { data: boards, isLoading } = useBoards();

  if (isLoading) return <CircularProgress />;

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4" gutterBottom>Все доски</Typography>
      {boards?.map((board: Board) => (
        <Box key={board.id} sx={{ mb: 2, p: 2, border: '1px solid #ccc' }}>
          <Typography variant='h6'>{board.name}</Typography>
          <Typography variant='body1'>{board.description}</Typography>
          <Typography variant='body1'>Задачи: {board.taskCount}</Typography>
          <Button 
            sx={{ mt: 2 }}
            component={Link} 
            to={`/board/${board.id}`}
            variant="contained"
          >
            Открыть доску
          </Button>
        </Box>
      ))}
    </Box>
  );
};