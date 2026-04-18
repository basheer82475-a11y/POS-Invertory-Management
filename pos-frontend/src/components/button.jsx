// src/components/Button.jsx
export default function Button({ text, onClick, type = "primary" }) {
  const base = "px-4 py-2 rounded text-white";

  const styles = {
    primary: "bg-blue-500 hover:bg-blue-600",
    danger: "bg-red-500 hover:bg-red-600",
    success: "bg-green-500 hover:bg-green-600",
  };

  return (
    <button onClick={onClick} className={`${base} ${styles[type]}`}>
      {text}
    </button>
  );
}