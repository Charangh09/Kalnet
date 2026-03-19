import { Loader2 } from "lucide-react";

const Button = ({ loading = false, disabled = false, children, className = "", ...props }) => {
  const isDisabled = loading || disabled;

  return (
    <button
      disabled={isDisabled}
      className={`inline-flex items-center justify-center gap-2 rounded-xl bg-gray-900 px-5 py-3 text-sm font-semibold text-white transition-all duration-300 hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
      {...props}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
};

export default Button;
