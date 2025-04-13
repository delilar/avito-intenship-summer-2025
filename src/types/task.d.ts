export type TaskStatus = 'Backlog' | 'InProgress' | 'Done';
export type TaskPriority = 'Low' | 'Medium' | 'High';

export interface Task {
    id: number;
    title: string;
    description: string;
    status: 'Backlog' | 'InProgress' | 'Done';
    priority: 'Low' | 'Medium' | 'High';
    boardId: number;
    assigneeId: number | null;
    assignee?: User;
    board?: Board;
  }