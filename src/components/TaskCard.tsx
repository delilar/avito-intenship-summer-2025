import { FC, useRef, useEffect } from 'react';
import { Card, CardContent, Typography, Chip, Box } from '@mui/material';
import { Task, TaskPriority } from '../types/task';
import { useDrag } from 'react-dnd';

interface TaskCardProps {
  task: Task;
  isDraggable?: boolean;
  onDoubleClick?: () => void;
}

export const TaskCard: FC<TaskCardProps> = ({ task, isDraggable = false, onDoubleClick }) => {
  const ref = useRef<HTMLDivElement | null>(null);

  const [{ isDragging }, drag] = useDrag({
    type: 'task',
    item: { id: task.id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
    canDrag: () => isDraggable,
  });

  useEffect(() => {
    if (isDraggable && ref.current) {
      drag(ref.current);
    }
  }, [drag, isDraggable]);

  const getPriorityColor = (priority: TaskPriority) => {
    switch (priority) {
      case 'High':
        return '#f44336';
      case 'Medium':
        return '#ff9800';
      case 'Low':
        return '#4caf50';
      default:
        return '#9e9e9e';
    }
  };

  const getPriorityText = (priority: TaskPriority) => {
    switch (priority) {
      case 'High':
        return 'Высокий';
      case 'Medium':
        return 'Средний';
      case 'Low':
        return 'Низкий';
      default:
        return 'Неизвестно';
    }
  };

  return (
    <div ref={ref}>
      <Card
        onDoubleClick={onDoubleClick}
        sx={{
          opacity: isDragging ? 0.5 : 1,
          cursor: isDraggable ? 'grab' : 'default',
          '&:hover': {
            boxShadow: isDraggable ? 3 : 1,
          },
        }}
      >
        <CardContent>
          <Typography variant="h6" component="div">
            {task.title}
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 1, mb: 2 }}>
            {task.description}
          </Typography>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Chip
                label={getPriorityText(task.priority)}
                size="small"
                sx={{
                  backgroundColor: getPriorityColor(task.priority),
                  color: 'white',
                  mr: 1,
                }}
              />
              <Chip
                label={
                  task.status === 'Backlog'
                    ? 'Новая'
                    : task.status === 'InProgress'
                    ? 'В процессе'
                    : 'Завершена'
                }
                size="small"
                variant="outlined"
              />
            </Box>

            {task.assignee && (
              <Typography variant="body2" color="text.secondary">
                {task.assignee.fullName}
              </Typography>
            )}
          </Box>
        </CardContent>
      </Card>
    </div>
  );
};
