import { useProfile } from "../context/ProfileContext";

export const usePermissions = () => {
  const { profile } = useProfile();

  const hasPermission = (permission: string) => {
    if (!profile) return false;
    // Super admin has full access
    if (profile.role === "Admin" || profile.role === "Admin") return true;

    return profile.permissions?.includes(permission) || false;
  };

  const isSuperAdmin = () => {
    return profile?.role === "Admin" || profile?.role === "Admin";
  };

  return { hasPermission, isSuperAdmin, profile };
};
