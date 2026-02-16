export interface StafNameModel{
  id:number
  name: string;
}

export interface TaskNameModel{
  id:number
  name: string;
}

export interface CreatScheduleModel {
  id: number;
  staffName?: string;
  startDate?: string; // use ISO string for dates
  endDate?: string;
  startTime?: string;
  endTime?: string;
  scheduleType?: string;
  isMonday: boolean;
  isTuesday: boolean;
  isWednesday: boolean;
  isThursday: boolean;
  isFriday: boolean;
  isSaturday: boolean;
  isSunday: boolean;
  createdAt?: string;
  staffId?: number;
  taskId?: number;
}

export interface ViewScheduleDto {
  id: number;
  staffName: string;
  taskTitle: string | null;

  startDate: string;  
  endDate: string;
  startTime: string;   // "11:23 AM"
  endTime: string;     // "03:00 PM"
  scheduleType: string;

  isMonday: boolean;
  isTuesday: boolean;
  isWednesday: boolean;
  isThursday: boolean;
  isFriday: boolean;
  isSaturday: boolean;
  isSunday: boolean;

  createdAt: string
}


// Sub-task occurrence
export interface SubTaskOccurrenceDto {
  subTaskOccurrenceId: number;
  subTaskId: number;
  subTaskName: string;
  status: number; // 0 = pending, 1 = completed (you can enum later)
}

// Task occurrence
export interface TaskOccurrenceDto {
  taskOccurrenceId: number;
  occurrenceDate: string; // ISO date string
  status: number;
  subTasks: SubTaskOccurrenceDto[];
}

// Main task detail response
export interface TaskDetailDto {
  scheduleId: number;
  taskTitle: string;
  startTime: string; // "11:23 AM"
  endTime: string;   // "03:00 PM"
  scheduleType: string;
  occurrences: TaskOccurrenceDto[];
}

export interface CalendarEventDto {
    id: number;
    title: string;
    eventdate: string; // ISO date string
    
}