// utils/fileIcons.js
export const getDocumentIcon = (filename) => {
  const ext = filename.split(".").pop().toLowerCase();

  if (["jpg", "jpeg", "png", "gif", "bmp", "webp"].includes(ext)) {
    return "/icons/camera.svg"; // Your image icon
  }

  if (ext === "pdf") {
    return "/icons/pdf.svg"; // Your PDF icon
  }

  // Default document icon
  return "/icons/document.svg";
};
