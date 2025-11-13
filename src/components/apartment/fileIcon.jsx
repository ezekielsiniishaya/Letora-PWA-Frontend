// utils/fileIcons.js
export const getDocumentIcon = (doc) => {
  // Handle both string (backward compatibility) and object inputs
  let url = "";
  let name = "";

  if (typeof doc === "string") {
    url = doc;
    name = doc;
  } else if (typeof doc === "object") {
    url = doc.url || "";
    name = doc.name || "";
  }

  console.log("🔍 Processing document:", { name, url }); // Debug log

  if (!url) {
    console.log("❌ No URL found, returning default");
    return "/icons/pdf.svg";
  }

  // Extract extension from URL
  const urlParts = url.split("/").pop().split(".");
  const ext = urlParts.length > 1 ? urlParts.pop().toLowerCase() : "";

  console.log("📝 Detected extension from URL:", ext); // Debug log

  if (["jpg", "jpeg", "png", "gif", "bmp", "webp"].includes(ext)) {
    console.log("🖼️ Returning image icon");
    return "/icons/camera.svg";
  }

  if (ext === "pdf") {
    console.log("📄 Returning PDF icon");
    return "/icons/pdf.svg";
  }

  console.log("❓ No matching extension, returning default");
  return "/icons/pdf.svg";
};
