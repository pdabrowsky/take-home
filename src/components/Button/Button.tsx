import { forwardRef } from "react";
import { ButtonProps } from "./Button.types";

const variantStyles = {
  primary:
    "bg-blue-600 hover:bg-blue-700 text-white border-transparent shadow-sm hover:shadow-md disabled:bg-blue-400",
  secondary:
    "bg-white hover:bg-gray-50 text-gray-700 border-gray-300 shadow-sm hover:shadow-md disabled:bg-gray-100",
  danger:
    "bg-red-600 hover:bg-red-700 text-white border-transparent shadow-sm hover:shadow-md disabled:bg-red-400",
  ghost:
    "bg-transparent hover:bg-gray-100 text-gray-700 border-transparent disabled:bg-gray-50",
};

const sizeStyles = {
  sm: "px-2 py-1.5 text-xs",
  md: "px-4 py-2 text-sm",
  lg: "px-6 py-3 text-base",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      loading = false,
      disabled = false,
      fullWidth = false,
      className = "",
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer disabled:cursor-not-allowed";

    const variantClasses = variantStyles[variant];
    const sizeClasses = sizeStyles[size];
    const widthClasses = fullWidth ? "w-full" : "";

    const finalClassName = [
      baseStyles,
      variantClasses,
      sizeClasses,
      widthClasses,
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={finalClassName}
        {...props}
      >
        {loading ? (
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
            {typeof children === "string" ? `${children}...` : children}
          </div>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = "Button";
