import type { Graphics, Text } from "pixi.js";
import { monoFont, palette } from "./palette";
import type { Scene } from "./pixi-canvas";

const artifacts = ["teste E2E", "guia de arquitetura", "pipeline de CI", "gerador", "cenário BDD", "ADR", "skill"];
const stepMs = 260;
const ground = 28;

type Branch = { x1: number; y1: number; x2: number; y2: number; depth: number; tip: boolean };
type Tree = { branches: Branch[]; depth: number; born: number; graphics: Graphics; label: Text; grown: boolean; nextFruit: number };
type Fruit = { x: number; y: number; vy: number; life: number };

export type GardenApi = { plant: (x?: number) => void };
export type GardenOptions = { onPlant: (count: number) => void };

function grow(x: number, y: number, length: number, angle: number, depth: number, maxDepth: number, out: Branch[]) {
  const x2 = x + Math.cos(angle) * length;
  const y2 = y + Math.sin(angle) * length;
  const tip = depth === maxDepth;
  out.push({ x1: x, y1: y, x2, y2, depth, tip });
  if (tip) return;
  const forks = depth < 2 ? 2 : Math.random() < 0.35 ? 3 : 2;
  for (let i = 0; i < forks; i++) {
    const spread = (i / (forks - 1) - 0.5) * (0.7 + Math.random() * 0.5);
    grow(x2, y2, length * (0.68 + Math.random() * 0.12), angle + spread + (Math.random() - 0.5) * 0.3, depth + 1, maxDepth, out);
  }
}

const seedGarden: Scene<GardenOptions, GardenApi> = ({ app, PIXI, host, reduced, options }) => {
  const trees: Tree[] = [];
  const fruits: Fruit[] = [];
  const soil = new PIXI.Graphics();
  const fruitLayer = new PIXI.Graphics();
  app.stage.addChild(soil, fruitLayer);
  let planted = 0;
  let now = 0;

  const drawSoil = () => {
    const { width, height } = app.screen;
    soil.clear().moveTo(0, height - ground).lineTo(width, height - ground).stroke({ color: palette.lineStrong, width: 1 });
  };

  const plant = (at?: number) => {
    const { width, height } = app.screen;
    const margin = Math.min(80, width * 0.15);
    const x = Math.min(width - margin, Math.max(margin, at ?? margin + Math.random() * (width - margin * 2)));
    const maxDepth = 5 + Math.floor(Math.random() * 2);
    const branches: Branch[] = [];
    const trunk = Math.min(height * 0.22, 46, width / 9) * (0.8 + Math.random() * 0.4);
    grow(x, height - ground, trunk, -Math.PI / 2 + (Math.random() - 0.5) * 0.2, 0, maxDepth, branches);

    const label = new PIXI.Text({
      text: artifacts[planted % artifacts.length],
      style: { fontFamily: monoFont(), fontSize: 11, fill: palette.muted },
    });
    label.anchor.set(0.5, 0);
    label.position.set(x, height - ground + 8);
    const graphics = new PIXI.Graphics();
    app.stage.addChildAt(graphics, 1);
    app.stage.addChild(label);

    trees.push({ branches, depth: maxDepth, born: now, graphics, label, grown: false, nextFruit: now + 1500 });
    // narrow screens hold fewer trees so labels never pile up
    if (trees.length > Math.max(2, Math.floor(width / 140))) {
      const old = trees.shift()!;
      old.graphics.destroy();
      old.label.destroy();
    }
    planted += 1;
    options.onPlant(planted);
    if (reduced) draw(trees[trees.length - 1], 1);
  };

  const draw = (tree: Tree, progress: number) => {
    const g = tree.graphics.clear();
    const reach = progress * (tree.depth + 1);
    for (const b of tree.branches) {
      const part = Math.min(1, Math.max(0, reach - b.depth));
      if (part <= 0) continue;
      const x = b.x1 + (b.x2 - b.x1) * part;
      const y = b.y1 + (b.y2 - b.y1) * part;
      const color = b.depth < 2 ? palette.ink : palette.accent;
      g.moveTo(b.x1, b.y1).lineTo(x, y).stroke({ color, width: Math.max(1, 3.2 - b.depth * 0.5), alpha: 0.9 - b.depth * 0.07, cap: "round" });
      if (b.tip && part === 1) g.circle(b.x2, b.y2, 1.8).fill(palette.accent);
    }
    tree.grown = progress >= 1;
  };

  const onDown = (event: PointerEvent) => plant(event.clientX - host.getBoundingClientRect().left);

  const tick = ({ deltaMS }: { deltaMS: number }) => {
    now += deltaMS;
    for (const tree of trees) {
      if (!tree.grown) draw(tree, Math.min(1, (now - tree.born) / (stepMs * (tree.depth + 1))));
      else if (!reduced && now > tree.nextFruit) {
        // a grown seed keeps yielding value: a fruit drifts up from a random tip
        const tips = tree.branches.filter((b) => b.tip);
        const tip = tips[Math.floor(Math.random() * tips.length)];
        fruits.push({ x: tip.x2, y: tip.y2, vy: -0.02 - Math.random() * 0.02, life: 1 });
        tree.nextFruit = now + 900 + Math.random() * 1800;
      }
    }
    fruitLayer.clear();
    for (let i = fruits.length - 1; i >= 0; i--) {
      const fruit = fruits[i];
      fruit.y += fruit.vy * deltaMS;
      fruit.x += Math.sin((now + i * 300) / 300) * 0.2;
      fruit.life -= deltaMS / 2600;
      if (fruit.life <= 0) {
        fruits.splice(i, 1);
        continue;
      }
      fruitLayer.circle(fruit.x, fruit.y, 2.4).fill({ color: palette.accent, alpha: fruit.life });
    }
  };

  drawSoil();
  app.renderer.on("resize", drawSoil);
  app.ticker.add(tick);
  host.addEventListener("pointerdown", onDown);
  const { width } = app.screen;
  for (const share of width < 560 ? [0.25, 0.75] : [0.18, 0.5, 0.82]) plant(width * share);

  return {
    api: { plant },
    destroy: () => {
      app.renderer.off("resize", drawSoil);
      app.ticker.remove(tick);
      host.removeEventListener("pointerdown", onDown);
    },
  };
};

export default seedGarden;
