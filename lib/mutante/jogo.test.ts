import { describe, expect, it } from "vitest";
import { anuncio, concluirRodada, estadoInicial, injetar, mutationScore, reiniciar, type Estado } from "./jogo";
import { MUTANTES } from "./mutantes";

const jogarRodada = (estado: Estado) => concluirRodada(injetar(estado));

const jogar = (rodadas: number) => {
  let estado = estadoInicial();
  for (let i = 0; i < rodadas; i++) estado = jogarRodada(estado);
  return estado;
};

describe("estadoInicial", () => {
  it("começa pronto e zerado", () => {
    expect(estadoInicial()).toEqual({ fase: "pronto", proximo: 0, mortos: 0, sobreviventes: 0, rodada: null });
  });
});

describe("injetar", () => {
  it("abre a rodada com o próximo mutante da sequência", () => {
    const estado = injetar(estadoInicial());
    expect(estado.fase).toBe("animando");
    expect(estado.proximo).toBe(1);
    expect(estado.rodada).toEqual({ numero: 1, mutante: MUTANTES[0], desfecho: "morto", guardiao: 0 });
  });

  it("não mexe no placar antes da animação terminar", () => {
    const estado = injetar(estadoInicial());
    expect(estado.mortos).toBe(0);
    expect(estado.sobreviventes).toBe(0);
  });

  it("ignora cliques enquanto a rodada anima", () => {
    const animando = injetar(estadoInicial());
    expect(injetar(animando)).toBe(animando);
  });

  it("ignora cliques depois do último mutante", () => {
    const fim = jogar(MUTANTES.length);
    expect(injetar(fim)).toBe(fim);
  });

  it("marca o sobrevivente sem guardião", () => {
    const estado = injetar(jogar(2));
    expect(estado.rodada).toMatchObject({ numero: 3, desfecho: "sobrevivente", guardiao: null });
  });
});

describe("concluirRodada", () => {
  it("conta o morto e volta a ficar pronto", () => {
    expect(jogarRodada(estadoInicial())).toMatchObject({ fase: "pronto", mortos: 1, sobreviventes: 0 });
  });

  it("conta o sobrevivente", () => {
    expect(jogar(3)).toMatchObject({ mortos: 2, sobreviventes: 1 });
  });

  it("só conta uma vez", () => {
    const concluido = jogarRodada(estadoInicial());
    expect(concluirRodada(concluido)).toBe(concluido);
  });

  it("sem rodada aberta, não faz nada", () => {
    const pronto = estadoInicial();
    expect(concluirRodada(pronto)).toBe(pronto);
    const semRodada: Estado = { ...pronto, fase: "animando" };
    expect(concluirRodada(semRodada)).toBe(semRodada);
  });

  it("termina o jogo depois do último mutante", () => {
    expect(jogar(MUTANTES.length - 1).fase).toBe("pronto");
    expect(jogar(MUTANTES.length)).toMatchObject({ fase: "fim", mortos: 5, sobreviventes: 2 });
  });

  it("respeita um total menor", () => {
    expect(concluirRodada(injetar(estadoInicial()), 1).fase).toBe("fim");
  });
});

describe("sequência", () => {
  it("é determinística", () => {
    expect(jogar(MUTANTES.length)).toEqual(jogar(MUTANTES.length));
  });

  it("mostra um sobrevivente nas primeiras 4 rodadas", () => {
    const desfechos = [];
    let estado = estadoInicial();
    for (let i = 0; i < 4; i++) {
      estado = injetar(estado);
      desfechos.push(estado.rodada!.desfecho);
      estado = concluirRodada(estado);
    }
    expect(desfechos).toEqual(["morto", "morto", "sobrevivente", "morto"]);
  });
});

describe("reiniciar", () => {
  it("volta ao estado inicial", () => {
    expect(reiniciar()).toEqual(estadoInicial());
    expect(jogar(3)).not.toEqual(reiniciar());
  });
});

describe("mutationScore", () => {
  it.each([
    [0, 0, 0],
    [1, 0, 100],
    [0, 1, 0],
    [2, 1, 67],
    [5, 2, 71],
    [1, 2, 33],
    [1, 7, 13],
  ])("%i mortos e %i sobreviventes dão %i%%", (mortos, sobreviventes, score) => {
    expect(mutationScore(mortos, sobreviventes)).toBe(score);
  });
});

describe("anuncio", () => {
  it("diz qual teste matou o mutante", () => {
    expect(anuncio(injetar(estadoInicial()).rodada!)).toBe(
      "Mutante 1 de 7: >= virou <. Morto pelo teste t1 (saldo 50, preço 30: libera).",
    );
    expect(anuncio(injetar(jogar(4)).rodada!)).toBe(
      "Mutante 5 de 7: saldo >= preco virou true. Morto pelo teste t2 (saldo 10, preço 30: bloqueia).",
    );
  });

  it("explica o sobrevivente e o teste que faltou", () => {
    expect(anuncio(injetar(jogar(2)).rodada!)).toBe(
      "Mutante 3 de 7: >= virou >. Sobreviveu: nenhum teste falhou. Faltou um teste como saldo 30, preço 30: libera.",
    );
  });

  it("não inventa um teste quando não encontra um", () => {
    const rodada = { numero: 1, mutante: { ...MUTANTES[0], libera: (saldo: number, preco: number) => saldo >= preco }, desfecho: "sobrevivente" as const, guardiao: null };
    expect(anuncio(rodada, 1)).toBe("Mutante 1 de 1: >= virou <. Sobreviveu: nenhum teste falhou.");
  });
});
