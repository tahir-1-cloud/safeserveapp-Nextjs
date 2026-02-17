export interface LoginModel {
    email: string;
    password: string;
}

export interface LoginResponse {
  message: string;
  email: string;
  fullName: string;
  roleName: string;
  userId: number;
  staff: Staff;
  approvedCount: number;
  canceledCount: number;
  token: string;
}


export interface JwtPayload {
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier": string;
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role": string;
  jti: string;
  nbf: number;
  exp: number;
  iss: string;
  aud: string;
}


export interface Staff {
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
  jobRoleId: string;
  userId: string;
  faceEncoding: string | null;
  faceImagePath: string | null;
}
