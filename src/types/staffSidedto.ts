export interface StaffLeaveApplication {
  department: string;
  leaveType: string;
  startdate: string;        // ISO date string
  enddate: string;          // ISO date string
  companyPolicy: string;
  morningShift: boolean | null;
  eveningShift: boolean | null;
  reasonAbsence: string;
  furtherOccurence: string;
  status: number;
  createdDate: string;      // ISO datetime string
}