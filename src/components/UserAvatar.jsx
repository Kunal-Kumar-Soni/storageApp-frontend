export default function UserAvatar({ name = "User", className = "h-10 w-10" }) {
  const initial = name.trim().charAt(0).toUpperCase() || "U";
  return (
    <span
      className={`${className} grid place-items-center rounded-full bg-blue-100 text-xs font-bold text-blue-700`}
    >
      {initial}
    </span>
  );
}
