import axiosInstance from "@/services/axiosInstance";
import {LeaveApplication} from "@/types/staffApplication";
import axios from "axios";
import { toast } from "sonner";

export const getAllApplication = async (): Promise<LeaveApplication[]> => {
    try{
        const response = await axiosInstance.get<LeaveApplication[]>(`/StaffLeave/GetPendingApplication`);
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

export const getCancelApplication = async (): Promise<LeaveApplication[]> => {
    try{
           const response = await axiosInstance.get<LeaveApplication[]>(`/StaffLeave/GetCancelledApplication`);
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

export const getApprovdApplication = async (): Promise<LeaveApplication[]> => {
    try{
            const response = await axiosInstance.get<LeaveApplication[]>(`/StaffLeave/GetApprovedApplication`);
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
   

export const approveLeave = async (leaveId: number) => {
    try{
       await axiosInstance.post(`/StaffLeave/ApproveLeave/${leaveId}`);

    }    catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            toast.error('Axios error approving leave:', error.response?.data || error.message);
        } else {
            toast.error('Unexpected error');
        }
        throw error; 
    }
};

export const cancelLeave = async (leaveId: number) => {
    try{
         await axiosInstance.post(`/StaffLeave/CancelLeave/${leaveId}`);

    }
      catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            toast.error('Axios error Cancel Leave:', error.response?.data || error.message);
        } else {
            toast.error('Unexpected error');
        }
        throw error; 
    }
};