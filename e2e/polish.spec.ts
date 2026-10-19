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

  const animation = (selector: string) =>
    page.locator(selector).first().evaluate((el) => getComputedStyle(el).animationName);

  expect(await animation(".hero-backdrop")).toBe("drift");
  expect(await animation(".pipeline-node")).toBe("node-pulse");
  expect(await animation(".pipeline-packet")).toBe("packet");
  expect(await animation(".marquee-track")).toBe("marquee");
  expect(await animation(".scroll-progress")).toBe("progress");
});

test.describe("with reduced motion", () => {
  test.use({ reducedMotion: "reduce" });

  test("hero and typing line do not animate", async ({ page }) => {
    await page.goto("/");

    const animation = (selector: string) =>
      page.locator(selector).first().evaluate((el) => getComputedStyle(el).animationName);

    expect(await animation("h1")).toBe("none");
    expect(await animation(".typing")).toBe("none");
  });

  test("motion graphics stay still", async ({ page }) => {
    await page.goto("/");

    for (const selector of [".hero-backdrop", ".pipeline-node", ".pipeline-packet", ".marquee-track", ".scroll-progress"]) {
      const name = await page.locator(selector).first().evaluate((el) => getComputedStyle(el).animationName);
      expect(name, selector).toBe("none");
    }
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
