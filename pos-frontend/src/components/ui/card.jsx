export function Card({ children, className = "", onClick }) {
  const Component = onClick ? "button" : "div";
  return (
    <Component
      onClick={onClick}
      className={`border rounded-lg p-4 bg-white shadow hover:shadow-md ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      {children}
    </Component>
  );
}

export function CardContent({ children, className = "" }) {
  return <div className={className}>{children}</div>;
}
