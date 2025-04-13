import { FC, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button, AppBar, Toolbar, Box } from '@mui/material';
import { TaskModal } from './TaskModal';

export const Header: FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const location = useLocation();

  // Попробуем найти boardId в текущем пути, например: /board/123
  const match = location.pathname.match(/^\/board\/(\d+)/);
  const boardId = match ? Number(match[1]) : undefined;

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Box sx={{ flexGrow: 1, display: 'flex', gap: 2 }}>
            <Button color="inherit" component={Link} to="/issues">
              Все задачи
            </Button>
            <Button color="inherit" component={Link} to="/boards">
              Проекты
            </Button>
          </Box>
          <Button 
            color="inherit" 
            variant="outlined" 
            onClick={handleOpenModal}
            sx={{ borderColor: 'white', '&:hover': { borderColor: 'rgba(255,255,255,0.8)' } }}
          >
            Создать задачу
          </Button>
        </Toolbar>
      </AppBar>
      
      <TaskModal 
        open={isModalOpen} 
        onClose={handleCloseModal} 
        boardId={boardId}
      />
    </>
  );
};