import { Navigate, Outlet } from "react-router";
import { usePermissions } from "../hooks/usePermissions";

interface PermissionRouteProps {
  permission: string;
}

const PermissionRoute: React.FC<PermissionRouteProps> = ({ permission }) => {
  const { hasPermission, profile } = usePermissions();

  if (!profile) {
    return <div className="flex items-center justify-center min-h-screen">Loading permissions...</div>;
  }

  if (!hasPermission(permission)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default PermissionRoute;
