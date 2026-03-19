const Card = ({ title, icon: Icon, children, className = "" }) => {
  return (
    <section
      className={`rounded-2xl bg-white p-5 shadow-md transition-shadow duration-300 hover:shadow-lg ${className}`}
    >
      {(title || Icon) && (
        <div className="mb-4 flex items-center gap-2">
          {Icon && <Icon className="h-5 w-5 text-gray-600" />}
          {title && <h3 className="text-base font-semibold text-gray-900">{title}</h3>}
        </div>
      )}
      {children}
    </section>
  );
};

export default Card;
