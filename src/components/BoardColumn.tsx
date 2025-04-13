import { FC, useRef } from 'react';
import { Task } from '../types/task.d';
import { TaskCard } from './TaskCard';
import { Box, Typography, Paper } from '@mui/material';
import { useDrop } from 'react-dnd';

interface BoardColumnProps {
  title: string;
  tasks: Task[];
  status: Task['status'];
  onTaskDrop?: (taskId: number, status: Task['status']) => void;
  onTaskDoubleClick?: (task: Task) => void;
}

export const BoardColumn: FC<BoardColumnProps> = ({ title, tasks, status, onTaskDrop, onTaskDoubleClick }) => {
  const ref = useRef(null);
  
  const [{ isOver }, drop] = useDrop({
    accept: 'task',
    drop: (item: { id: number }) => {
      if (onTaskDrop) {
        onTaskDrop(item.id, status);
      }
      return { status };
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });
  
  drop(ref);
  
  return (
    <Paper sx={{ p: 2, flex: 1 }}>
      <Typography variant="h6" gutterBottom>{title}</Typography>
      <Box 
        ref={ref}
        sx={{ 
          minHeight: '500px',
          backgroundColor: isOver ? 'rgba(0, 0, 0, 0.05)' : 'transparent',
          transition: 'background-color 0.2s ease'
        }}
      >
        {tasks?.map((task) => (
          <Box key={task.id} sx={{ mb: 2 }}>
            <TaskCard 
              task={task} 
              isDraggable={true} 
              onDoubleClick={onTaskDoubleClick ? () => onTaskDoubleClick(task) : undefined}
            />
          </Box>
        ))}
      </Box>
    </Paper>
  );
};