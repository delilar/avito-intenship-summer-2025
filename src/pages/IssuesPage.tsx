import { FC, useMemo, useState } from 'react';
import { TaskCard } from '../components/TaskCard';
import {
  Box,
  CircularProgress,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Typography,
  Fab,
  Grid
} from '@mui/material';
import { Task } from '../types/task';
import { TaskModal } from '../components/TaskModal';
import AddIcon from '@mui/icons-material/Add';
import { Board } from '../types/board';
import { useBoards, useTasks } from '../hooks/useApi';

export const IssuesPage: FC = () => {
  const { data: tasks, isLoading: isLoadingTasks } = useTasks();
  const { data: boards, isLoading: isLoadingBoards } = useBoards();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [boardFilter, setBoardFilter] = useState<number | ''>('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredTasks = useMemo(() => {
    if (!tasks) return [];

    return tasks.filter((task: Task) => {
      const matchesSearch =
        task.title.toLowerCase().includes(search.toLowerCase()) ||
        (task.assignee?.fullName && task.assignee.fullName.toLowerCase().includes(search.toLowerCase()));

      const matchesStatus = statusFilter ? task.status === statusFilter : true;
      const matchesBoard = boardFilter ? task.boardId === boardFilter : true;

      return matchesSearch && matchesStatus && matchesBoard;
    });
  }, [tasks, search, statusFilter, boardFilter]);
  
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };
  
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  if (isLoadingTasks || isLoadingBoards) return <CircularProgress />;

  return (
    <Box sx={{ p: 2, position: 'relative', minHeight: '100vh' }}>
      <Typography variant="h4" gutterBottom>Все задачи</Typography>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="Поиск по названию или исполнителю"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Grid>

        <Grid item xs={6} md={4}>
          <FormControl fullWidth>
            <InputLabel id="status-filter-label">Статус</InputLabel>
            <Select
              labelId="status-filter-label"
              value={statusFilter}
              label="Статус"
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <MenuItem value="">Все</MenuItem>
              <MenuItem value="Backlog">Новая</MenuItem>
              <MenuItem value="InProgress">В процессе</MenuItem>
              <MenuItem value="Done">Завершена</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={6} md={4}>
          <FormControl fullWidth>
            <InputLabel id="board-filter-label">Доска</InputLabel>
            <Select
              labelId="board-filter-label"
              value={boardFilter}
              label="Доска"
              onChange={(e) =>
                setBoardFilter(e.target.value === '' ? '' : Number(e.target.value))
              }
            >
              <MenuItem value="">Все</MenuItem>
              {boards?.map((board: Board) => (
                <MenuItem key={board.id} value={board.id}>
                  {board.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {filteredTasks.length === 0 ? (
        <Typography>Нет задач по заданным условиям</Typography>
      ) : (
        <Box sx={{ mb: 8 }}>
          {filteredTasks.map((task) => (
            <Box key={task.id} sx={{ mb: 2 }}>
              <TaskCard key={task.id} task={task} />
            </Box>
          ))}
        </Box>
      )}
      
      <Fab 
        color="primary" 
        aria-label="Создать задачу" 
        onClick={handleOpenModal}
        sx={{ 
          position: 'fixed', 
          bottom: 20, 
          right: 20 
        }}
      >
        <AddIcon />
      </Fab>
      
      {isModalOpen && (
        <TaskModal
          open={isModalOpen}
          onClose={handleCloseModal}
          boardId={boardFilter !== '' ? boardFilter : undefined}
        />
      )}
    </Box>
  );
};