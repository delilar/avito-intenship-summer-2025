import { FC, useState } from 'react';
import { useParams } from 'react-router-dom';
import { BoardColumn } from '../components/BoardColumn';
import { Box, CircularProgress, Typography } from '@mui/material';
import { Task } from '../types/task';
import { TaskModal } from '../components/TaskModal';
import { useBoards, useBoardTasks, useUpdateTaskStatus } from '../hooks/useApi';

export const BoardPage: FC = () => {
  const { id: boardIdParam } = useParams<{ id: string }>();
  const boardId = Number(boardIdParam);
  
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Используем хуки для получения данных
  const { data: boardsData, isLoading: boardsLoading } = useBoards();
  const { data: tasks, isLoading: tasksLoading } = useBoardTasks(boardId);
  const updateTaskStatus = useUpdateTaskStatus(boardId);

  const boards = Array.isArray(boardsData) ? boardsData : [];
  const board = boards.find(b => b.id === boardId);

  const handleTaskDrop = (taskId: number, status: Task['status']) => {
    updateTaskStatus.mutate({ taskId, status });
  };

  const handleTaskDoubleClick = (task: Task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTask(null);
  };

  if (boardsLoading || tasksLoading) return <CircularProgress />;

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4" gutterBottom>{board?.name || 'Загрузка проекта...'}</Typography>
      <Box sx={{ display: 'flex', gap: 2 }}>
        <BoardColumn
          title="To Do"
          tasks={tasks?.filter(t => t.status === 'Backlog') || []}
          status="Backlog"
          onTaskDrop={handleTaskDrop}
          onTaskDoubleClick={handleTaskDoubleClick}
        />
        <BoardColumn
          title="In Progress"
          tasks={tasks?.filter(t => t.status === 'InProgress') || []}
          status="InProgress"
          onTaskDrop={handleTaskDrop}
          onTaskDoubleClick={handleTaskDoubleClick}
        />
        <BoardColumn
          title="Done"
          tasks={tasks?.filter(t => t.status === 'Done') || []}
          status="Done"
          onTaskDrop={handleTaskDrop}
          onTaskDoubleClick={handleTaskDoubleClick}
        />
      </Box>

      {isModalOpen && (
        <TaskModal
          open={isModalOpen}
          onClose={handleCloseModal}
          task={selectedTask || undefined}
          boardId={boardId}
        />
      )}
    </Box>
  );
};