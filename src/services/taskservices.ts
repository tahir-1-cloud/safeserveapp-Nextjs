import axiosInstance from "@/services/axiosInstance";
import {TaskCreatModel,TaskDetailsViewModel} from "@/types/taskManagement";
import axios from "axios";
import { toast } from "sonner";


export async function createTask(task: TaskCreatModel) {
    try {
        const response = await axiosInstance.post('/TaskManagement/TaskCreation',task);
        return response.data;
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            toast.error('Axios error adding Task', error.response?.data || error.message);
        } else {
            toast.error('Unexpected error adding Task');
        }
        throw error; 
    }
}

export const getAllTasks = async (): Promise<TaskDetailsViewModel[]> => {
        try{
            const response = await axiosInstance.get<TaskDetailsViewModel[]>(`/TaskManagement/GetTaskList`);
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