import { expect, test } from "@playwright/test";

test("menu marks the section on screen as current", async ({ page }) => {
  await page.goto("/#trabalhos");
  const nav = page.getByRole("navigation", { name: "Seções" });

  await expect(nav.getByRole("link", { name: "04 Trabalhos" })).toHaveAttribute("aria-current", "true");
  await expect(nav.getByRole("link", { name: "01 Quem sou eu" })).not.toHaveAttribute("aria-current", "true");

  await page.evaluate(() => document.getElementById("quem-sou")?.scrollIntoView({ behavior: "instant" }));

  await expect(nav.getByRole("link", { name: "01 Quem sou eu" })).toHaveAttribute("aria-current", "true");
  await expect(nav.getByRole("link", { name: "04 Trabalhos" })).not.toHaveAttribute("aria-current", "true");
});

test("console greets curious developers", async ({ page }) => {
  const messages: string[] = [];
  page.on("console", (message) => messages.push(message.text()));

  await page.goto("/");

  await expect.poll(() => messages.join("\n")).toContain("MW");
  expect(messages.join("\n")).toContain("marcio.wendell.contact@gmail.com");
});

test("hero and typing line animate by default", async ({ page }) => {
  await page.goto("/");

  const animation = (selector: string) =>
    page.locator(selector).first().evaluate((el) => getComputedStyle(el).animationName);

  expect(await animation("h1")).toBe("lift");
  expect(await animation(".typing")).toBe("type, blink");
});

test("motion graphics run by default", async ({ page }) => {
  await page.goto("/");

  await expect(page.locator("#topo canvas")).toBeVisible();
  await expect(page.locator(".hero-backdrop")).toHaveAttribute("data-live", "true");
  expect(await page.locator(".marquee-track").evaluate((el) => getComputedStyle(el).animationName)).toBe("marquee");

  await page.locator("#o-que-faco figure").first().scrollIntoViewIfNeeded();
  await expect(page.locator(".pipeline-node[data-active]").first()).toBeVisible();
});

test("scroll progress follows the page", async ({ page }) => {
  await page.goto("/");
  const progress = page.locator(".scroll-progress");
  const width = () => progress.evaluate((el) => el.getBoundingClientRect().width);

  expect(await width()).toBe(0);
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await expect.poll(width).toBeGreaterThan(1000);
});

test("menu underline slides to the section on screen", async ({ page }) => {
  await page.goto("/#stack");
  const nav = page.getByRole("navigation", { name: "Seções" });

  await expect(nav.getByRole("link", { name: "03 Stack" }).locator("[data-nav-indicator]")).toBeVisible();
  await expect(nav.locator("[data-nav-indicator]")).toHaveCount(1);
});

test("stack chips filter the technologies", async ({ page }) => {
  await page.goto("/#stack");
  const stack = page.locator("#stack");
  const chips = stack.getByRole("group", { name: "Filtrar stack" });

  await expect(chips.getByRole("button", { name: "Tudo" })).toHaveAttribute("aria-pressed", "true");
  await chips.getByRole("button", { name: "Qualidade" }).click();

  await expect(chips.getByRole("button", { name: "Qualidade" })).toHaveAttribute("aria-pressed", "true");
  await expect(stack.getByRole("listitem").filter({ hasText: /^Stryker$/ }).last()).toBeVisible();
  await expect(stack.locator("ul").last().getByText("Next.js", { exact: true })).toHaveCount(0);
});

test("seed garden plants a new artifact on demand", async ({ page }) => {
  await page.goto("/#quem-sou");
  const garden = page.locator("#quem-sou figure");

  await expect(garden.locator("canvas")).toBeVisible();
  await expect(garden.getByText("3 semeados")).toBeVisible();
  await garden.getByRole("button", { name: "Semear" }).click();
  await expect(garden.getByText("4 semeados")).toBeVisible();
});

test("404 page lets visitors kill mutants", async ({ page }) => {
  await page.goto("/rota-que-nao-existe");
  const score = page.locator("[data-score]");

  await expect(page.locator("canvas")).toBeVisible();
  await expect(score).toContainText("mutation score 0%");
  await expect(score).toHaveAttribute("data-score", "0");

  await expect
    .poll(
      () =>
        page.evaluate(() => {
          // sweep the screen with clicks; the scene hit-tests synchronously
          for (let y = 0; y < innerHeight; y += 30) {
            for (let x = 0; x < innerWidth; x += 30) {
              document.body.dispatchEvent(new PointerEvent("pointerdown", { clientX: x, clientY: y, bubbles: true }));
            }
          }
          return Number(document.querySelector("[data-score]")?.getAttribute("data-score"));
        }),
      { timeout: 10_000 },
    )
    .toBeGreaterThan(0);
});

test.describe("with reduced motion", () => {
  test.use({ reducedMotion: "reduce" });

  test("hero and typing line do not animate", async ({ page }) => {
    await page.goto("/");

    const animation = (selector: string) =>
      page.locator(selector).first().evaluate((el) => getComputedStyle(el).animationName);

    expect(await animation("h1")).toBe("none");
    expect(await animation(".typing")).toBe("none");
    await expect(page.locator("h1")).toHaveText("Márcio Wendell");
  });

  test("motion graphics stay still", async ({ page }) => {
    await page.goto("/");

    for (const selector of [".hero-backdrop", ".marquee-track"]) {
      const name = await page.locator(selector).first().evaluate((el) => getComputedStyle(el).animationName);
      expect(name, selector).toBe("none");
    }
    await page.locator("#o-que-faco figure").first().scrollIntoViewIfNeeded();
    await page.waitForTimeout(1500);
    await expect(page.locator(".pipeline-node[data-active]")).toHaveCount(0);
    await expect(page.locator("#topo canvas")).toHaveCount(0);
    await expect(page.locator(".hero-backdrop")).toBeVisible();
  });
});

test("unknown routes show the MW 404 page", async ({ page }) => {
  const response = await page.goto("/rota-que-nao-existe");

  expect(response?.status()).toBe(404);
  await expect(page.getByText("404", { exact: true })).toBeVisible();
  await expect(page.getByRole("link", { name: "Voltar ao início" })).toHaveAttribute("href", "/");
});

test.describe("on mobile", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("sections live behind a hamburger menu", async ({ page }) => {
    await page.goto("/");
    const nav = page.getByRole("navigation", { name: "Seções" });
    const toggle = nav.getByRole("button", { name: "Abrir menu" });
    const link = nav.getByRole("link", { name: "02 O que faço" });

    await expect(link).toBeHidden();
    await toggle.click();
    await expect(nav.getByRole("button", { name: "Fechar menu" })).toHaveAttribute("aria-expanded", "true");
    await expect(link).toBeVisible();

    await link.click();
    await expect(page).toHaveURL(/#o-que-faco$/);
    await expect(link).toBeHidden();

    await toggle.click();
    await page.keyboard.press("Escape");
    await expect(link).toBeHidden();
  });
});

test("desktop shows sections without a hamburger", async ({ page }) => {
  await page.goto("/");
  const nav = page.getByRole("navigation", { name: "Seções" });

  await expect(nav.getByRole("button")).toBeHidden();
  await expect(nav.getByRole("link", { name: "02 O que faço" })).toBeVisible();
});

test("CV button serves the PDF generated from the site", async ({ page, request }) => {
  await page.goto("/");
  const href = await page.getByRole("link", { name: "Baixar CV" }).first().getAttribute("href");

  const response = await request.get(href!);
  expect(response.status()).toBe(200);
  expect(response.headers()["content-type"]).toContain("application/pdf");
  expect((await response.body()).subarray(0, 5).toString()).toBe("%PDF-");
});

test("outlined buttons hide the hero dot grid behind them", async ({ page }) => {
  await page.goto("/");
  const background = await page
    .locator("#topo")
    .getByRole("link", { name: "GitHub" })
    .evaluate((el) => getComputedStyle(el).backgroundColor);

  expect(background).toBe("rgb(0, 0, 0)");
});
