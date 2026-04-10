import { useRef, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams, useNavigate, useSearchParams } from "react-router";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";

import Button from "../../components/ui/button/Button";
import { loginVerifyOtpApi, verifyOtpApi, resendOtpApi } from "../../api/authapi";
import { setAuthSuccess } from "../../store/auth.slice";

type OtpFormValues = {
  otp: string[];
};

const RESEND_TIME = 30;

const OtpVerification = () => {
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const flow = searchParams.get("flow");

  const [timer, setTimer] = useState(RESEND_TIME);
  const [resending, setResending] = useState(false);

  const {
    handleSubmit,
    setValue,
    watch,
    reset,
  } = useForm<OtpFormValues>({
    defaultValues: { otp: ["", "", "", "", "", ""] },
  });


  const otpValues = watch("otp");

  /* ================= RESEND TIMER ================= */
  useEffect(() => {
    if (timer === 0) return;

    const interval = setInterval(() => {
      setTimer((t) => t - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  /* ================= VERIFY OTP ================= */
  const onSubmit = async (data: OtpFormValues) => {
    const otp = data.otp.join("");

    if (!id || otp.length !== 6) {
      toast.error("Invalid OTP");
      return;
    }

    try {
      const apiCall =
        flow === "login" ? loginVerifyOtpApi : verifyOtpApi;

      const res = await apiCall(id!, { otp });

      toast.success(res.message);

      if (flow === "login") {
        localStorage.setItem("token", res.token);
        dispatch(setAuthSuccess({ token: res.token }));
        navigate("/");
      } else {
        navigate(`/change-password/${res.token}`);
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "OTP verification failed");
    }

  };


  /* ================= RESEND OTP ================= */
  const handleResendOtp = async () => {
    if (!id) return;

    try {
      setResending(true);
      const res = await resendOtpApi(id);

      toast.success(res.message || "OTP resent successfully");

      reset({ otp: ["", "", "", "", "", ""] });
      inputsRef.current[0]?.focus();
      setTimer(RESEND_TIME);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to resend OTP");
    } finally {
      setResending(false);
    }
  };

  const handleChange = (value: string, index: number) => {
    if (!/^\d?$/.test(value)) return;
    setValue(`otp.${index}`, value);
    if (value && index < 5) inputsRef.current[index + 1]?.focus();
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace" && !otpValues[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  return (
    <div className="flex flex-1 items-center justify-end">
      <div className="w-full max-w-md text-center">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="p-6 bg-white rounded-lg shadow-theme-xs dark:bg-gray-900"
        >
          <h1 className="mb-2 text-xl font-bold">
            {flow === "login"
              ? "Login Verification"
              : "Reset Password Verification"}
          </h1>

          <p className="mb-6 text-sm text-gray-500">
            Enter the 6-digit code sent to your email
          </p>

          {/* OTP INPUTS */}
          <div className="flex justify-between gap-2 mb-4">
            {otpValues.map((_, index) => (
              <input
                key={index}
                ref={(el) => {
                  inputsRef.current[index] = el;
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={otpValues[index]}
                onChange={(e) => handleChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className="h-12 w-12 rounded-lg border text-center text-lg font-semibold focus:ring-2 focus:ring-brand-500/20"
              />
            ))}
          </div>

          <Button type="submit" className="w-full mb-3">
            Verify OTP
          </Button>

          {/* RESEND OTP */}
          <button
            type="button"
            disabled={timer > 0 || resending}
            onClick={handleResendOtp}
            className="text-sm text-brand-600 disabled:text-gray-400"
          >
            {timer > 0
              ? `Resend OTP in ${timer}s`
              : resending
                ? "Resending..."
                : "Resend OTP"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default OtpVerification;
