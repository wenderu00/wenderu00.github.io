import { expect, test } from "@playwright/test";

test("Rive files load only once the game is near the viewport", async ({ page }) => {
  const rive: string[] = [];
  page.on("request", (request) => {
    if (/\.(riv|wasm)$/.test(new URL(request.url()).pathname)) rive.push(request.url());
  });

  await page.goto("/");
  await page.waitForTimeout(1500);
  expect(rive).toEqual([]);

  await page.getByRole("figure", { name: "Mate o mutante" }).scrollIntoViewIfNeeded();
  await expect.poll(() => rive.some((url) => url.endsWith("/rive/mate-o-mutante.riv"))).toBe(true);
});

test("without the .riv file the SVG fallback plays the round", async ({ page }) => {
  await page.goto("/");
  const game = page.getByRole("figure", { name: "Mate o mutante" });
  await game.scrollIntoViewIfNeeded();

  await expect(game.locator('[data-cena="svg"]')).toBeVisible();
  await game.getByRole("button", { name: "Injetar mutante" }).click();
  await expect(game.getByRole("button", { name: "Injetar mutante" })).toBeDisabled();
  await expect(game.getByRole("button", { name: "Injetar mutante" })).toBeEnabled({ timeout: 10_000 });
  await expect(game.locator('[data-cena="svg"]')).toBeVisible();
  await expect(game.locator('[data-cena="rive"]')).toHaveCount(0);
});

test.describe("at 360px", () => {
  test.use({ viewport: { width: 360, height: 780 } });

  test("the game fits without horizontal scroll", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("figure", { name: "Mate o mutante" }).scrollIntoViewIfNeeded();
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(360);
  });
});
