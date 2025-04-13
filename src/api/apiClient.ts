import axios from 'axios';
import { Task } from '../types/task';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8080/api/v1',
});

export const boardApi = {
  getAll: async () => {
    const res = await api.get('/boards');
    return res.data.data;
  },
  getTasks: async (boardId: number) => {
    const res = await api.get(`/boards/${boardId}`);
    return res.data.data;
  }
};

export const userApi = {
  getAll: async () => {
    const res = await api.get('/users');
    return res.data.data;
  },
};

export const taskApi = {
  getAll: async () => {
    const res = await api.get('/tasks');
    return res.data.data;
  },
  create: async (task: Omit<Task, 'id'>) => {
    const res = await api.post('/tasks/create', task);
    return res.data;
  },
  update: async (taskId: number, updatedTask: Partial<Task>) => {
    const res = await api.put(`/tasks/update/${taskId}`, updatedTask);
    return res.data;
  },
  getByBoardId: async (boardId: number) => {
    const res = await api.get(`/boards/${boardId}`);
    return res.data.data;
  },
  getTasks: async (boardId: number) => {
    const res = await api.get(`/boards/${boardId}`);
    return res.data.data;
  },
  updateStatus: async (taskId: number, status: string ) => {
    const payload = { status: status };
    const res = await api.put(`/tasks/updateStatus/${taskId}`, payload);
    return res.data;
  },
};
