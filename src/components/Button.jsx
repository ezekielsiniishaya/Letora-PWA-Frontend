export default function Button({
  text,
  onClick,
  className,
  type = "button",
  icon, // optional icon path
}) {
  return (
    <button
      className={`w-full bg-[#A20BA2] rounded-[10px] text-[16px] text-white font-semibold py-3 h-[56px] flex items-center justify-center gap-2 ${
        className || ""
      }`}
      onClick={onClick}
      type={type}
    >
      {icon && <img src={icon} alt="" className="w-4 h-4" />}
      <span>{text}</span>
    </button>
  );
}
