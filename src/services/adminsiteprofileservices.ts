import axiosInstance from "@/services/axiosInstance";
import {StaffdetailModel} from "@/types/adminsiteprofiledto";
import axios from "axios";
import { toast } from "sonner";

export async function getStaffById(id: number) {
  try {
    const response = await axiosInstance.get(`/Staff/GetStaffById/${id}`);
    return response.data;
  } catch (error: any) {
    toast.error("Error fetching staff:", error);
    throw error;
  }
}