# Contrato do arquivo Rive: "Mate o mutante"

Este documento diz exatamente o que o arquivo `.riv` precisa ter para o minijogo da seção "02 O que faço" usar a animação em Rive. Os nomes abaixo estão centralizados em [`app/mate-o-mutante/rive-contrato.ts`](../app/mate-o-mutante/rive-contrato.ts). Se mudar um nome aqui, mude lá também (e vice-versa).

Enquanto o arquivo não existir, ou se ele não seguir este contrato, o site mostra uma versão em SVG com a mesma lógica e o mesmo placar. Nada quebra.

## Como o site usa o arquivo

- Runtime: `@rive-app/react-canvas@4.36.0` (renderer canvas 2D, runtime completo, com data binding).
- O runtime só é baixado quando a seção chega perto da tela (`next/dynamic` com `ssr: false`), e nunca com `prefers-reduced-motion: reduce`.
- O WASM do Rive é servido pelo próprio site em `/rive/rive.wasm` (copiado de `node_modules` no `predev`/`prebuild`).
- Controle por **data binding** (view model). Inputs de state machine e Rive Events estão deprecated no runtime e não são usados.
- Todo o texto (código, placar, frase do sobrevivente, anúncios) fica no HTML. O `.riv` não precisa de texto.

## Arquivo

| Item | Valor |
| --- | --- |
| Caminho no repositório | `public/rive/mate-o-mutante.riv` |
| URL servida | `/rive/mate-o-mutante.riv` |
| Fit / alinhamento | `Contain`, `Center` |
| Proporção da área | 4:3 (sugestão de artboard: 640 x 480) |
| Fundo | transparente ou `#000000` |

## Artboards

| Nome | Papel |
| --- | --- |
| `MateOMutante` | Artboard principal, o único que o site carrega. Contém o mutante, o chão e 3 instâncias aninhadas de `Guardiao`. |
| `Guardiao` | Um guardião (um teste da suíte). Usado como artboard aninhado dentro de `MateOMutante`. |

## State machine

Nome: **`Rodada`** (no artboard `MateOMutante`).

Estados esperados, todos dirigidos pela propriedade `estado` (transição por condição `estado == <valor>`):

| Estado | Quando acontece | O que mostrar |
| --- | --- | --- |
| `guarda` | Antes da primeira rodada e entre rodadas | Guardiões parados, em posição de guarda. Mutante fora de cena. |
| `correndo` | Logo depois de "Injetar mutante" (900 ms) | O mutante aparece e foge; os guardiões correm atrás. |
| `pegou` | O mutante foi morto (700 ms) | Os guardiões alcançam o mutante, que some (explosão, poeira etc.). |
| `escapou` | O mutante sobreviveu (1100 ms) | O mutante sai de cena; os guardiões param, confusos (por exemplo, um "?"). |
| `comemorando` | Depois de `pegou` (800 ms) | Os guardiões comemoram. |

Sequência por rodada: `correndo` → `pegou` → `comemorando` → `guarda` quando o mutante morre, e `correndo` → `escapou` → `guarda` quando sobrevive. Os tempos ficam no código (`fasesDaRodada` em `app/mate-o-mutante/logica.ts`). As animações devem caber neles; o arquivo não precisa avisar o fim de nada.

## View model

Nome: **`MateOMutante`**, com a **instância padrão** atribuída ao artboard `MateOMutante`. O site faz o bind dessa instância (`useViewModelInstance(viewModel, { useDefault: true, rive })`).

| Propriedade | Tipo | Valores | Quem escreve |
| --- | --- | --- | --- |
| `estado` | enum `EstadoRodada` | `guarda`, `correndo`, `pegou`, `escapou`, `comemorando` | Site, a cada fase |
| `resultado` | enum `ResultadoRodada` | `aguardando`, `morto`, `sobreviveu` | Site, no início da rodada |
| `mutanteAtivo` | boolean | | Site: `true` durante a rodada |
| `mortos` | number | 0 a 8 | Site, no fim da rodada |
| `sobreviventes` | number | 0 a 8 | Site, no fim da rodada |
| `quantidadeGuardioes` | number | 3 (um por teste) | Site, sempre 3 hoje |
| `rodada` | number | 0 a 8 | Site, no início da rodada |

Os valores dos enums são comparados como texto: escreva-os exatamente assim, em minúsculas e sem acento.

### Guardiões

Cada instância de `Guardiao` deve reagir ao `estado` do pai (por exemplo, com um view model `Guardiao` cuja propriedade `estado` faz binding relativo com `MateOMutante/estado`, ou com animações no próprio artboard pai). Mostre só as `quantidadeGuardioes` primeiras instâncias. Em `escapou`, o guardião fica confuso.

## Validação feita pelo site

Quando o arquivo carrega, o site confere:

1. se o view model `MateOMutante` existe e tem instância padrão;
2. se todas as propriedades acima existem com o tipo certo.

Se algo faltar, aparece um `console.warn` em desenvolvimento e o site volta ao SVG. Se o artboard ou a state machine não existirem, o runtime dispara erro de carga e o site também volta ao SVG.

## Checklist antes de publicar

- [ ] Arquivo exportado em `public/rive/mate-o-mutante.riv`
- [ ] Artboards `MateOMutante` e `Guardiao`
- [ ] State machine `Rodada` com os 5 estados
- [ ] View model `MateOMutante` com instância padrão e as 7 propriedades
- [ ] Enums `EstadoRodada` e `ResultadoRodada` com os valores exatos
- [ ] `npm run dev`, rolar até "Mate o mutante" e injetar: a cena Rive aparece no lugar do SVG
- [ ] `npm run test:e2e` continua verde (o teste "sem o .riv" passa a carregar o arquivo real; ajuste-o se quiser cobrir os dois casos)
