export const adminProfileImage = (filename?: string | null) => {
    if (!filename) return "/images/user/owner.jpg";

    return `${import.meta.env.VITE_API_BASE_URL}/uploads/adminProfileImg/${filename}`;
};
