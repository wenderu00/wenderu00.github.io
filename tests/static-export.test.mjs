import { test } from "node:test";
import assert from "node:assert/strict";
import { execSync } from "node:child_process";
import { existsSync, readFileSync, rmSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const outDir = path.join(root, "out");

test("build generates a static site in out/ for GitHub Pages", () => {
  rmSync(outDir, { recursive: true, force: true });
  execSync("npm run build", { cwd: root, stdio: "inherit" });

  const indexHtml = path.join(outDir, "index.html");
  assert.ok(existsSync(indexHtml), "out/index.html must exist");

  const html = readFileSync(indexHtml, "utf8");
  assert.match(html, /src="\/_next\/static\//, "assets must load from the site root");
});
