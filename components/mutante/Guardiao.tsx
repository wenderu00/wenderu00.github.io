// one guardian per test; drawn with its feet at (0, 0) so the scene places it with a single translate
export function Guardiao({ indice, x, chao }: { indice: number; x: number; chao: number }) {
  return (
    <g transform={`translate(${x} ${chao})`}>
      <g data-guardiao={indice}>
      <g data-parte="corpo-todo">
        <text data-parte="rotulo" y={-68} textAnchor="middle" className="fill-ink-muted font-mono text-[11px]">
          {`t${indice + 1}`}
        </text>
        <g data-parte="pernas" className="stroke-accent" strokeWidth={3} strokeLinecap="round">
          <line data-parte="perna-esq" x1={-7} y1={-10} x2={-7} y2={0} />
          <line data-parte="perna-dir" x1={7} y1={-10} x2={7} y2={0} />
        </g>
        <g data-parte="braco-esq" className="stroke-accent" strokeWidth={3} strokeLinecap="round">
          <line x1={-17} y1={-30} x2={-25} y2={-17} />
        </g>
        <g data-parte="braco-dir" className="stroke-accent" strokeWidth={3} strokeLinecap="round">
          <line x1={17} y1={-30} x2={25} y2={-17} />
        </g>
        <g data-parte="corpo">
          <rect data-parte="casco" x={-18} y={-58} width={36} height={50} rx={18} className="fill-surface stroke-accent" strokeWidth={2.5} />
          <path
            data-parte="escudo"
            d="M0,-29 L7,-26 V-21 C7,-17 4,-14.5 0,-13.5 C-4,-14.5 -7,-17 -7,-21 V-26 Z"
            className="fill-accent"
          />
          <path d="M-3,-21 L-1,-19 L3,-23.5" fill="none" className="stroke-ground" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
        </g>
        <g data-parte="olhos">
          <ellipse cx={-7} cy={-42} rx={4.5} ry={5.5} className="fill-ink" />
          <ellipse cx={7} cy={-42} rx={4.5} ry={5.5} className="fill-ink" />
          <circle data-parte="pupila-esq" cx={-6} cy={-41} r={2.2} className="fill-ground" />
          <circle data-parte="pupila-dir" cx={8} cy={-41} r={2.2} className="fill-ground" />
        </g>
        <text data-parte="duvida" x={16} y={-60} opacity={0} className="fill-accent font-display text-[18px] font-bold">
          ?
        </text>
      </g>
      </g>
    </g>
  );
}
