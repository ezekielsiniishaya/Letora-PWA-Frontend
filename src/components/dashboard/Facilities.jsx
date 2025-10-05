export default function Facilities({ list }) {
  if (!list || list.length === 0) return null;

  return (
    <div className="grid grid-cols-3 gap-3 mt-[10px] w-full">
      {list.map((f) => (
        <div
          key={f.text}
          className="flex items-center justify-start space-x-2 w-full min-w-0"
        >
          <img
            src={f.icon}
            alt={f.text}
            className="w-4 h-4 flex-shrink-0"
            onError={(e) => {
              e.target.src = "/icons/default-facility.svg";
            }}
          />
          <span className="text-[12px] font-medium text-[#505050] whitespace-nowrap overflow-hidden text-ellipsis min-w-0 flex-1">
            {f.text}
          </span>
        </div>
      ))}
    </div>
  );
}
