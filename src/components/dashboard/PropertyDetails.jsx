export default function PropertyDetails({ list }) {
  if (!list || list.length === 0) return null;

  return (
    <div className="grid grid-cols-3 mt-[10px] w-full">
      {list.map((detail, index) => (
        <div
          key={detail.label}
          className={`flex flex-col py-1 w-full ${
            index % 3 === 1
              ? "ml-10 items-start" // center column nudged right
              : index % 3 === 2
              ? "items-end" // right column
              : "items-start" // left column
          }`}
        >
          {/* Label */}
          <span className="text-[12px] font-medium text-[#333333] mb-1">
            {detail.label}
          </span>

          {/* Icon + Value */}
          <div className="flex items-center space-x-1">
            <img
              src={detail.iconSrc}
              alt={detail.label}
              className="w-[19px] h-[18px] flex-shrink-0"
            />
            <span className="text-[11px] font-medium text-[#505050]">
              {detail.value}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
