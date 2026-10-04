import fs from "fs";
import path from "path";

function copyDirSync(src, dest) {
  if (!fs.existsSync(src)) return;
  fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDirSync(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

const clientDir = path.resolve("dist/client");
const vercelStaticDir = path.resolve(".vercel/output/static");

console.log("Copying dist/client files to .vercel/output/static...");
copyDirSync(clientDir, vercelStaticDir);
console.log("Successfully finalized Vercel static output!");
