import { Task } from "../types/task";

export function groupTasksByStatus(tasks: Task[]) {
    return tasks.reduce((acc, task) => {
      if (!acc[task.status]) acc[task.status] = [];
      acc[task.status].push(task);
      return acc;
    }, {} as Record<Task['status'], Task[]>);
  }