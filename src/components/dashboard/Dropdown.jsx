import { useRef, useEffect } from "react";
export default function Dropdown({
  label,
  placeholder,
  options = [],
  required,
  heading = "Select Choice",
  isOpen,
  onToggle,
  multiple = false,
  selected,
  setSelected,
  width = "w-[30px]",
  height = "h-[30px]",
  showIndicators = true,
}) {
  const dropdownRef = useRef(null);

  const handleSelect = (opt) => {
    if (multiple) {
      if (selected.some((s) => s.value === opt.value)) {
        setSelected(selected.filter((s) => s.value !== opt.value));
      } else {
        setSelected([...selected, opt]);
      }
    } else {
      setSelected(opt);
      onToggle();
    }
  };

  useEffect(() => {
    if (isOpen && dropdownRef.current) {
      setTimeout(() => {
        const element = dropdownRef.current;
        const rect = element.getBoundingClientRect();
        const scrollTarget =
          rect.top + window.pageYOffset - window.innerHeight * 0.2;

        window.scrollTo({ top: scrollTarget, behavior: "smooth" });
      }, 50);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target) &&
        isOpen
      ) {
        onToggle();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onToggle]);

  const displayText = () =>
    multiple
      ? selected.length > 0
        ? `${selected.length} selected`
        : placeholder
      : selected
      ? selected.label
      : placeholder;

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="block text-[14px] font-medium text-[#333333] mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      <div
        className="mt-1 w-full min-h-[48px] bg-white rounded-md px-3 flex items-center justify-between cursor-pointer"
        onClick={onToggle}
      >
        <span className="text-[14px] text-[#686464]">{displayText()}</span>
      </div>

      {isOpen && (
        <div className="fixed bottom-0 left-0 w-full bg-white rounded-t-[20px] shadow-lg border-t z-50 max-h-[70vh] overflow-y-auto">
          <div className="px-5 pt-4 text-[16px] font-medium text-black">
            {heading}
          </div>

          {options.map((opt) => {
            const isSelected = multiple
              ? selected.some((s) => s.value === opt.value)
              : selected?.value === opt.value;

            return (
              <div
                key={opt.value}
                className="flex items-center justify-between px-5 py-6 hover:bg-[#F5F5F5] cursor-pointer"
                onClick={() => handleSelect(opt)}
              >
                <div className="flex items-center space-x-2">
                  {opt.icon && (
                    <img src={opt.icon} className={`${width} ${height}`} />
                  )}
                  <span className="text-[14px]">{opt.label}</span>
                </div>

                {/* ✅ Only show circles if enabled */}
                {showIndicators && (
                  <span
                    className={`w-2 h-2 rounded-full border-2 flex items-center justify-center ${
                      isSelected
                        ? "border-[#A20BA2] bg-[#A20BA2]"
                        : "border-gray-400 bg-white"
                    }`}
                  >
                    {isSelected && (
                      <div className="w-[5px] h-[5px] rounded-full bg-white"></div>
                    )}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
