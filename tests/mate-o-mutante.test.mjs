import { test } from "node:test";
import assert from "node:assert/strict";
import {
  anuncio,
  cenaInicial,
  codigoMutado,
  codigoOriginal,
  estadoInicial,
  fasesDaRodada,
  fraseSobrevivente,
  guardioes,
  injetar,
  mutantes,
  mutationScore,
  pegoPor,
} from "../app/mate-o-mutante/logica.ts";

function jogarTudo() {
  const rodadas = [];
  let estado = estadoInicial();
  for (let passo = injetar(estado); passo; passo = injetar(estado)) {
    rodadas.push(passo.rodada);
    estado = passo.estado;
  }
  return { rodadas, estado };
}

test("the sequence is deterministic", () => {
  const a = jogarTudo().rodadas.map((r) => [r.mutante.id, r.resultado]);
  const b = jogarTudo().rodadas.map((r) => [r.mutante.id, r.resultado]);
  assert.deepEqual(a, b);
  assert.deepEqual(
    a.map(([, resultado]) => resultado),
    ["morto", "morto", "sobreviveu", "morto", "morto", "morto", "sobreviveu", "morto"],
  );
});

test("a visitor sees a survivor within the first five rounds", () => {
  const primeiras = jogarTudo().rodadas.slice(0, 5);
  assert.ok(primeiras.some((r) => r.resultado === "sobreviveu"));
});

test("each mutant is caught by exactly the guardians whose expectation it breaks", () => {
  const maior = "saldo maior libera";
  const menor = "saldo menor bloqueia";
  const sobra = "saldo de sobra libera";
  assert.deepEqual(
    mutantes.map((m) => [m.id, pegoPor(m)]),
    [
      [1, [maior, menor, sobra]],
      [2, [maior, menor, sobra]],
      [3, []],
      [4, [maior, sobra]],
      [5, [menor]],
      [6, [menor]],
      [7, []],
      [8, [maior, sobra]],
    ],
  );
});

test("mutants behave like the operator they claim at the boundary too", () => {
  const nos = (id, s, p) => mutantes.find((m) => m.id === id).avalia(s, p);
  assert.deepEqual([nos(1, 50, 50), nos(2, 50, 50), nos(3, 50, 50), nos(4, 50, 50), nos(6, 50, 50), nos(7, 50, 50)], [false, true, false, true, false, true]);
  assert.deepEqual([nos(2, 10, 50), nos(4, 10, 50), nos(6, 50, 10)], [true, false, true]);
  assert.equal(nos(5, 0, 99), true);
  assert.equal(nos(8, 99, 0), false);
});

test("every mutant renders as a real change of the original code", () => {
  const render = (m) => {
    const { antes, trecho, depois } = codigoMutado(m);
    return antes + trecho + depois;
  };
  assert.deepEqual(mutantes.map(render), [
    "if (saldo < preco) liberarModulo()",
    "if (saldo <= preco) liberarModulo()",
    "if (saldo > preco) liberarModulo()",
    "if (saldo == preco) liberarModulo()",
    "if (true) liberarModulo()",
    "if (saldo != preco) liberarModulo()",
    "if (preco <= saldo) liberarModulo()",
    "if (saldo >= preco) {}",
  ]);
});

test("each mutant explains what changed", () => {
  assert.deepEqual(
    mutantes.map((m) => m.descricao),
    [
      "inverteu a comparação",
      "trocou o sentido da comparação",
      "tirou o igual da fronteira",
      "só libera com valor exato",
      "a condição virou sempre verdadeira",
      "libera com qualquer valor diferente",
      "mutante equivalente: mesmo comportamento",
      "apagou a chamada",
    ],
  );
});

test("the scene starts idle with one guardian per test", () => {
  assert.deepEqual(cenaInicial, {
    estado: "guarda",
    resultado: "aguardando",
    mutanteAtivo: false,
    mortos: 0,
    sobreviventes: 0,
    rodada: 0,
    quantidadeGuardioes: 3,
  });
});

test("survivors get the measuring phrase", () => {
  assert.equal(fraseSobrevivente, "Nenhuma suíte é perfeita. Por isso eu meço.");
});

test("the original code passes every guardian", () => {
  for (const g of guardioes) assert.equal(g.saldo >= g.preco, g.esperado, g.nome);
});

test("the > mutant survives because the boundary test is missing", () => {
  const maior = mutantes.find((m) => m.mutado === ">");
  assert.deepEqual(pegoPor(maior), []);
  assert.ok(!guardioes.some((g) => g.saldo === g.preco));
});

test("the equivalent mutant behaves like the original", () => {
  const equivalente = mutantes.find((m) => m.mutado === "preco <= saldo");
  for (const [s, p] of [[0, 0], [5, 3], [3, 5], [50, 50]]) assert.equal(equivalente.avalia(s, p), s >= p);
});

test("each round updates the scoreboard", () => {
  const primeira = injetar(estadoInicial());
  assert.equal(primeira.rodada.mutante.id, 1);
  assert.deepEqual(
    { mortos: primeira.estado.mortos, sobreviventes: primeira.estado.sobreviventes, proximo: primeira.estado.proximo },
    { mortos: 1, sobreviventes: 0, proximo: 1 },
  );
  assert.equal(primeira.estado.ultima, primeira.rodada);
  assert.equal(primeira.estado.terminou, false);
});

test("the game ends after the last mutant and a fresh state starts over", () => {
  const { rodadas, estado } = jogarTudo();
  assert.equal(rodadas.length, mutantes.length);
  assert.equal(estado.terminou, true);
  assert.equal(injetar(estado), null);
  assert.deepEqual(estadoInicial(), { proximo: 0, mortos: 0, sobreviventes: 0, terminou: false, ultima: null });
});

test("mutation score is the share of killed mutants", () => {
  assert.equal(mutationScore({ mortos: 0, sobreviventes: 0 }), 0);
  assert.equal(mutationScore({ mortos: 1, sobreviventes: 0 }), 100);
  assert.equal(mutationScore({ mortos: 0, sobreviventes: 2 }), 0);
  assert.equal(mutationScore({ mortos: 2, sobreviventes: 1 }), 67);
  assert.equal(mutationScore({ mortos: 1, sobreviventes: 2 }), 33);
  assert.equal(mutationScore(jogarTudo().estado), 75);
});

test("round phases depend on the result", () => {
  assert.deepEqual(
    fasesDaRodada("morto").map((f) => f.estado),
    ["correndo", "pegou", "comemorando"],
  );
  assert.deepEqual(
    fasesDaRodada("sobreviveu").map((f) => f.estado),
    ["correndo", "escapou"],
  );
  for (const fase of [...fasesDaRodada("morto"), ...fasesDaRodada("sobreviveu")]) assert.ok(fase.ms > 0);
});

test("mutated code swaps exactly the mutated piece", () => {
  assert.equal(codigoOriginal, "if (saldo >= preco) liberarModulo()");
  const partes = (id) => codigoMutado(mutantes.find((m) => m.id === id));
  assert.deepEqual(partes(3), { antes: "if (saldo ", trecho: ">", depois: " preco) liberarModulo()" });
  assert.deepEqual(partes(5), { antes: "if (", trecho: "true", depois: ") liberarModulo()" });
  assert.deepEqual(partes(8), { antes: "if (saldo >= preco) ", trecho: "{}", depois: "" });
});

test("announcements describe the round and the scoreboard", () => {
  const primeira = injetar(estadoInicial());
  assert.equal(
    anuncio(primeira.rodada, primeira.estado),
    'Mutante 1: >= virou <. Morto pelo teste "saldo maior libera". Mortos 1, sobreviventes 0, score 100%.',
  );
  let estado = estadoInicial();
  let passo;
  for (let i = 0; i < 3; i++) ({ estado, rodada: passo } = { ...injetar(estado) });
  assert.match(anuncio(passo, estado), /^Mutante 3: >= virou >\. Sobreviveu: .* score 67%\.$/);
});

test("no interface text uses an em dash", () => {
  const textos = [fraseSobrevivente, ...mutantes.flatMap((m) => [m.descricao, m.mutado]), ...guardioes.map((g) => g.nome)];
  let estado = estadoInicial();
  for (let passo = injetar(estado); passo; passo = injetar(estado)) {
    textos.push(anuncio(passo.rodada, passo.estado));
    estado = passo.estado;
  }
  for (const texto of textos) assert.ok(!texto.includes("—"), texto);
});
