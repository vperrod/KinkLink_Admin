import { ReactNode, MouseEvent } from "react";

interface ButtonProps {
  children: ReactNode; // Button text or content
  size?: "sm" | "md"; // Button size
  variant?: "primary" | "outline"; // Button variant
  startIcon?: ReactNode; // Icon before the text
  endIcon?: ReactNode; // Icon after the text
  onClick?: (e?: MouseEvent<HTMLButtonElement>) => void; // Click handler
  disabled?: boolean; // Disabled state
  className?: string; // Disabled state
  type?: "button" | "submit" | "reset";
}

const Button: React.FC<ButtonProps> = ({
  children,
  size = "md",
  variant = "primary",
  startIcon,
  endIcon,
  onClick,
  className = "",
  disabled = false,
}) => {
  // Size Classes
  const sizeClasses = {
    sm: "px-4 py-3 text-sm",
    md: "px-5 py-3.5 text-sm",
  };

  // Variant Classes
  const variantClasses = {
    primary:
      "bg-brand-500 text-white shadow-theme-xs " +
      "hover:bg-white hover:text-brand-500 hover:ring-1 hover:ring-brand-500 " +
      "active:bg-brand-600 active:text-white " +
      "disabled:bg-brand-500 disabled:text-white disabled:cursor-not-allowed",

    outline:
      "bg-white text-brand-500 ring-1 ring-brand-500 " +
      "hover:bg-brand-500 hover:text-white " +
      "active:bg-brand-600 active:text-white " +
      "disabled:bg-brand-500 disabled:text-white disabled:cursor-not-allowed",
  };

  return (
    <button

      className={`inline-flex items-center justify-center gap-2 rounded-lg transition ${className} ${sizeClasses[size]
        } ${variantClasses[variant]} ${disabled ? "cursor-not-allowed opacity-50" : ""
        }`}

      onClick={onClick}

      disabled={disabled}
    >
      {startIcon && <span className="flex items-center">{startIcon}</span>}
      {children}
      {endIcon && <span className="flex items-center">{endIcon}</span>}
    </button>
  );
};

export default Button;
