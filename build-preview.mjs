// Generates a single-file standalone preview (preview.html) from the same
// source used by the Vite app. No build step / npm install required — just
// open preview.html in a browser.
//
// Note: a browser cannot fetch() a local JSON file over file://, so for the
// standalone preview we INLINE public/content.json as window.__CONTENT__.
// The real Vite app instead fetches /content.json at runtime, which is what
// lets you edit content without rebuilding or redeploying.
import { readFileSync, writeFileSync } from "node:fs";

const contentJson = readFileSync("./public/content.json", "utf8");

let app = readFileSync("./src/App.jsx", "utf8")
  .split("\n")
  .filter((l) => !/^\s*import\s/.test(l))
  .join("\n")
  .replace(/export\s+default\s+function\s+App/, "function App")
  .replace(/^\s*export\s+/gm, "");

// The import line (which also destructured the hooks) was stripped above, so
// re-bind the React hooks from the global UMD React for the standalone preview.
app =
  "const { useState, useEffect, useRef, createContext, useContext } = React\n" +
  app;

const css = readFileSync("./src/custom.css", "utf8");

const html = `<!doctype html>
<html lang="id">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Al Byan Agung Shafiqri — Portfolio</title>
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
<script src="https://unpkg.com/react@18/umd/react.production.min.js" crossorigin></script>
<script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js" crossorigin></script>
<script src="https://cdn.tailwindcss.com"></script>
<script>
  tailwind.config = {
    theme: { extend: {
      colors: { ink: "#1d1d1f", action: "#0066cc" },
      fontFamily: {
        sans: ["Inter","system-ui","-apple-system","BlinkMacSystemFont","SF Pro Text","sans-serif"],
        mono: ["JetBrains Mono","ui-monospace","SFMono-Regular","Menlo","monospace"],
      },
    } },
  }
</script>
<script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
<style>
${css}
</style>
</head>
<body>
<div id="root"></div>
<script>window.__CONTENT__ = ${contentJson};</script>
<script type="text/babel" data-presets="react">
${app}
ReactDOM.createRoot(document.getElementById("root")).render(<App />);
</script>
</body>
</html>
`;

writeFileSync("./preview.html", html);
console.log("preview.html written, bytes:", html.length);
