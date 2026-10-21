// Pure game logic: no React, no Rive. Only erasable TypeScript, so node --test can import it directly.

export type Guardiao = { nome: string; saldo: number; preco: number; esperado: boolean };

export type Mutante = {
  id: number;
  original: string;
  mutado: string;
  descricao: string;
  avalia: (saldo: number, preco: number) => boolean;
};

export type Resultado = "morto" | "sobreviveu";

export type Rodada = { mutante: Mutante; resultado: Resultado; pegoPor: string[] };

export type Estado = { proximo: number; mortos: number; sobreviventes: number; terminou: boolean; ultima: Rodada | null };

export type EstadoRodada = "guarda" | "correndo" | "pegou" | "escapou" | "comemorando";

export type Fase = { estado: EstadoRodada; ms: number };

export const codigo = { antes: "if (saldo ", operador: ">=", depois: " preco) liberarModulo()" };

export const codigoOriginal = `${codigo.antes}${codigo.operador}${codigo.depois}`;

// The suite deliberately has no boundary test (saldo === preco).
export const guardioes: Guardiao[] = [
  { nome: "saldo maior libera", saldo: 100, preco: 50, esperado: true },
  { nome: "saldo menor bloqueia", saldo: 10, preco: 50, esperado: false },
  { nome: "saldo de sobra libera", saldo: 80, preco: 20, esperado: true },
];

export const mutantes: Mutante[] = [
  { id: 1, original: ">=", mutado: "<", descricao: "inverteu a comparação", avalia: (s, p) => s < p },
  { id: 2, original: ">=", mutado: "<=", descricao: "trocou o sentido da comparação", avalia: (s, p) => s <= p },
  { id: 3, original: ">=", mutado: ">", descricao: "tirou o igual da fronteira", avalia: (s, p) => s > p },
  { id: 4, original: ">=", mutado: "==", descricao: "só libera com valor exato", avalia: (s, p) => s === p },
  { id: 5, original: "saldo >= preco", mutado: "true", descricao: "a condição virou sempre verdadeira", avalia: () => true },
  { id: 6, original: ">=", mutado: "!=", descricao: "libera com qualquer valor diferente", avalia: (s, p) => s !== p },
  { id: 7, original: "saldo >= preco", mutado: "preco <= saldo", descricao: "mutante equivalente: mesmo comportamento", avalia: (s, p) => p <= s },
  { id: 8, original: "liberarModulo()", mutado: "{}", descricao: "apagou a chamada", avalia: () => false },
];

export function pegoPor(mutante: Mutante): string[] {
  return guardioes.filter((g) => mutante.avalia(g.saldo, g.preco) !== g.esperado).map((g) => g.nome);
}

export function codigoMutado(mutante: Mutante): { antes: string; trecho: string; depois: string } {
  const at = codigoOriginal.indexOf(mutante.original);
  return {
    antes: codigoOriginal.slice(0, at),
    trecho: mutante.mutado,
    depois: codigoOriginal.slice(at + mutante.original.length),
  };
}

export function estadoInicial(): Estado {
  return { proximo: 0, mortos: 0, sobreviventes: 0, terminou: false, ultima: null };
}

export function injetar(estado: Estado): { estado: Estado; rodada: Rodada } | null {
  if (estado.terminou) return null;
  const mutante = mutantes[estado.proximo];
  const pegos = pegoPor(mutante);
  const resultado: Resultado = pegos.length > 0 ? "morto" : "sobreviveu";
  const rodada = { mutante, resultado, pegoPor: pegos };
  const proximo = estado.proximo + 1;
  return {
    rodada,
    estado: {
      proximo,
      mortos: estado.mortos + (resultado === "morto" ? 1 : 0),
      sobreviventes: estado.sobreviventes + (resultado === "sobreviveu" ? 1 : 0),
      terminou: proximo >= mutantes.length,
      ultima: rodada,
    },
  };
}

export function mutationScore({ mortos, sobreviventes }: { mortos: number; sobreviventes: number }): number {
  const total = mortos + sobreviventes;
  return total === 0 ? 0 : Math.round((mortos / total) * 100);
}

export function fasesDaRodada(resultado: Resultado): Fase[] {
  return resultado === "morto"
    ? [
        { estado: "correndo", ms: 900 },
        { estado: "pegou", ms: 700 },
        { estado: "comemorando", ms: 800 },
      ]
    : [
        { estado: "correndo", ms: 900 },
        { estado: "escapou", ms: 1100 },
      ];
}

export function anuncio(rodada: Rodada, estado: Estado): string {
  const { mutante, resultado } = rodada;
  const placar = `Mortos ${estado.mortos}, sobreviventes ${estado.sobreviventes}, score ${mutationScore(estado)}%.`;
  const desfecho =
    resultado === "morto"
      ? `Morto pelo teste "${rodada.pegoPor[0]}".`
      : "Sobreviveu: nenhum teste percebeu a mudança.";
  return `Mutante ${mutante.id}: ${mutante.original} virou ${mutante.mutado}. ${desfecho} ${placar}`;
}

export const fraseSobrevivente = "Nenhuma suíte é perfeita. Por isso eu meço.";

export type Cena = {
  estado: EstadoRodada;
  resultado: "aguardando" | Resultado;
  mutanteAtivo: boolean;
  mortos: number;
  sobreviventes: number;
  rodada: number;
  quantidadeGuardioes: number;
};

export const cenaInicial: Cena = {
  estado: "guarda",
  resultado: "aguardando",
  mutanteAtivo: false,
  mortos: 0,
  sobreviventes: 0,
  rodada: 0,
  quantidadeGuardioes: guardioes.length,
};
