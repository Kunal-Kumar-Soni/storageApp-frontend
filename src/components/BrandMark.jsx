import { FaCloud } from "react-icons/fa6";

export default function BrandMark({ className = "h-9 w-9" }) {
  return (
    <span
      className={`${className} grid shrink-0 place-items-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-600/25`}
    >
      <FaCloud className="text-base" aria-hidden="true" />
    </span>
  );
}
