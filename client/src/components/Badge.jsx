const badgeVariants = {
  green: "bg-green-100 text-green-700",
  yellow: "bg-yellow-100 text-yellow-700",
  red: "bg-red-100 text-red-700"
};

const Badge = ({ variant = "yellow", children }) => {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${badgeVariants[variant] || badgeVariants.yellow}`}
    >
      {children}
    </span>
  );
};

export default Badge;
