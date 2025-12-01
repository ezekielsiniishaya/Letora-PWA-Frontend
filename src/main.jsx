import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { updateThemeColorFromBody } from "./utils/themeColor.js";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);

// Call after initial render so body styles are applied
window.addEventListener("load", () => {
  updateThemeColorFromBody();
});
