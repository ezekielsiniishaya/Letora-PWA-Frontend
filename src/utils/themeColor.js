// src/utils/themeColor.js

// Converts rgb(a) color to hex
export function rgb2hex(rgb) {
  const result = rgb.match(/\d+/g);
  if (!result) return "#F9F9F9"; // default to white instead of purple
  return (
    "#" +
    result
      .slice(0, 3)
      .map((x) => (+x).toString(16).padStart(2, "0"))
      .join("")
  );
}

// Sets meta[name="theme-color"] to body's background
export function updateThemeColorFromBody() {
  const bg = window.getComputedStyle(document.body).backgroundColor;
  const hex = rgb2hex(bg);
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute("content", hex);
}
