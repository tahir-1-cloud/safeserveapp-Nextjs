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