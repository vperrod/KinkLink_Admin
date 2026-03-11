import axiosInstance from "../utils/axios";
import { API_ROUTES } from "../config/api";

export interface SubAdminPayload {
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  permissions: string[];
  phone: string;
}

export const createSubadminApi = async (payload: SubAdminPayload) => {
  const res = await axiosInstance.post(API_ROUTES.ADMIN.CREATE_SUBADMIN, payload);
  return res.data;
};

export const getSubadminsApi = async () => {
    const res = await axiosInstance.get(API_ROUTES.ADMIN.GET_SUBADMINS);
    return res.data;
}

export const deleteSubadminApi = async (id: string) => {
    const res = await axiosInstance.delete(API_ROUTES.ADMIN.DELETE_SUBADMIN(id));
    return res.data;
}

export const updateSubadminApi = async (id: string, payload: Partial<SubAdminPayload>) => {
    const res = await axiosInstance.put(API_ROUTES.ADMIN.UPDATE_SUBADMIN(id), payload);
    return res.data;
}
