import { expect, type Page } from "@playwright/test";
import { createBdd } from "playwright-bdd";

const { Given, When, Then } = createBdd();

const jogo = (page: Page) => page.getByRole("figure", { name: "Mate o mutante" });

const placar = (page: Page, rotulo: string) =>
  jogo(page).getByRole("definition").filter({ has: page.locator(`xpath=preceding-sibling::dt[.="${rotulo}"]`) });

async function injetar(page: Page, vezes: number) {
  const botao = jogo(page).getByRole("button", { name: "Injetar mutante" });
  for (let i = 0; i < vezes; i++) {
    await expect(botao).toBeEnabled();
    await botao.click();
    // the round is over when the button comes back
    await expect(botao).toBeEnabled({ timeout: 10_000 });
  }
}

Given("que prefiro movimento reduzido", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
});

Given("que estou no minijogo {string}", async ({ page }, nome: string) => {
  await page.goto("/");
  const figura = page.getByRole("figure", { name: nome });
  await figura.scrollIntoViewIfNeeded();
  await expect(figura).toBeVisible();
});

When("eu injeto um mutante", async ({ page }) => injetar(page, 1));

When("eu injeto {int} mutantes", async ({ page }, vezes: number) => injetar(page, vezes));

Given("que eu injetei {int} mutantes", async ({ page }, vezes: number) => injetar(page, vezes));

When("eu reinicio o jogo", async ({ page }) => {
  await jogo(page).getByRole("button", { name: "Reiniciar" }).click();
});

Then("o código mostra o operador {string} destacado", async ({ page }, operador: string) => {
  await expect(jogo(page).locator("code mark")).toHaveText(operador);
});

Then("o código volta a ser {string}", async ({ page }, codigo: string) => {
  await expect(jogo(page).locator("code")).toHaveText(codigo);
  await expect(jogo(page).locator("code mark")).toHaveCount(0);
});

Then(
  "o placar mostra {int} morto(s), {int} sobrevivente(s) e score de {int}%",
  async ({ page }, mortos: number, sobreviventes: number, score: number) => {
    await expect(placar(page, "Mortos")).toHaveText(String(mortos));
    await expect(placar(page, "Sobreviventes")).toHaveText(String(sobreviventes));
    await expect(placar(page, "Mutation score")).toHaveText(`${score}%`);
  },
);

Then("vejo a frase {string}", async ({ page }, frase: string) => {
  await expect(jogo(page).getByText(frase, { exact: true })).toBeVisible();
});

Then("o resultado é anunciado para leitores de tela", async ({ page }) => {
  await expect(jogo(page).locator('[aria-live="polite"]')).toContainText("Mutante 1: >= virou <. Morto");
});

Then("a cena não carrega o Rive", async ({ page }) => {
  await expect(jogo(page).locator('[data-cena="svg"]')).toBeVisible();
  await expect(jogo(page).locator('[data-cena="rive"]')).toHaveCount(0);
});
