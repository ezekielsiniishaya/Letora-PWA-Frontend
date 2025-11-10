export default function ShowSuccess({
  image,
  heading,
  message,
  buttonText = "Okay",
  onClose,
  onConfirm,
  height,
  imgHeight = "h-[74.93px]",
  width = "w-[141.84px]",
  confirmMode = false,
  button = true,
  noButton = false, // Add this new prop
}) {
  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-[8.71px] p-6 w-[300px] text-center mx-4"
        style={{ height: height || "auto" }}
        onClick={(e) => e.stopPropagation()}
      >
        {image && (
          <img
            src={image}
            alt="Modal"
            className={`${width} ${imgHeight} mx-auto mb-[24px]`}
            onError={(e) => {
              e.target.style.display = "none";
            }}
          />
        )}

        {heading && (
          <h3
            className={`text-[14px] font-medium mb-[10px] ${
              confirmMode ? "text-[#333333]" : "text-[#1A1A1A]"
            }`}
          >
            {heading}
          </h3>
        )}

        {message && (
          <p className="text-[12px] text-[#686464] w-[238px] mx-auto mb-[20px]">
            {message}
          </p>
        )}

        {/* Buttons */}
        {button &&
          !noButton && // Add noButton condition here
          (confirmMode ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onConfirm?.();
              }}
              className="w-full rounded-[10px] h-[49.83px] text-[13px] py-3 bg-[#F81A0C] text-white font-semibold hover:bg-red-700 transition-colors"
            >
              Confirm
            </button>
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation();
                (onConfirm || onClose)?.();
              }}
              className="w-full rounded-[10px] text-[13px] h-[49.83px] py-3 bg-[#A20BA2] text-white font-semibold hover:bg-[#8A0A8A] transition-colors"
            >
              {buttonText}
            </button>
          ))}
      </div>
    </div>
  );
}
