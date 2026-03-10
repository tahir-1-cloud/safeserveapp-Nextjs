//Task history

export interface SubTaskdto {
  subTaskOccurrenceId: number;
  subTaskName: string;
  status: number;
}

export interface TaskOccurrencedto {
  taskOccurrenceId: number;
  taskId: number;
  taskName: string;
  occurrenceDate: string;
  status: number;
  subTasks: SubTaskdto[];
}