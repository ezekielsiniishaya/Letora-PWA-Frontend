export default function Button({ text, onClick, className, type = "button" }) {
  return (
    <button
      className={`w-full bg-[#A20BA2] rounded-[10px] text-[16px] text-white font-semibold py-3 h-[56px] ${
        className || ""
      }`}
      onClick={onClick}
      type={type}
    >
      {text}
    </button>
  );
}
