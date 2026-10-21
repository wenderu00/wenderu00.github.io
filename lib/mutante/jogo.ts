import { julgar, MUTANTES, TESTES, testeQueFalta, type Mutante, type Teste } from "./mutantes";

export type Fase = "pronto" | "animando" | "fim";

export type Desfecho = "morto" | "sobrevivente";

export type Rodada = {
  numero: number;
  mutante: Mutante;
  desfecho: Desfecho;
  // index of the test that caught the mutant, null when it escaped
  guardiao: number | null;
};

export type Estado = {
  fase: Fase;
  proximo: number;
  mortos: number;
  sobreviventes: number;
  rodada: Rodada | null;
};

export function estadoInicial(): Estado {
  return { fase: "pronto", proximo: 0, mortos: 0, sobreviventes: 0, rodada: null };
}

export const reiniciar = estadoInicial;

// a click while a round is still playing returns the same state, so it can never skip or double count
export function injetar(estado: Estado, mutantes: Mutante[] = MUTANTES, testes: Teste[] = TESTES): Estado {
  if (estado.fase !== "pronto") return estado;
  const mutante = mutantes[estado.proximo];
  const { sobrevive, capturadoPor } = julgar(mutante, testes);
  return {
    ...estado,
    fase: "animando",
    proximo: estado.proximo + 1,
    rodada: { numero: estado.proximo + 1, mutante, desfecho: sobrevive ? "sobrevivente" : "morto", guardiao: capturadoPor },
  };
}

export function concluirRodada(estado: Estado, total: number = MUTANTES.length): Estado {
  if (estado.fase !== "animando" || !estado.rodada) return estado;
  const morto = estado.rodada.desfecho === "morto";
  return {
    ...estado,
    fase: estado.proximo >= total ? "fim" : "pronto",
    mortos: estado.mortos + (morto ? 1 : 0),
    sobreviventes: estado.sobreviventes + (morto ? 0 : 1),
  };
}

export function mutationScore(mortos: number, sobreviventes: number): number {
  const total = mortos + sobreviventes;
  return total === 0 ? 0 : Math.round((mortos / total) * 100);
}

export function anuncio(rodada: Rodada, total: number = MUTANTES.length, testes: Teste[] = TESTES): string {
  const { numero, mutante, guardiao } = rodada;
  const troca = `Mutante ${numero} de ${total}: ${mutante.original} virou ${mutante.mutado}.`;
  if (guardiao !== null) {
    return `${troca} Morto pelo teste t${guardiao + 1} (${testes[guardiao].nome}).`;
  }
  const falta = testeQueFalta(mutante);
  return `${troca} Sobreviveu: nenhum teste falhou.${falta ? ` Faltou um teste como ${falta.nome}.` : ""}`;
}
