// the body starts as a single "pixel"; the scene morphs it into FORMA_MUTANTE when it appears
export const FORMA_PIXEL = "M-4,-4 L4,-4 L4,4 L-4,4 Z";
export const FORMA_MUTANTE =
  "M0.0,-13.0 L4.5,-7.8 L10.4,-6.0 L8.5,0.0 L11.7,6.7 L4.5,7.8 L0.0,11.5 L-4.0,6.9 L-11.3,6.5 L-9.5,0.0 L-10.4,-6.0 L-4.3,-7.4 Z";

export function Mutante({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <g data-mutante opacity={0}>
      <g data-parte="glitch" opacity={0.7}>
        <path data-parte="sombra-a" d={FORMA_PIXEL} className="fill-accent" transform="translate(-2 0)" />
        <path data-parte="sombra-b" d={FORMA_PIXEL} className="fill-ink" transform="translate(2 0)" />
      </g>
      <g data-parte="antenas" className="stroke-mutant" strokeWidth={1.8} strokeLinecap="round" fill="none">
        <path d="M-3,-11 L-6,-18" />
        <path d="M3,-11 L7,-17" />
      </g>
      <path data-parte="corpo" d={FORMA_PIXEL} className="fill-mutant" />
      <g data-parte="olhos">
        <circle cx={-3.5} cy={-1.5} r={4} className="fill-ink" />
        <circle cx={-3} cy={-1} r={1.8} className="fill-ground" />
        <circle cx={5} cy={-3} r={2.2} className="fill-ink" />
        <circle cx={5.4} cy={-2.8} r={1} className="fill-ground" />
      </g>
      </g>
    </g>
  );
}
