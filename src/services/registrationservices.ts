import axiosInstance from "@/services/axiosInstance";
import {StaffRegistration,RoleName,StaffViewModel} from "@/types/registrationdto";
import axios from "axios";
import { toast } from "sonner";

export async function registerStaff(register: StaffRegistration) {
    try {
        const response = await axiosInstance.post('/Staff/StaffRegistration',register);
        return response.data;
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            toast.error('Axios error adding Staff', error.response?.data || error.message);
        } else {
            toast.error('Unexpected error adding Staff');
        }
        throw error; 
    }
};

export const getAllRoles = async (): Promise<RoleName[]> => {
  try {
    const response = await axiosInstance.get<{ value: string; text: string }[]>(`/Security/RoleList`);
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


//Get All Register Staff

export const getAllRegisterStaff = async (): Promise<StaffViewModel[]> => {
    try{
        const response = await axiosInstance.get<StaffViewModel[]>(`/Staff/GetStaff`);
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