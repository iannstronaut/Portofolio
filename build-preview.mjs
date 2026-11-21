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
  "const { useState, useEffect, useLayoutEffect, useRef } = React\n" +
  app;

const css = readFileSync("./src/custom.css", "utf8");

const html = `<!doctype html>
<html lang="id">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<link rel="icon" type="image/svg+xml" href="./public/favicon.svg" />
<title>Al Byan Agung Shafiqri — Portfolio</title>
<meta name="description" content="Portfolio Al Byan Agung Shafiqri, Fullstack Developer & ML/DL Enthusiast." />
<link rel="canonical" href="https://iannstr.com/" />
<meta property="og:type" content="website" />
<meta property="og:url" content="https://iannstr.com/" />
<meta property="og:site_name" content="Al Byan Agung Shafiqri" />
<meta property="og:title" content="Al Byan Agung Shafiqri — Portfolio" />
<meta property="og:description" content="Portfolio Al Byan Agung Shafiqri, Fullstack Developer & ML/DL Enthusiast." />
<meta name="twitter:card" content="summary" />
<meta name="twitter:title" content="Al Byan Agung Shafiqri — Portfolio" />
<meta name="twitter:description" content="Portfolio Al Byan Agung Shafiqri, Fullstack Developer & ML/DL Enthusiast." />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400..700&amp;family=JetBrains+Mono:wght@400;500;600&amp;display=swap" rel="stylesheet" />
<script src="https://unpkg.com/react@18/umd/react.production.min.js" crossorigin></script>
<script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js" crossorigin></script>
<script src="https://unpkg.com/@babel/standalone@7.28.5/babel.min.js"></script>
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
