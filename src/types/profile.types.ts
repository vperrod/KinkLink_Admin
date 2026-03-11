export interface Profile {
    _id: string;
    role: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    profileImage: string | null;
    permissions?: string[];
}
