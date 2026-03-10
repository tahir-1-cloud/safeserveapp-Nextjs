import axiosInstance from "@/services/axiosInstance";
import {StaffLeaveApplication, StaffProfile,StaffSchedule,StaffScheduleDetail} from "@/types/staffSidedto";
import {TaskOccurrencedto} from "@/types/taskhistorystaffsidedto";

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
     toast.error(error.message);

    throw error;
  }
};

export const getLeaveApplicationById = async (LeaveId: number): Promise<StaffLeaveApplication> => {
  try {
    const response = await axiosInstance.get<StaffLeaveApplication>(`/StaffSetting/GetStaffApplicationById/${LeaveId}`);
    return response.data;
  } 
   catch (error: any) {
     toast.error(error.message);

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
   toast.error(error.message);

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
   toast.error(error.message);

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
  } 
  catch (error: any) {
    toast.error(error.message);
    throw error;
  }
};

//Update main task (Api consume)

export const updateTaskStatus = async ( taskOccurrenceId: number): Promise<void> => {
  try {
    await axiosInstance.post(
      `/TaskManagement/UpdateTaskStatus/${taskOccurrenceId}`
    );
  }
   catch (error: any) {
    toast.error(error?.response?.data || "Failed to update task status");
    throw error;
  }
};

//Update subtask task (Api consume)


export const updateSubTaskStatus = async (subTaskOccurrenceId: number): Promise<void> => {
  try {
    await axiosInstance.post(
      `/TaskManagement/UpdateSubTaskOccurrenceStatus/${subTaskOccurrenceId}`
    );
  } catch (error: any) {
    toast.error(
      error?.response?.data || "Failed to update sub task status"
    );
    throw error;
  }
};

// Task History

export const getCompletedTask = async (): Promise<TaskOccurrencedto[]> => {
  try {
    const token = localStorage.getItem("token");

    const response = await axiosInstance.get<TaskOccurrencedto[]>( "/StaffSetting/GetCompletedTasks",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } 
  catch (error: any) {
   toast.error(error.message);

    throw error;
  }
};