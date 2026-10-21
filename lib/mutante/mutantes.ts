export const CODIGO = "if (saldo >= preco) liberarModulo()";

export type Regra = (saldo: number, preco: number) => boolean;

export const ORIGINAL: Regra = (saldo, preco) => saldo >= preco;

export type Teste = { nome: string; saldo: number; preco: number; libera: boolean };

export type Mutante = {
  id: number;
  original: string;
  mutado: string;
  descricao: string;
  libera: Regra;
};

export type Veredito = { sobrevive: boolean; capturadoPor: number | null };

export type TrechoMutado = { antes: string; original: string; mutado: string; depois: string };

// t3 is redundant on purpose: more tests are not the same as better tests
export const TESTES: Teste[] = [
  { nome: "saldo 50, preço 30: libera", saldo: 50, preco: 30, libera: true },
  { nome: "saldo 10, preço 30: bloqueia", saldo: 10, preco: 30, libera: false },
  { nome: "saldo -5, preço 30: bloqueia", saldo: -5, preco: 30, libera: false },
];

// fixed order: the third mutant is the first survivor, so every visitor sees one early
export const MUTANTES: Mutante[] = [
  { id: 1, original: ">=", mutado: "<", descricao: "inverte a comparação", libera: (saldo, preco) => saldo < preco },
  { id: 2, original: ">=", mutado: "<=", descricao: "troca maior por menor", libera: (saldo, preco) => saldo <= preco },
  { id: 3, original: ">=", mutado: ">", descricao: "tira o igual do limite", libera: (saldo, preco) => saldo > preco },
  { id: 4, original: "liberarModulo()", mutado: "{}", descricao: "remove a chamada", libera: () => false },
  { id: 5, original: "saldo >= preco", mutado: "true", descricao: "condição sempre verdadeira", libera: () => true },
  { id: 6, original: "preco", mutado: "preco - 1", descricao: "desloca o limite em um", libera: (saldo, preco) => saldo >= preco - 1 },
  { id: 7, original: ">=", mutado: "!=", descricao: "troca por diferente", libera: (saldo, preco) => saldo !== preco },
];

export function julgar(mutante: Mutante, testes: Teste[] = TESTES): Veredito {
  const falhou = testes.findIndex((teste) => mutante.libera(teste.saldo, teste.preco) !== teste.libera);
  return falhou === -1 ? { sobrevive: true, capturadoPor: null } : { sobrevive: false, capturadoPor: falhou };
}

export function trechoMutado(mutante: Mutante, codigo: string = CODIGO): TrechoMutado {
  const inicio = codigo.indexOf(mutante.original);
  if (inicio === -1) throw new Error(`"${mutante.original}" não aparece no código`);
  const fim = inicio + mutante.original.length;
  return { antes: codigo.slice(0, inicio), original: mutante.original, mutado: mutante.mutado, depois: codigo.slice(fim) };
}

// searches around the price (the boundary) for a case where the original and the mutant disagree
export function testeQueFalta(mutante: Mutante, preco = 30, alcance = 5): Teste | null {
  for (let distancia = 0; distancia <= alcance; distancia++) {
    for (const saldo of new Set([preco - distancia, preco + distancia])) {
      const libera = ORIGINAL(saldo, preco);
      if (mutante.libera(saldo, preco) !== libera) {
        return { nome: `saldo ${saldo}, preço ${preco}: ${libera ? "libera" : "bloqueia"}`, saldo, preco, libera };
      }
    }
  }
  return null;
}
