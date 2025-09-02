export default function ButtonWhite({
  text,
  onClick,
  className,
  type = "button",
}) {
  return (
    <button
      className={`w-full border border-[#E9E9E9] bg-white text-[#686464] rounded-[10px] text-[16px] font-semibold py-3 h-[56px] hover:bg-gray-300 transition ${
        className || ""
      }`}
      onClick={onClick}
      type={type}
    >
      {text}
    </button>
  );
}
