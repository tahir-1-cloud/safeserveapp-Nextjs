export interface TaskCreatModel {
  taskId: number;
  taskTitle?: string;
  taskType?: string;
  category?: string;
  taskDescription?: string;
  priority?: string;
  subtasks: string[];
}

// Subtask interface
export interface SubTaskViewModel {
  id: number;
  taskId?: number;
  subTaskName?: string;
}

// Task details interface
export interface TaskDetailsViewModel {
  taskId: number;
  taskTitle?: string;
  taskType?: string;
  category?: string;
  taskDescription?: string;
  priority?: string;
   totalSubTasks?: number;
  subTasks: SubTaskViewModel[]; // always an array
}
