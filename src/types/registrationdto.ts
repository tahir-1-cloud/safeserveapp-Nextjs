export interface StaffRegistration {
    id?:number;
  title: string;
  gender: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  wagePerHour: number;
  jobRole: string;
  contact: string;
  address: string;
  postcode: string;
  city: string;
  roleId: number;
  jobRoleId: number;
  roleName: string;
}

export interface RoleName{
  id?:number
  name: string;
}

export interface StaffViewModel {
  id: number;
  fullName?: string ;
  jobRole?: string;
  contact: string; 
  address?: string;
  email?:string;
}
