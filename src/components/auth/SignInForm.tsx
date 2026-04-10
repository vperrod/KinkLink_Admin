import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { useForm, Controller } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { login } from "../../store/auth.slice";
import toast from "react-hot-toast";

import { EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Checkbox from "../form/input/Checkbox";
import Button from "../ui/button/Button";

type LoginFormValues = {
  email: string;
  password: string;
  rememberMe: boolean;
};

export default function SignInForm() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);


  const { loading, error, adminId } = useAppSelector(
    (state) => state.auth
  );

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<LoginFormValues>({
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = (data: LoginFormValues) => {
    // Handle remember me - save/remove email from localStorage
    if (data.rememberMe) {
      localStorage.setItem("savedEmail", data.email);
    } else {
      localStorage.removeItem("savedEmail");
    }

    // Temporarily save preference so it survives a refresh on the OTP page
    sessionStorage.setItem("temp_remember_me", JSON.stringify(data.rememberMe));

    dispatch(login(data));
  };

  //  Load saved email on mount
  useEffect(() => {
    const savedEmail = localStorage.getItem("savedEmail");
    if (savedEmail) {
      setValue("email", savedEmail);
      setValue("rememberMe", true);
    }
  }, [setValue]);

  //  Success / Error handling

  useEffect(() => {
    if (adminId) {
      navigate(`/login-verify-otp/${adminId}?flow=login`);
    }

    if (error) {
      toast.error(error);
    }
  }, [adminId, error, navigate]);

  return (
    <div className="flex flex-1 items-center justify-end">
      <div className="flex flex-col w-full max-w-md bg-white/80 dark:bg-gray-900/80 px-6 py-12 rounded-lg shadow-lg">
        <div className="mb-6 text-center">
          <img
            className="mx-auto mb-4"
            src="../../images/logo/Mainlogo.png"
            alt="Logo"
            width={150}
          />
          <h1 className="font-bold text-title-sm">Sign In</h1>
          <p className="text-sm text-gray-500">
            Enter your email and password to sign in
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Email */}
          <div>
            <Label>Email *</Label>
            <Input
              {...register("email", { required: "Email is required" })}
            />
            {errors.email && (
              <p className="text-xs text-red-500">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <Label>Password *</Label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                {...register("password", {
                  required: "Password is required",
                })}
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
              >
                {showPassword ? (
                  <EyeIcon className="size-5 fill-gray-500 dark:fill-gray-400" />
                ) : (
                  <EyeCloseIcon className="size-5 fill-gray-500 dark:fill-gray-400" />
                )}
              </span>
            </div>
          </div>

          {/* Remember Me */}
          <label className="flex items-center gap-3">
            <Controller
              name="rememberMe"
              control={control}
              render={({ field }) => (
                <Checkbox checked={field.value} onChange={field.onChange} />
              )}
            />
            <span className="text-sm">Keep me logged in</span>
          </label>

          {/* Submit */}
          <Button className="w-full" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </Button>

          <Link
            to="/reset-password"
            className="text-sm text-brand-500"
          >
            Forgot password?
          </Link>
        </form>
      </div>
    </div>
  );
}
