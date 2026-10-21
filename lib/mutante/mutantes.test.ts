import { describe, expect, it } from "vitest";
import { CODIGO, julgar, MUTANTES, ORIGINAL, TESTES, testeQueFalta, trechoMutado, type Mutante } from "./mutantes";

const porId = (id: number) => MUTANTES.find((mutante) => mutante.id === id)!;

describe("testes da suíte", () => {
  it("passam contra o código original", () => {
    for (const teste of TESTES) expect(ORIGINAL(teste.saldo, teste.preco)).toBe(teste.libera);
  });

  it("cada nome descreve o próprio caso", () => {
    for (const teste of TESTES) {
      expect(teste.nome).toBe(`saldo ${teste.saldo}, preço ${teste.preco}: ${teste.libera ? "libera" : "bloqueia"}`);
    }
    expect(TESTES.map((teste) => teste.saldo)).toEqual([50, 10, -5]);
  });

  it("a regra original libera exatamente no limite", () => {
    expect(ORIGINAL(30, 30)).toBe(true);
    expect(ORIGINAL(29, 30)).toBe(false);
    expect(ORIGINAL(31, 30)).toBe(true);
  });
});

describe("julgar", () => {
  it.each([
    [1, false, 0],
    [2, false, 0],
    [3, true, null],
    [4, false, 0],
    [5, false, 1],
    [6, true, null],
    [7, false, 1],
  ])("mutante %i: sobrevive=%s, capturado por %s", (id, sobrevive, capturadoPor) => {
    expect(julgar(porId(id))).toEqual({ sobrevive, capturadoPor });
  });

  it("aponta o primeiro teste que falha", () => {
    const sempreLibera: Mutante = { id: 0, original: "", mutado: "", descricao: "", libera: () => true };
    expect(julgar(sempreLibera)).toEqual({ sobrevive: false, capturadoPor: 1 });
  });

  it("sem testes, todo mutante sobrevive", () => {
    expect(julgar(porId(1), [])).toEqual({ sobrevive: true, capturadoPor: null });
  });
});

describe("cada mutante muda o comportamento", () => {
  it.each(MUTANTES.map((mutante) => [mutante.id, mutante] as const))("mutante %i difere do original em algum caso", (_, mutante) => {
    const casos = [-5, 0, 10, 29, 30, 31, 50].map((saldo) => [saldo, 30] as const);
    expect(casos.some(([saldo, preco]) => mutante.libera(saldo, preco) !== ORIGINAL(saldo, preco))).toBe(true);
  });

  it.each([
    [1, 50, 30, false],
    [1, 10, 30, true],
    [1, 30, 30, false],
    [2, 30, 30, true],
    [2, 31, 30, false],
    [3, 30, 30, false],
    [3, 31, 30, true],
    [4, 50, 30, false],
    [5, 10, 30, true],
    [6, 29, 30, true],
    [6, 28, 30, false],
    [7, 30, 30, false],
    [7, 10, 30, true],
  ])("mutante %i com saldo %i e preço %i libera=%s", (id, saldo, preco, libera) => {
    expect(porId(id).libera(saldo, preco)).toBe(libera);
  });
});

describe("trechoMutado", () => {
  it("separa o código em volta do trecho trocado", () => {
    expect(trechoMutado(porId(3))).toEqual({ antes: "if (saldo ", original: ">=", mutado: ">", depois: " preco) liberarModulo()" });
    expect(trechoMutado(porId(4))).toEqual({ antes: "if (saldo >= preco) ", original: "liberarModulo()", mutado: "{}", depois: "" });
  });

  it.each([
    [1, "if (saldo < preco) liberarModulo()"],
    [2, "if (saldo <= preco) liberarModulo()"],
    [3, "if (saldo > preco) liberarModulo()"],
    [4, "if (saldo >= preco) {}"],
    [5, "if (true) liberarModulo()"],
    [6, "if (saldo >= preco - 1) liberarModulo()"],
    [7, "if (saldo != preco) liberarModulo()"],
  ])("o mutante %i deixa o código como %s", (id, codigo) => {
    const { antes, mutado, depois } = trechoMutado(porId(id));
    expect(antes + mutado + depois).toBe(codigo);
  });

  it("cada mutante tem uma descrição própria", () => {
    expect(MUTANTES.map((mutante) => mutante.descricao)).toEqual([
      "inverte a comparação",
      "troca maior por menor",
      "tira o igual do limite",
      "remove a chamada",
      "condição sempre verdadeira",
      "desloca o limite em um",
      "troca por diferente",
    ]);
  });

  it("todo mutante aponta para um trecho que existe no código", () => {
    for (const mutante of MUTANTES) {
      const { antes, original, depois } = trechoMutado(mutante);
      expect(antes + original + depois).toBe(CODIGO);
    }
  });

  it("recusa um trecho que não existe", () => {
    expect(() => trechoMutado({ ...porId(1), original: "===" })).toThrow('"===" não aparece no código');
  });
});

describe("testeQueFalta", () => {
  it("encontra o caso de limite que mataria cada sobrevivente", () => {
    expect(testeQueFalta(porId(3))).toEqual({ nome: "saldo 30, preço 30: libera", saldo: 30, preco: 30, libera: true });
    expect(testeQueFalta(porId(6))).toEqual({ nome: "saldo 29, preço 30: bloqueia", saldo: 29, preco: 30, libera: false });
  });

  it("procura dos dois lados do limite", () => {
    const acimaDoLimite: Mutante = { ...porId(1), libera: (saldo, preco) => saldo >= preco && saldo !== preco + 2 };
    expect(testeQueFalta(acimaDoLimite)?.saldo).toBe(32);
    const abaixoDoLimite: Mutante = { ...porId(1), libera: (saldo, preco) => saldo >= preco || saldo === preco - 2 };
    expect(testeQueFalta(abaixoDoLimite)?.saldo).toBe(28);
  });

  it("respeita o preço e o alcance pedidos", () => {
    expect(testeQueFalta(porId(3), 10)).toEqual({ nome: "saldo 10, preço 10: libera", saldo: 10, preco: 10, libera: true });
    const longe: Mutante = { ...porId(1), libera: (saldo, preco) => saldo >= preco && saldo !== preco + 5 };
    expect(testeQueFalta(longe, 30, 4)).toBeNull();
    expect(testeQueFalta(longe, 30, 5)?.saldo).toBe(35);
  });

  it("devolve null quando o mutante é equivalente", () => {
    expect(testeQueFalta({ ...porId(1), libera: ORIGINAL })).toBeNull();
  });
});
