export default function ShowSuccess({
  image,
  heading,
  message,
  buttonText = "Okay",
  onClose,
  height,
  width = "w-[141.84px]",
}) {
  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className={`bg-white rounded-2xl shadow-lg p-6 w-[290px] text-center mx-4`}
        style={{ height: height || "auto" }}
        onClick={(e) => e.stopPropagation()}
      >
        {image && (
          <img
            src={image}
            alt="Success"
            className={`${width} h-[74.93px] mx-auto mb-[24px]`}
            onError={(e) => {
              e.target.style.display = "none";
            }}
          />
        )}

        {heading && (
          <h3 className="text-[14px] font-medium text-[#1A1A1A] mb-[10px]">
            {heading}
          </h3>
        )}

        {message && (
          <p className="text-[12px] text-[#666666] w-[238px] mx-auto mb-[20px]">
            {message}
          </p>
        )}

        <button
          onClick={onClose}
          className="w-full rounded-[10px] py-3 bg-[#A20BA2] text-white font-medium hover:bg-[#8A0A8A] transition-colors"
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
}
