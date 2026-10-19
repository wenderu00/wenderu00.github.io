import { before, test } from "node:test";
import assert from "node:assert/strict";
import { execSync } from "node:child_process";
import { existsSync, readFileSync, readdirSync, rmSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const outDir = path.join(root, "out");
const indexHtml = path.join(outDir, "index.html");

let html = "";

function readCss() {
  const cssDir = path.join(outDir, "_next", "static");
  return readdirSync(cssDir, { recursive: true })
    .filter((f) => f.endsWith(".css"))
    .map((f) => readFileSync(path.join(cssDir, f), "utf8"))
    .join("\n");
}

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
  assert.match(html, /href="mailto:marcio\.wendell\.contact@gmail\.com"[^>]*>E-mail</, "short e-mail button");
  assert.match(html, />marcio\.wendell\.contact@gmail\.com</, "full address shown as text");
  assert.match(html, /href="https:\/\/github\.com\/wenderu00"/);
  assert.doesNotMatch(html, /LinkedIn/);
  assert.doesNotMatch(html, /\[(SEU|LINK)/, "no design placeholders");
});

test("projects are listed", () => {
  for (const name of ["BioQuest", "mutcli", "XPomodoro", "prova-cli", "SpatialDev", "The Galadur", "Semeadura de agentes"]) {
    assert.ok(html.includes(name), name);
  }
  assert.ok(!html.includes("RTS no navegador"), "RTS card is replaced by The Galadur");
  assert.ok(!html.includes("Phoenix LiveView"), "XPomodoro uses the public repo stack");
});

test("projects with public code link to it", () => {
  for (const href of [
    "https://github.com/wenderu00/XPomodoro",
    "https://wenderu00.github.io/XPomodoro/",
    "https://github.com/wenderu00/the-galadur",
    "https://wenderu00.github.io/the-galadur/",
    "https://github.com/wenderu00/requisitos-pipeline",
    "https://github.com/wenderu00/bdd-e2e-tester",
  ]) {
    assert.ok(html.includes(`href="${href}"`), href);
  }
});

test("stack is grouped", () => {
  for (const group of ["Front-end", "Back-end", "Qualidade", "Infra/CI"]) {
    assert.match(html, new RegExp(`>${group}<`), group);
  }
});

test("theme uses the MW channel yellow, not the old green", () => {
  const css = readCss().toLowerCase();
  assert.ok(css.includes("#ece41f"), "accent #ECE41F");
  assert.ok(!css.includes("#b8e86b"), "old green accent removed");
});

test("MW badge is the logo and the favicon", () => {
  assert.match(html, /aria-label="Márcio Wendell, início"/);
  assert.match(html, /<link rel="icon" href="\/icon\.svg/);
  assert.ok(!existsSync(path.join(outDir, "favicon.ico")), "template favicon removed");
});

test("link preview image is exported with an absolute URL", () => {
  const match = html.match(/<meta property="og:image" content="(https:\/\/wenderu00\.github\.io\/[^"]+)"/);
  assert.ok(match, "og:image meta with absolute URL");
  const file = new URL(match[1]).pathname.slice(1);
  assert.match(file, /\.png$/, "GitHub Pages sets the content type from the file extension");
  assert.ok(existsSync(path.join(outDir, file)), `out/${file} must exist`);
});

test("COLI Sense is not mentioned", () => {
  assert.doesNotMatch(html, /COLI|geotécnic/i);
});

test("location is Recife and the CTFL certification is not claimed", () => {
  assert.ok(html.includes("RECIFE, PE"), "hero location");
  assert.ok(html.includes("moro em Recife (PE)"), "about text");
  assert.match(html, /<meta name="description" content="[^"]*Recife \(PE\)/);
  assert.doesNotMatch(html, /Campina/);
  assert.doesNotMatch(html, /CTFL|ISTQB/);
});

test("profile photo is exported and referenced", () => {
  assert.ok(existsSync(path.join(outDir, "foto-marcio.jpg")));
  assert.match(html, /src="\/foto-marcio\.jpg"/);
});

test("skip link jumps to the main content", () => {
  assert.match(html, /<a[^>]*href="#conteudo"[^>]*>Pular para o conteúdo<\/a>/);
  assert.match(html, /<main[^>]*id="conteudo"/);
});

test("YouTube channel is linked in the hero and the footer", () => {
  const links = html.match(/href="https:\/\/www\.youtube\.com\/@MW_JS_Testing"/g) ?? [];
  assert.equal(links.length, 2);
});

test("404 page uses the MW identity", () => {
  const notFound = readFileSync(path.join(outDir, "404.html"), "utf8");
  assert.match(notFound, />404</);
  assert.match(notFound, /<a[^>]*href="\/"[^>]*aria-label="Márcio Wendell, início"|<a[^>]*aria-label="Márcio Wendell, início"[^>]*href="\/"/);
  assert.match(notFound, />Voltar ao início</);
});

test("styles cover focus, selection and motion preferences", () => {
  const css = readCss();
  assert.match(css, /::selection/);
  assert.match(css, /:focus-visible/);
  assert.match(css, /prefers-reduced-motion/);
  assert.match(css, /animation-timeline/);
});

test("typing line keeps its full text in the HTML", () => {
  assert.ok(html.includes("// disponível para projetos full-stack"));
});

test("stack has its own section in the menu", () => {
  assert.match(html, /<section id="stack"/);
  assert.match(html, /href="#stack"/);
});

test("pipeline motion graphic lists the delivery steps", () => {
  for (const step of ["Requisito", "Teste BDD", "Código", "Deploy"]) {
    assert.match(html, new RegExp(`>${step}<`), step);
  }
});
