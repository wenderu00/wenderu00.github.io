import { createReadStream, existsSync, statSync } from "node:fs";
import { createServer } from "node:http";
import path from "node:path";
import { chromium } from "@playwright/test";

const outDir = path.resolve(import.meta.dirname, "..", "out");
const pdfPath = path.join(outDir, "curriculo-marcio-wendell.pdf");

const types = { ".html": "text/html", ".css": "text/css", ".js": "text/javascript", ".woff2": "font/woff2" };

const server = createServer((req, res) => {
  const pathname = decodeURIComponent(new URL(req.url, "http://localhost").pathname);
  const file = [pathname, `${pathname}.html`, path.join(pathname, "index.html")]
    .map((candidate) => path.join(outDir, candidate))
    .find((candidate) => candidate.startsWith(outDir) && existsSync(candidate) && statSync(candidate).isFile());
  if (!file) {
    res.writeHead(404).end();
    return;
  }
  res.writeHead(200, { "Content-Type": types[path.extname(file)] ?? "application/octet-stream" });
  createReadStream(file).pipe(res);
});

await new Promise((resolve) => server.listen(0, resolve));
const browser = await chromium.launch();
try {
  const page = await browser.newPage();
  await page.goto(`http://localhost:${server.address().port}/curriculo`, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  await page.pdf({ path: pdfPath, preferCSSPageSize: true, printBackground: true });
  console.log(`CV gerado em ${path.relative(process.cwd(), pdfPath)}`);
} finally {
  await browser.close();
  server.close();
}
