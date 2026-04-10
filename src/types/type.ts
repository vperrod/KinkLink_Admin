export interface UserProfile {
    id: string;
    firstName: string;
    lastName?: string;
    email: string;
    phone?: string;
    image?: string;
    role?: string;

    // address
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    zipCode?: string;
}
