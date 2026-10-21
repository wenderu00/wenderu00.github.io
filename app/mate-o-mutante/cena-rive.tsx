"use client";

import {
  Alignment,
  Fit,
  Layout,
  RuntimeLoader,
  useRive,
  useRiveFile,
  useViewModel,
  useViewModelInstance,
  type Rive,
} from "@rive-app/react-canvas";
import { useEffect, useRef } from "react";
import type { Cena } from "./logica";
import { rive as contrato } from "./rive-contrato";

RuntimeLoader.setWasmUrl(contrato.wasm);

const layout = new Layout({ fit: Fit.Contain, alignment: Alignment.Center });

const { propriedades: p } = contrato;

// True when the file exposes every view model property the game drives.
function cumpreContrato(instance: Rive) {
  const viewModel = instance.viewModelByName(contrato.viewModel);
  const vmi = viewModel?.defaultInstance();
  if (!vmi) return false;
  return (
    !!vmi.enum(p.estado) &&
    !!vmi.enum(p.resultado) &&
    !!vmi.boolean(p.mutanteAtivo) &&
    !!vmi.number(p.mortos) &&
    !!vmi.number(p.sobreviventes) &&
    !!vmi.number(p.quantidadeGuardioes) &&
    !!vmi.number(p.rodada)
  );
}

export default function CenaRive({ cena, onStatus }: { cena: Cena; onStatus: (status: "pronto" | "falhou") => void }) {
  const avisar = useRef(onStatus);
  const { riveFile, status } = useRiveFile({ src: contrato.arquivo });

  const { rive, RiveComponent } = useRive(
    riveFile
      ? {
          riveFile,
          artboard: contrato.artboard,
          stateMachine: contrato.stateMachine,
          autoplay: true,
          autoBind: false,
          layout,
          onLoadError: () => avisar.current("falhou"),
          onRiveReady: (instance) => {
            const ok = cumpreContrato(instance);
            if (!ok && process.env.NODE_ENV !== "production") {
              console.warn("mate-o-mutante.riv não segue docs/rive-mate-o-mutante.md; usando o fallback em SVG.");
            }
            avisar.current(ok ? "pronto" : "falhou");
          },
        }
      : null,
  );

  const viewModel = useViewModel(rive, { name: contrato.viewModel });
  const vmi = useViewModelInstance(viewModel, { useDefault: true, rive });

  useEffect(() => {
    if (status === "failed") avisar.current("falhou");
  }, [status]);

  useEffect(() => {
    if (!vmi) return;
    const estado = vmi.enum(p.estado);
    const resultado = vmi.enum(p.resultado);
    const ativo = vmi.boolean(p.mutanteAtivo);
    const mortos = vmi.number(p.mortos);
    const sobreviventes = vmi.number(p.sobreviventes);
    const guardioes = vmi.number(p.quantidadeGuardioes);
    const rodada = vmi.number(p.rodada);
    if (estado) estado.value = cena.estado;
    if (resultado) resultado.value = cena.resultado;
    if (ativo) ativo.value = cena.mutanteAtivo;
    if (mortos) mortos.value = cena.mortos;
    if (sobreviventes) sobreviventes.value = cena.sobreviventes;
    if (guardioes) guardioes.value = cena.quantidadeGuardioes;
    if (rodada) rodada.value = cena.rodada;
  }, [vmi, cena]);

  return <RiveComponent aria-hidden="true" className="absolute inset-0 size-full" />;
}
