export interface LeaveApplication {
  leaveId: number;
  name?: string;
  department?: string;
  leaveType?: string;
  startdate?: string;      // DateTime → string (API JSON)
  enddate?: string;        // DateTime → string
  starttime?: string;
  endTime?: string;
  companyPolicy?: string;
  morningShift?: boolean;
  eveningShift?: boolean;
  reasonAbsence?: string;
}

export interface AddApplicationdto {
  leaveId?: number;
  name?: string;
  department?: string;
  leaveType?: string;
  startdate?: string;      // ISO string
  enddate?: string;
  starttime?: string;
  endTime?: string;
  companyPolicy?: string;
  morningShift?: boolean;
  eveningShift?: boolean;
  reasonAbsence?: string;
  furtherOccurence?: string;
  status?: number;
  userId?: number;
}