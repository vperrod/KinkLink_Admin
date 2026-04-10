// API Error Type
export interface ApiError {
    response?: {
        data?: {
            message?: string;
        };
        status?: number;
    };
    message?: string;
}

// Helper function to extract error message
export const getErrorMessage = (error: unknown): string => {
    const apiError = error as ApiError;
    return (
        apiError?.response?.data?.message ||
        apiError?.message ||
        "An unexpected error occurred"
    );
};
