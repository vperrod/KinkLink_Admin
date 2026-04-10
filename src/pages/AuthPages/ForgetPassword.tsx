
import ChangePassword from "../../components/auth/ResetPassword";
import AuthLayout from "./AuthPageLayout";


export default function SignIn() {
  return (
    <>
      <AuthLayout>
        <ChangePassword />
      </AuthLayout>

      {/* <main className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
          <ChangePassword />
        </main> */}


    </>
  );
}
