import axiosInstance from "@/services/axiosInstance";
import {StaffLeaveApplication} from "@/types/staffSidedto";
import axios from "axios";
import { toast } from "sonner";


export const getStaffApplication = async (): Promise<StaffLeaveApplication[]> => {
    try{
        const response = await axiosInstance.get<StaffLeaveApplication[]>(`/StaffSetting/GetStaffApplication`);
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