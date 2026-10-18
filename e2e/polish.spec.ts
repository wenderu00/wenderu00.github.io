import { expect, test } from "@playwright/test";

test("menu marks the section on screen as current", async ({ page }) => {
  await page.goto("/#trabalhos");
  const nav = page.getByRole("navigation", { name: "Seções" });

  await expect(nav.getByRole("link", { name: "03 Trabalhos" })).toHaveAttribute("aria-current", "true");
  await expect(nav.getByRole("link", { name: "01 Quem sou eu" })).not.toHaveAttribute("aria-current", "true");

  await page.evaluate(() => document.getElementById("quem-sou")?.scrollIntoView({ behavior: "instant" }));

  await expect(nav.getByRole("link", { name: "01 Quem sou eu" })).toHaveAttribute("aria-current", "true");
  await expect(nav.getByRole("link", { name: "03 Trabalhos" })).not.toHaveAttribute("aria-current", "true");
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

test.describe("with reduced motion", () => {
  test.use({ reducedMotion: "reduce" });

  test("hero and typing line do not animate", async ({ page }) => {
    await page.goto("/");

    const animation = (selector: string) =>
      page.locator(selector).first().evaluate((el) => getComputedStyle(el).animationName);

    expect(await animation("h1")).toBe("none");
    expect(await animation(".typing")).toBe("none");
  });
});

test("unknown routes show the MW 404 page", async ({ page }) => {
  const response = await page.goto("/rota-que-nao-existe");

  expect(response?.status()).toBe(404);
  await expect(page.getByText("404", { exact: true })).toBeVisible();
  await expect(page.getByRole("link", { name: "Voltar ao início" })).toHaveAttribute("href", "/");
});
