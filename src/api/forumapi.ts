import axiosInstance from "../utils/axios";
import { API_ROUTES } from "../config/api";
import {
    GetForumCategoryListResponse,
    CreateForumCategoryRequest,
    GetForumCategoryListRequest,
    UpdateForumCategoryRequest,
    ForumCategoryActionResponse,
} from "../types/forum.types";

/* ===================== API FUNCTIONS ===================== */

//  GET ALL FORUM CATEGORIES
export const getForumCategoryListApi = async (params?: GetForumCategoryListRequest): Promise<GetForumCategoryListResponse> => {
    const res = await axiosInstance.get<GetForumCategoryListResponse>(
        API_ROUTES.FORUMS.GET_LIST,
        { params }
    );
    return res.data;
};

//  CREATE FORUM CATEGORY
export const createForumCategoryApi = async (
    data: CreateForumCategoryRequest
): Promise<ForumCategoryActionResponse> => {
    const res = await axiosInstance.post<ForumCategoryActionResponse>(
        API_ROUTES.FORUMS.ADD,
        data
    );
    return res.data;
};

//  UPDATE FORUM CATEGORY
export const updateForumCategoryApi = async (
    id: string,
    data: UpdateForumCategoryRequest
): Promise<ForumCategoryActionResponse> => {
    const res = await axiosInstance.put<ForumCategoryActionResponse>(
        API_ROUTES.FORUMS.UPDATE(id),
        data
    );
    return res.data;
};

//  DELETE FORUM CATEGORY
export const deleteForumCategoryApi = async (
    id: string
): Promise<ForumCategoryActionResponse> => {
    const res = await axiosInstance.delete<ForumCategoryActionResponse>(
        API_ROUTES.FORUMS.DELETE(id)
    );
    return res.data;
};
