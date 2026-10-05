import fs from "fs";
import path from "path";

const clientDir = path.resolve("dist/client");
const assetsDir = path.join(clientDir, "assets");

if (!fs.existsSync(assetsDir)) {
  console.error("dist/client/assets directory does not exist!");
  process.exit(1);
}

const files = fs.readdirSync(assetsDir);
const cssFile = files.find((f) => f.endsWith(".css"));

// Find all index-*.js files (both entry and vendor chunks)
const indexJsFiles = files.filter((f) => f.startsWith("index-") && f.endsWith(".js"));

// Sort smallest first so entry script loads, or include all index-*.js scripts
indexJsFiles.sort((a, b) => {
  const sizeA = fs.statSync(path.join(assetsDir, a)).size;
  const sizeB = fs.statSync(path.join(assetsDir, b)).size;
  return sizeA - sizeB; // Smallest first (entry script is usually smaller than vendor chunk)
});

console.log(`Main CSS: ${cssFile}`);
console.log(`Found JS Chunks: ${indexJsFiles.join(", ")}`);

const jsTags = indexJsFiles
  .map((f) => `<script type="module" src="/assets/${f}"></script>`)
  .join("\n    ");

const htmlContent = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Arshio Digital Agency — All-in-One Creative & Digital Agency</title>
    <meta name="description" content="Full-service digital agency specializing in UI/UX Design, Video Editing, Digital Marketing, Web Development, and Mobile Apps." />
    <link rel="icon" type="image/png" href="/favicon.png" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,300..800;1,300..800&family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
    ${cssFile ? `<link rel="stylesheet" href="/assets/${cssFile}"></link>` : ""}
  </head>
  <body class="bg-[#070D1E] text-white antialiased">
    <div id="root"></div>
    ${jsTags}
  </body>
</html>
`;

// 1. Write to dist/client/index.html
fs.writeFileSync(path.join(clientDir, "index.html"), htmlContent, "utf-8");

// 2. Write to project root index.html so Nitro uses compiled index.html as renderer template!
fs.writeFileSync(path.resolve("index.html"), htmlContent, "utf-8");

// 3. Write to .vercel/output/static/index.html if .vercel/output/static exists
const vercelStaticDir = path.resolve(".vercel/output/static");
if (fs.existsSync(vercelStaticDir)) {
  fs.writeFileSync(path.join(vercelStaticDir, "index.html"), htmlContent, "utf-8");
}

console.log("Successfully updated index.html files with all compiled JS and CSS chunks!");
