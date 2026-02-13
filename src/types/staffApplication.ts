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
