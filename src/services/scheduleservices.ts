import axiosInstance from "@/services/axiosInstance";
import {StafNameModel,TaskNameModel,CreatScheduleModel,ViewScheduleDto,TaskDetailDto,CalendarEventDto} from "@/types/scheduledto";
import axios from "axios";
import { toast } from "sonner";


export const getStaffName = async (): Promise<StafNameModel[]> => {
  try {
    const response = await axiosInstance.get<{ value: string; text: string }[]>(`/Staff/StaffbyName`);
    // Map API response to RoleModel
    return response.data.map((role) => ({
      id: Number(role.value),
      name: role.text,
    }));
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      toast.error('Axios error:', error.response?.data || error.message);
    } else {
      toast.error('Unexpected error');
    }
    throw error;
  }
};


export const getTaskName = async (): Promise<TaskNameModel[]> => {
  try {
    const response = await axiosInstance.get<{ value: string; text: string }[]>(`/TaskManagement/TaskTitles`);
    // Map API response to RoleModel
    return response.data.map((role) => ({
      id: Number(role.value),
      name: role.text,
    }));
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      toast.error('Axios error:', error.response?.data || error.message);
    } else {
      toast.error('Unexpected error');
    }
    throw error;
  }
};

export async function addschedule(code: CreatScheduleModel) {
    try {
        const response = await axiosInstance.post('/Schedules/Addschedules',code);
        return response.data;
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            toast.error('Axios error adding schedule', error.response?.data || error.message);
        } else {
            toast.error('Unexpected error adding schedule');
        }
        throw error; 
    }
};

export const getAllSchedule = async (): Promise<ViewScheduleDto[]> => {
    try{
           const response = await axiosInstance.get<ViewScheduleDto[]>(`/StaffSetting/GetAllSchedules`);
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

export const getTaskDetailByScheduleId = async (scheduleId: number): Promise<TaskDetailDto> => {
  try {
    const response = await axiosInstance.get<TaskDetailDto>(`/StaffSetting/GetAllScheduleDetails/${scheduleId}`);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      toast.error(
        error.response?.data?.message || error.message || 'Failed to load task details'
      );
    } else {
      toast.error('Unexpected error occurred');
    }
    throw error;
  }
};

//For Calendar event

// API call function
export const getAllScheduleCalendar = async (): Promise<CalendarEventDto[]> => {
    try {
        const response = await axiosInstance.get<CalendarEventDto[]>(`/StaffSetting/GetSchedulesCalendar`);
        return response.data;
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            toast.error('Axios error: ' + (error.response?.data || error.message));
        } else {
            toast.error('Unexpected error');
        }
        throw error;
    }
};