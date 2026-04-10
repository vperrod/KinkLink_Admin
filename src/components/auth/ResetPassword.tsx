import { useForm } from "react-hook-form";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Button from "../ui/button/Button";
import { LockIcon } from "../../icons";
import { forgotPasswordApi } from "../../api/authapi";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";

type ChangePasswordFormValues = {
  email: string;
};

const ChangePassword = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ChangePasswordFormValues>({
    defaultValues: {
      email: "",
    },
  });

  const navigate = useNavigate();

  const onSubmit = async (data: ChangePasswordFormValues) => {
    try {
      const res = await forgotPasswordApi({ email: data.email });

      toast.success(res.message);
      navigate(`/verify-otp/${res.id}?flow=reset`);
    } catch (error: any) {
      toast.error(error?.response?.data?.message);
    }
  };

  return (
    <div className="flex flex-1 items-center justify-end">
      <div className="w-full max-w-md p-10 space-y-6 bg-white rounded-lg shadow-theme-xs dark:bg-gray-900">
        <div className="mb-6 text-center">
          <LockIcon className="w-10 h-10 mx-auto text-brand-500 mb-3" />
          <h1 className="mb-2 text-xl font-bold text-gray-800 dark:text-white">
            Change Password
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Enter your registered email to receive password reset instructions
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className=""
        >
          {/* Email */}
          <div className="mb-5">
            <Label>
              Email <span className="text-error-500">*</span>
            </Label>
            <Input
              type="email"
              placeholder="info@gmail.com"
              error={!!errors.email}
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: "Enter a valid email address",
                },
              })}
            />
            {errors.email && (
              <p className="mt-1 text-xs text-error-500">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Submit */}
          <button type="submit" className="w-full">
            <Button className="w-full">
              Send OTP
            </Button>
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
