export default function PurpleButton({ text }) {
  return (
    <button className="w-full bg-[#A20BA2] text-[16px] text-white font-semibold py-3 h-[56px] rounded-md hover:bg-[#8a098a] transition">
      {text}
    </button>
  );
}
