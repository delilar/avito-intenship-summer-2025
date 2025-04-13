import { Modal, Box, TextField, Button, Select, MenuItem, FormControl, InputLabel, Typography, SelectChangeEvent } from '@mui/material';
import { Task, TaskStatus, TaskPriority } from '../types/task';
import { useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useBoards, useUsers, useCreateTask, useUpdateTask } from '../hooks/useApi';

interface TaskModalProps {
  open: boolean;
  onClose: () => void;
  task?: Task;
  boardId?: number;
}

export function TaskModal({ open, onClose, task, boardId}: TaskModalProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const isEdit = !!task;
  const isOnBoardPage = location.pathname.includes('/board/');
  
  const [selectedBoardId, setSelectedBoardId] = useState<number | undefined>(boardId || task?.boardId);
  const [assigneeId, setAssigneeId] = useState<number | ''>(task?.assigneeId || '');
  const [status, setStatus] = useState<TaskStatus>(task?.status || 'Backlog');
  
  const { data: boardsData } = useBoards();
  const boards = Array.isArray(boardsData) ? boardsData : [];
  
  const { data: usersData } = useUsers();
  const users = Array.isArray(usersData) ? usersData : [];
  
  const createTask = useCreateTask();
  const updateTask = useUpdateTask();
  
  useEffect(() => {
    if (open) {
      setSelectedBoardId(boardId || (task ? task.boardId : undefined));
      setAssigneeId(task?.assignee?.id || '');
      setStatus(task?.status || 'Backlog');
    }
  }, [boardId, task, open]);
  
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    if (!selectedBoardId) {
      alert('Пожалуйста, выберите проект');
      return;
    }

    const taskData = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      status: status,
      priority: formData.get('priority') as TaskPriority,
      assigneeId: assigneeId === '' ? null : assigneeId,
      boardId: selectedBoardId
    };
    
    if (isEdit && task) {
      updateTask.mutate({ ...taskData, id: task.id }, {
        onSuccess: () => onClose()
      });
    } else {
      createTask.mutate(taskData as Omit<Task, 'id'>, {
        onSuccess: () => onClose()
      });
    }
  };
  
  const handleCreateAndGoToBoard = () => {
    // Собираем данные формы вручную, так как мы не отправляем форму
    const form = document.querySelector('form') as HTMLFormElement;
    const title = form.querySelector('input[name="title"]') as HTMLInputElement;
    const description = form.querySelector('textarea[name="description"]') as HTMLTextAreaElement;
    const priority = form.querySelector('input[name="priority"]') || 
                     form.querySelector('select[name="priority"]') as HTMLSelectElement;
    
    if (!title.value || !selectedBoardId) {
      alert('Пожалуйста, заполните обязательные поля');
      return;
    }
    
    const taskData = {
      title: title.value,
      description: description?.value || '',
      status: status,
      priority: (priority as HTMLSelectElement)?.value as TaskPriority || 'Medium',
      assigneeId: assigneeId === '' ? null : assigneeId,
      boardId: selectedBoardId
    };
    
    createTask.mutate(taskData as Omit<Task, 'id'>, {
      onSuccess: () => {
        navigate(`/board/${selectedBoardId}`);
      }
    });
  };

  const handleBoardChange = (event: SelectChangeEvent<number>) => {
    setSelectedBoardId(event.target.value as number);
  };

  const handleStatusChange = (event: SelectChangeEvent<TaskStatus>) => {
    setStatus(event.target.value as TaskStatus);
  };

  const handleGoToBoard = () => {
    if (selectedBoardId) {
      navigate(`/board/${selectedBoardId}`);
      onClose();
    }
  };

  const modalTitle = isEdit ? 'Редактирование задачи' : 'Создание задачи';
  
  const currentBoard = boards.find(board => board.id === selectedBoardId);

  const isOnIssuesPage = location.pathname.includes('/issues');

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{ 
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 600,
        bgcolor: 'background.paper',
        borderRadius: 2,
        p: 4
      }}>
        <Typography variant="h5" component="h2" gutterBottom>
          {modalTitle}
        </Typography>
        
        <form onSubmit={handleSubmit}>
          <TextField
            name="title"
            label="Название"
            defaultValue={task?.title}
            fullWidth
            margin="normal"
            required
          />
          
          <TextField
            name="description"
            label="Описание"
            defaultValue={task?.description}
            multiline
            rows={4}
            fullWidth
            margin="normal"
          />
          
          {isOnBoardPage ? (
            <FormControl fullWidth margin="normal">
              <InputLabel shrink>Проект</InputLabel>
              <TextField
                value={currentBoard?.name || 'Загрузка...'}
                disabled
                fullWidth
                InputProps={{
                  readOnly: true,
                }}
              />
              <input type="hidden" name="boardId" value={selectedBoardId} />
            </FormControl>
          ) : (
            <FormControl fullWidth margin="normal">
              <InputLabel>Проект</InputLabel>
              <Select
                name="boardId"
                value={selectedBoardId || ''}
                onChange={handleBoardChange}
                label="Проект"
                required
              >
                {boards.map(board => (
                  <MenuItem key={board.id} value={board.id}>
                    {board.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
          
          <FormControl fullWidth margin="normal">
            <InputLabel>Приоритет</InputLabel>
            <Select
              name="priority"
              defaultValue={task?.priority || 'Medium'}
              label="Приоритет"
              required
            >
              <MenuItem value="Low">Низкий</MenuItem>
              <MenuItem value="Medium">Средний</MenuItem>
              <MenuItem value="High">Высокий</MenuItem>
            </Select>
          </FormControl>
          
          {isEdit ? (
            <FormControl fullWidth margin="normal">
              <InputLabel>Статус</InputLabel>
              <Select
                name="status"
                value={status}
                onChange={handleStatusChange}
                label="Статус"
                required
              >
                <MenuItem value="Backlog">Backlog</MenuItem>
                <MenuItem value="InProgress">In Progress</MenuItem>
                <MenuItem value="Done">Done</MenuItem>
              </Select>
            </FormControl>
          ) : (
            <FormControl fullWidth margin="normal">
              <InputLabel shrink>Статус</InputLabel>
              <TextField
                value="Backlog"
                disabled
                fullWidth
                InputProps={{
                  readOnly: true,
                }}
              />
              <input type="hidden" name="status" value="Backlog" />
            </FormControl>
          )}
          
          <FormControl fullWidth margin="normal">
            <InputLabel>Исполнитель</InputLabel>
            <Select
              name="assigneeId"
              value={assigneeId}
              onChange={(e: SelectChangeEvent<string | number>) => {
                const value = e.target.value;
                setAssigneeId(value === '' ? '' : Number(value));
              }}
              label="Исполнитель"
            >
              <MenuItem value=""><em>Не назначен</em></MenuItem>
              {users.map(user => (
                <MenuItem key={user.id} value={user.id}>
                  {user.fullName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
            {!isOnBoardPage && !isOnIssuesPage && selectedBoardId && (
              <Button 
                variant="outlined" 
                color="primary" 
                onClick={handleGoToBoard}
              >
                Перейти на доску
              </Button>
            )}
            
            {isOnIssuesPage && !isEdit && selectedBoardId && (
              <Button 
                variant="outlined" 
                color="primary" 
                onClick={handleCreateAndGoToBoard}
              >
                Создать и перейти на доску
              </Button>
            )}
            
            {(isOnBoardPage || (!selectedBoardId && !isOnIssuesPage)) && <Box />}
            
            <Button 
              type="submit" 
              variant="contained" 
              color="primary"
              disabled={createTask.isPending || updateTask.isPending}
            >
              {isEdit ? 'Обновить' : 'Создать'}
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  );
}