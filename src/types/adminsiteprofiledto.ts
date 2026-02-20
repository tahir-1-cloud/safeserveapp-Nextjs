export interface StaffdetailModel {
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

  leaveApplications: LeaveApplication[];
  leaveCounts: LeaveCounts;
  schedules: Schedule[];
  jobDescriptions: JobDescription[];
  policies: Policy[];
}

export interface LeaveApplication {
  id: number;
  type: string | null;
  companyPolicy: string;
  status: number;
  startdate: string | null;
  enddate: string | null;
}

export interface LeaveCounts {
  pending: number;
  approved: number;
  cancelled: number;
}

export interface Schedule {
  id: number;
  tasktitle: string;
  subTasks: null;
  date: string;
  occurrences: TaskOccurrence[];
}

export interface TaskOccurrence {
  taskOccurrenceId: number;
  occurrenceDate: string;
  status: number;
  subTasks: SubTask[];
}

export interface SubTask {
  subTaskOccurrenceId: number;
  subTaskId: number;
  subTaskName: string;
  status: number;
}

export interface JobDescription {
  jobRoleId: number;
  description: string;
}

export interface Policy {
  title: string;
  details: string;
}