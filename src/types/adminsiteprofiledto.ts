export interface StaffdetailModel {
  id: number;
  title: string;
  gender: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  wagePerHour: number;
  jobRole: string | null;
  contact: string;
  address: string;
  postcode: string;
  city: string;
}