// ForumCategory entity type
export type ForumCategory = {
    _id: string;
    name: string;
    description: string;
    createdAt?: string;
    updatedAt?: string;
    __v?: number;
};

// API Response types
export type GetForumCategoryListResponse = {
    message: string;
    total: number;
    page: number;
    limit: number;
    data: ForumCategory[];
} | {
    data?: ForumCategory[];
    categories?: ForumCategory[];
    message?: string;
    success?: boolean;
};

export type GetForumCategoryListRequest = {
    page: number;
    limit: number;
    search?: string;
};

export type CreateForumCategoryRequest = {
    name: string;
    description: string;
};

export type UpdateForumCategoryRequest = {
    name: string;
    description: string;
};

export type ForumCategoryActionResponse = {
    message: string;
    success: boolean;
    data?: ForumCategory;
};
