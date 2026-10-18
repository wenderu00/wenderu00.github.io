import { before, test } from "node:test";
import assert from "node:assert/strict";
import { execSync } from "node:child_process";
import { existsSync, readFileSync, rmSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const outDir = path.join(root, "out");
const indexHtml = path.join(outDir, "index.html");

let html = "";

before(() => {
  rmSync(outDir, { recursive: true, force: true });
  execSync("npm run build", { cwd: root, stdio: "inherit" });
  html = existsSync(indexHtml) ? readFileSync(indexHtml, "utf8") : "";
});

test("build generates a static site in out/ for GitHub Pages", () => {
  assert.ok(existsSync(indexHtml), "out/index.html must exist");
  assert.match(html, /src="\/_next\/static\//, "assets must load from the site root");
});

test("page is in Brazilian Portuguese with the correct name", () => {
  assert.match(html, /<html[^>]*lang="pt-BR"/);
  assert.match(html, /<h1[^>]*>Márcio Wendell<\/h1>/);
  assert.doesNotMatch(html, /Wendel(?!l)/, "name must be spelled Wendell");
});

test("page has the three navigable sections", () => {
  for (const id of ["quem-sou", "o-que-faco", "trabalhos"]) {
    assert.match(html, new RegExp(`id="${id}"`), `section #${id}`);
    assert.match(html, new RegExp(`href="#${id}"`), `nav link to #${id}`);
  }
});

test("contact links are real and LinkedIn is not shown yet", () => {
  assert.match(html, /href="mailto:marcio\.wendell\.contact@gmail\.com"/);
  assert.match(html, /href="https:\/\/github\.com\/wenderu00"/);
  assert.doesNotMatch(html, /LinkedIn/);
  assert.doesNotMatch(html, /\[(SEU|LINK)/, "no design placeholders");
});

test("projects are listed", () => {
  for (const name of ["BioQuest", "COLI Sense", "mutcli", "XPomodoro", "prova-cli", "SpatialDev"]) {
    assert.ok(html.includes(name), name);
  }
});

test("profile photo is exported and referenced", () => {
  assert.ok(existsSync(path.join(outDir, "foto-marcio.jpg")));
  assert.match(html, /src="\/foto-marcio\.jpg"/);
});
