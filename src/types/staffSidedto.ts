export interface StaffLeaveApplication {
  leaveId:number;
  name:string;
  department: string;
  leaveType: string;
  startdate: string;        // ISO date string
  enddate: string;  
  companyPolicy: string;
  morningShift: boolean | null;
  eveningShift: boolean | null;
  reasonAbsence: string;
  furtherOccurence: string;
  status: number;
  createdDate: string;      // ISO datetime string
}

export interface LeaveCounts {
  pending: number;
  approved: number;
  cancelled: number;
}

export interface JobDescription {
  jobRoleId: number;
  description: string;
}

export interface Policy {
  title: string;
  details: string;
}

export interface StaffProfile {
  id: number;
  title: string;
  gender: string;
  firstName: string;
  lastName: string;
  email: string;
  contact: string;
  address: string;
  city: string;
  postcode: string;
  jobRole: string | null;
  wagePerHour: number;

  // nullable from API
  leaveApplications: unknown[] | null;

  leaveCounts: LeaveCounts;

  // removed schedules → keep nullable in case backend sends later
  schedules: null;

  jobDescriptions: JobDescription[];
  policies: Policy[];
}

export interface StaffSchedule {
  id: number;
  staffName: string;
  startDate: string;      // ISO Date string
  endDate: string;        // ISO Date string
  startTime: string;      // e.g. "11:23 AM"
  endTime: string;        // e.g. "03:00 PM"
  scheduleType: string;   // e.g. "Weekly"

  isMonday: boolean;
  isTuesday: boolean;
  isWednesday: boolean;
  isThursday: boolean;
  isFriday: boolean;
  isSaturday: boolean;
  isSunday: boolean;

  createdAt: string;      // ISO Date string
  staffId: number;
  taskId: number;
  taskTitle: string;
}

//Schedule Details interface model

// Sub Task Occurrence
export interface SubTaskOccurrence {
  subTaskOccurrenceId: number;
  subTaskId: number;
  subTaskName: string;
  status: number;
}

// Task Occurrence
export interface TaskOccurrence {
  taskOccurrenceId: number;
  occurrenceDate: string; // ISO date string
  status: number;
  subTasks: SubTaskOccurrence[];
}

// Staff Schedule Detail (Main Response)
export interface StaffScheduleDetail {
  scheduleId: number;
  taskTitle: string;
  startTime: string;
  endTime: string;
  scheduleType: string;
  occurrences: TaskOccurrence[];
}