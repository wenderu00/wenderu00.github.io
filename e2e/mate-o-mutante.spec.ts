import { expect, test } from "@playwright/test";

const jogo = (page: import("@playwright/test").Page) => page.locator("[data-mate-o-mutante]");

test("mutant game only downloads GSAP when its section gets close", async ({ page }) => {
  let gsapBaixado = false;
  page.on("response", async (response) => {
    if (response.request().resourceType() !== "script") return;
    if ((await response.text()).includes("morphSVG")) gsapBaixado = true;
  });
  await page.goto("/");
  await page.waitForLoadState("networkidle");
  expect(gsapBaixado).toBe(false);

  await jogo(page).scrollIntoViewIfNeeded();
  await expect(jogo(page).getByRole("button", { name: "Injetar mutante" })).toBeVisible();
  await expect.poll(() => gsapBaixado).toBe(true);
});

test("guardians chase the mutant with full motion", async ({ page }) => {
  await page.goto("/");
  await jogo(page).scrollIntoViewIfNeeded();
  await jogo(page).getByRole("button", { name: "Injetar mutante" }).click();

  const mutante = jogo(page).locator("[data-mutante]");
  await expect.poll(() => mutante.evaluate((el) => Number(getComputedStyle(el).opacity))).toBeGreaterThan(0);
  await expect.poll(() => jogo(page).locator('[data-guardiao="0"]').evaluate((el) => el.getAttribute("transform"))).toMatch(/translate|matrix/);
  await expect(jogo(page).locator('[data-placar="mortos"]')).toHaveText("1", { timeout: 8000 });
  await expect(jogo(page).getByRole("button", { name: "Injetar mutante" })).not.toHaveAttribute("aria-disabled");
});

test.describe("on a 360px phone", () => {
  test.use({ viewport: { width: 360, height: 740 } });

  test("the game fits without horizontal scroll", async ({ page }) => {
    await page.goto("/");
    await jogo(page).scrollIntoViewIfNeeded();
    await jogo(page).getByRole("button", { name: "Injetar mutante" }).click();
    await expect(jogo(page).locator('[data-placar="mortos"]')).toHaveText("1", { timeout: 8000 });

    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(360);
  });
});
