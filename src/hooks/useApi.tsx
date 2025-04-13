import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { boardApi, taskApi, userApi } from '../api/apiClient';
import { Task, TaskStatus } from '../types/task';
import { Board } from '../types/board';

export const useBoards = () => {
  return useQuery<Board[]>({
    queryKey: ['boards'],
    queryFn: () => boardApi.getAll(),
  });
};

export const useBoardTasks = (boardId: number) => {
  return useQuery<Task[]>({
    queryKey: ['board-tasks', boardId],
    queryFn: () => boardApi.getTasks(boardId),
    enabled: !!boardId,
  });
};

export const useTasks = () => {
  return useQuery<Task[]>({
    queryKey: ['tasks'],
    queryFn: () => taskApi.getAll(),
  });
};

export const useCreateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newTask: Omit<Task, 'id'>) => taskApi.create(newTask),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      if (variables.boardId) {
        queryClient.invalidateQueries({ queryKey: ['board-tasks', variables.boardId] });
        queryClient.invalidateQueries({ queryKey: ['boards'] });
      }
    }
  });
};

export const useUpdateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (updatedTask: Partial<Task> & { id: number }) => 
      taskApi.update(updatedTask.id, updatedTask),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      if (variables.boardId) {
        queryClient.invalidateQueries({ queryKey: ['board-tasks', variables.boardId] });
        queryClient.invalidateQueries({ queryKey: ['boards'] });
      }
    }
  });
};

export const useUpdateTaskStatus = (boardId?: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ taskId, status }: { taskId: number; status: TaskStatus }) =>
      taskApi.updateStatus(taskId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      if (boardId) {
        queryClient.invalidateQueries({ queryKey: ['board-tasks', boardId] });
        queryClient.invalidateQueries({ queryKey: ['boards'] });
      }
    },
  });
};

export const useUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: () => userApi.getAll(),
  });
};