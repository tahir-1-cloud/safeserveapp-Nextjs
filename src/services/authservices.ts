import axiosInstance from "@/services/axiosInstance";
import { LoginModel,LoginResponse } from "@/types/auth";
import axios from "axios";
import { toast } from "sonner";


export const loginStaff = async (data: LoginModel): Promise<LoginResponse> => {
    try{
        const response = await axiosInstance.post<LoginResponse>(`/Authentication/LoginStudent`, data);
        //for save token
        const token = response.data.token;
        if (!token) {
        throw new Error("Token not received from server");
        }
        localStorage.setItem("token", token);
        return response.data;
    }
        catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            toast.error('Axios error:', error.response?.data || error.message);
        } else {
            toast.error('Unexpected error');
        }
        throw error; 
    }

};