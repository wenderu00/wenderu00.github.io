import { expect, type Page } from "@playwright/test";
import { createBdd } from "playwright-bdd";

const { Given, When, Then } = createBdd();

const jogo = (page: Page) => page.locator("[data-mate-o-mutante]");
const anuncio = (page: Page) => jogo(page).locator("[aria-live=polite]");
const injetar = (page: Page) => jogo(page).getByRole("button", { name: "Injetar mutante" });

const teclas: Record<string, string> = { Enter: "Enter", Espaço: "Space" };

// a round is over when its announcement shows up and the inject button is enabled again
async function injetarRodadas(page: Page, rodadas: number) {
  for (let i = 1; i <= rodadas; i++) {
    await injetar(page).click();
    await expect(anuncio(page)).toContainText(`Mutante ${i} de 7`);
    await expect(injetar(page)).not.toHaveAttribute("aria-disabled");
  }
}

Given("que o jogo {string} está carregado na seção {string}", async ({ page }, _jogo: string, secao: string) => {
  await page.goto("/");
  const secaoDoJogo = page.locator("section").filter({ has: page.getByRole("heading", { name: secao }) });
  await secaoDoJogo.locator("[data-mate-o-mutante]").scrollIntoViewIfNeeded();
  await expect(injetar(page)).toBeVisible();
});

Given("que eu já injetei {int} mutantes", async ({ page }, rodadas: number) => {
  await injetarRodadas(page, rodadas);
});

When("eu injeto um mutante", async ({ page }) => {
  await injetarRodadas(page, 1);
});

When("eu injeto {int} mutantes", async ({ page }, rodadas: number) => {
  await injetarRodadas(page, rodadas);
});

When("eu clico em {string}", async ({ page }, nome: string) => {
  await jogo(page).getByRole("button", { name: nome }).click();
});

When("eu clico em {string} {int} vezes seguidas", async ({ page }, nome: string, vezes: number) => {
  const botao = jogo(page).getByRole("button", { name: nome });
  // force skips Playwright waiting for aria-disabled to go away, like an impatient visitor would
  for (let i = 0; i < vezes; i++) await botao.click({ force: true });
  await expect(botao).not.toHaveAttribute("aria-disabled");
});

When("eu navego com Tab até o botão {string}", async ({ page }, nome: string) => {
  const botao = jogo(page).getByRole("button", { name: nome });
  for (let i = 0; i < 120; i++) {
    if (await botao.evaluate((el) => el === document.activeElement)) return;
    await page.keyboard.press("Tab");
  }
  throw new Error(`o Tab nunca chegou ao botão "${nome}"`);
});

When("eu pressiono {word}", async ({ page }, tecla: string) => {
  await page.keyboard.press(teclas[tecla] ?? tecla);
});

Then("o botão {string} tem foco visível", async ({ page }, nome: string) => {
  const botao = jogo(page).getByRole("button", { name: nome });
  await expect(botao).toBeFocused();
  expect(await botao.evaluate((el) => el.matches(":focus-visible"))).toBe(true);
  expect(await botao.evaluate((el) => getComputedStyle(el).outlineStyle)).toBe("solid");
});

Then("o código mostra {string} trocado por {string}", async ({ page }, original: string, mutado: string) => {
  const codigo = jogo(page).locator("[data-codigo]");
  await expect(codigo.locator("mark")).toHaveText(mutado);
  await expect(codigo).toContainText(`trecho trocado: ${original} virou ${mutado}`);
});

Then("o código volta a ser {string}", async ({ page }, codigo: string) => {
  await expect(jogo(page).locator("[data-codigo]")).toHaveText(codigo);
});

Then("o anúncio diz {string}", async ({ page }, texto: string) => {
  await expect(anuncio(page)).toContainText(texto);
});

Then("vejo a frase {string}", async ({ page }, frase: string) => {
  await expect(jogo(page).getByText(frase, { exact: true })).toBeVisible();
});

Then(
  "o placar mostra {int} morto(s), {int} sobrevivente(s) e mutation score de {int}%",
  async ({ page }, mortos: number, sobreviventes: number, score: number) => {
    const placar = (rotulo: string) => jogo(page).locator(`[data-placar="${rotulo}"]`);
    await expect(placar("mortos")).toHaveText(String(mortos));
    await expect(placar("sobreviventes")).toHaveText(String(sobreviventes));
    await expect(placar("mutation score")).toHaveText(`${score}%`);
  },
);
