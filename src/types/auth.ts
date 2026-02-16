export interface LoginModel {
    userName?: string;
    password: string;
}

export interface LoginResponse {
    fullName: string;
    token:string;
}

export interface JwtPayload {
  sub: string;       // user id
  fullName: string;  
  exp: number;
  cnic:string;
  emailaddress:string;
}