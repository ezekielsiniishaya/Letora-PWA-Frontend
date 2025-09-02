export default function HouseRules({ list }) {
  if (!list || list.length === 0) return null;

  return (
    <div className="grid grid-cols-2 gap-x-[32px] gap-y-[16.93px] mt-[10px] w-full">
      {list.map((rule, index) => (
        <div
          key={rule.text}
          className={`flex items-center space-x-2 w-full ${
            index % 2 === 0 ? "justify-start" : "justify-end"
          }`}
        >
          <img
            src={rule.icon}
            alt={rule.text}
            className="w-4 h-4 flex-shrink-0"
          />
          <span className="text-[12px] text-[#505050] font-medium whitespace-nowrap">
            {rule.text}
          </span>
        </div>
      ))}
    </div>
  );
}
