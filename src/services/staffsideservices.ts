import axiosInstance from "@/services/axiosInstance";
import {StaffLeaveApplication, StaffProfile,StaffSchedule,StaffScheduleDetail} from "@/types/staffSidedto";
import axios from "axios";
import { toast } from "sonner";



export const getStaffApplication = async (): Promise<StaffLeaveApplication[]> => {
  try {
    const token = localStorage.getItem("token");

    const response = await axiosInstance.get("/StaffSetting/GetStaffApplication",
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
     return response.data;
  } 
  catch (error: any) {
    toast.error(error);

    throw error;
  }
};

export const getLeaveApplicationById = async (LeaveId: number): Promise<StaffLeaveApplication> => {
  try {
    const response = await axiosInstance.get<StaffLeaveApplication>(`/StaffSetting/GetStaffApplicationById/${LeaveId}`);
    return response.data;
  } 
   catch (error: any) {
    toast.error(error);

    throw error;
  }
};

//Staff  profile api conusme

export const getStaffProfile = async (): Promise<StaffProfile> => {
  try {
    const token = localStorage.getItem("token");

    const response = await axiosInstance.get("/StaffSetting/GetStaffProfile",
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
     return response.data;
  } 
  catch (error: any) {
    toast.error(error);

    throw error;
  }
};

export const getStaffSchedule = async (): Promise<StaffSchedule[]> => {
  try {
    const token = localStorage.getItem("token");

    const response = await axiosInstance.get<StaffSchedule[]>( "/StaffSetting/GetUserSchedules",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } 
  catch (error: any) {
    toast.error(error);

    throw error;
  }
};

export const getScheduleDetails = async ( scheduleId: number): Promise<StaffScheduleDetail> => {
  try {
    const token = localStorage.getItem("token");

    const response = await axiosInstance.get<StaffScheduleDetail>(`/StaffSetting/GetScheduleDetails/${scheduleId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    toast.error(error);
    throw error;
  }
};