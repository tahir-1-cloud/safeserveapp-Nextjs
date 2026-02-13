import axiosInstance from "@/services/axiosInstance";
import {DefineSenor,FridgeTemp,RoleModel,SensorApiItem,SensorModel,CreatFridgeAsset} from "@/types/settingdto";
import axios from "axios";
import { toast } from "sonner";

export async function addSensorCode(code: DefineSenor) {
    try {
        const response = await axiosInstance.post('/TemperatureUnit/SensorDefine',code);
        return response.data;
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            toast.error('Axios error adding sensor code', error.response?.data || error.message);
        } else {
            toast.error('Unexpected error adding sensor code');
        }
        throw error; 
    }
}

export const getAllSensorCode = async (): Promise<DefineSenor[]> => {
    try{
        const response = await axiosInstance.get<DefineSenor[]>(`/TemperatureUnit/SensorList`);
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


//for Dropdown

export const getSensorCode = async (): Promise<SensorModel[]> => {
  try {
    const response = await axiosInstance.get<SensorApiItem[]>('/TemperatureUnit/SensorCode');

    return response.data.map(sensor => ({
      sid: sensor.value
       }));
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      toast.error(error.response?.data || error.message);
    } else {
      toast.error('Unexpected error');
    }
    throw error;
  }
};


//Add Fridge assets

export async function addFridgeassets(code: CreatFridgeAsset) {
    try {
        const response = await axiosInstance.post('/TemperatureUnit/AddFridgeTemperature',code);
        return response.data;
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            toast.error('Axios error adding assets', error.response?.data || error.message);
        } else {
            toast.error('Unexpected error adding assets');
        }
        throw error; 
    }
}

//Get Fridge assets 

export const GetFridgeTemp = async (): Promise<FridgeTemp[]> => {
    try{
        const response = await axiosInstance.get<FridgeTemp[]>(`/TemperatureUnit/GetFridgeTemperature`);
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

//Add Role


export async function addRole(role: RoleModel) {
    try {
        const response = await axiosInstance.post('/Security/AddRole',role);
        return response.data;
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            toast.error('Axios error adding Role', error.response?.data || error.message);
        } else {
            toast.error('Unexpected error adding Role');
        }
        throw error; 
    }
}

export const getAllRoles = async (): Promise<RoleModel[]> => {
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
