// Every name the .riv file must expose. Documented in docs/rive-mate-o-mutante.md: change both together.

export const rive = {
  arquivo: "/rive/mate-o-mutante.riv",
  wasm: "/rive/rive.wasm",
  artboard: "MateOMutante",
  artboardGuardiao: "Guardiao",
  stateMachine: "Rodada",
  viewModel: "MateOMutante",
  propriedades: {
    estado: "estado",
    resultado: "resultado",
    mutanteAtivo: "mutanteAtivo",
    mortos: "mortos",
    sobreviventes: "sobreviventes",
    quantidadeGuardioes: "quantidadeGuardioes",
    rodada: "rodada",
  },
  estados: ["guarda", "correndo", "pegou", "escapou", "comemorando"],
  resultados: ["aguardando", "morto", "sobreviveu"],
} as const;
