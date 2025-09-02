export default function Facilities({ list }) {
  if (!list || list.length === 0) return null;

  return (
    <div className="grid grid-cols-3 gap-x-[32px] gap-y-3 mt-[10px] w-full">
      {list.map((f, index) => (
        <div
          key={f.text}
          className={`flex items-center space-x-[16.93px] w-full ${
            index % 3 === 1
              ? "ml-4 items-start" // center column nudged right
              : index % 3 === 2
              ? "justify-end items-center" // right column
              : "items-start" // left column
          }`}
        >
          <img src={f.icon} alt={f.text} className="w-4 h-4 flex-shrink-0" />
          <span className="text-[12px] font-medium text-[#505050] whitespace-nowrap">
            {f.text}
          </span>
        </div>
      ))}
    </div>
  );
}
