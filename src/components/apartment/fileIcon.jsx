// utils/fileIcons.js
export const getDocumentIcon = (doc) => {
  let url = "";
  let name = "";

  if (typeof doc === "string") {
    url = doc;
    name = doc;
  } else if (typeof doc === "object") {
    url = doc.url || "";
    name = doc.name || "";
  }

  // === FIXED EXTENSION EXTRACTION ===
  let ext = "";

  // 1. Try URL
  const urlPart = url.split("/").pop();
  const urlExt = urlPart.includes(".")
    ? urlPart.split(".").pop().toLowerCase()
    : "";
  if (urlExt) ext = urlExt;

  // 2. Fallback to name if URL fails
  if (!ext && name) {
    const namePart = name.split("/").pop();
    const nameExt = namePart.includes(".")
      ? namePart.split(".").pop().toLowerCase()
      : "";
    if (nameExt) ext = nameExt;
  }

  console.log("📝 Final detected extension:", ext);

  // === ICON MAP ===
  if (["jpg", "jpeg", "png", "gif", "bmp", "webp"].includes(ext)) {
    return "/icons/camera.svg";
  }

  if (ext === "pdf") {
    return "/icons/pdf.svg";
  }

  if (["doc", "docx"].includes(ext)) {
    return "/icons/doc.svg";
  }

  if (["xls", "xlsx"].includes(ext)) {
    return "/icons/excel.svg";
  }

  if (["ppt", "pptx"].includes(ext)) {
    return "/icons/ppt.svg";
  }

  return "/icons/file.svg"; // default
};
