export default function Button({ text, onClick, className }) {
  return (
    <button
      className={`w-full bg-[#A20BA2] rounded-[10px] text-[16px] text-white font-semibold py-3 h-[56px] hover:bg-[#8a098a] transition ${
        className || ""
      }`}
      onClick={onClick}
      type="button"
    >
      {text}
    </button>
  );
}
