import type { Container, Graphics, Text } from "pixi.js";
import { monoFont, palette } from "./palette";
import type { Scene } from "./pixi-canvas";

const maxMutants = 10;
const hitRadius = 26;
const lifespan = 14000;

type Mutant = { body: Container; legs: Graphics; x: number; y: number; heading: number; turn: number; speed: number; age: number };
type Spark = { x: number; y: number; vx: number; vy: number; life: number };
type Popup = { text: Text; life: number };

export type HuntOptions = { onScore: (killed: number, spawned: number) => void };

const mutantHunt: Scene<HuntOptions> = ({ app, PIXI, options }) => {
  const mutants: Mutant[] = [];
  const sparks: Spark[] = [];
  const popups: Popup[] = [];
  const sparkLayer = new PIXI.Graphics();
  app.stage.addChild(sparkLayer);
  let killed = 0;
  let spawned = 0;
  let nextSpawn = 0;
  let now = 0;

  const report = () => options.onScore(killed, spawned);

  const spawn = () => {
    const { width, height } = app.screen;
    const edge = Math.floor(Math.random() * 4);
    const x = edge === 0 ? -20 : edge === 1 ? width + 20 : Math.random() * width;
    const y = edge === 2 ? -20 : edge === 3 ? height + 20 : Math.random() * height;
    const body = new PIXI.Container();
    const legs = new PIXI.Graphics();
    const shell = new PIXI.Graphics()
      .ellipse(0, 0, 11, 8)
      .fill(palette.accent)
      .circle(10, 0, 4.5)
      .fill(palette.accent)
      .moveTo(13, -3)
      .lineTo(19, -8)
      .moveTo(13, 3)
      .lineTo(19, 8)
      .stroke({ color: palette.accent, width: 1.5 })
      .moveTo(-6, 0)
      .lineTo(4, 0)
      .stroke({ color: 0x000000, width: 1.5 });
    body.addChild(legs, shell);
    body.position.set(x, y);
    app.stage.addChildAt(body, 0);
    mutants.push({
      body,
      legs,
      x,
      y,
      heading: Math.atan2(height / 2 - y, width / 2 - x),
      turn: 0,
      speed: 0.05 + Math.random() * 0.05,
      age: 0,
    });
    spawned += 1;
    report();
  };

  const remove = (index: number) => {
    mutants[index].body.destroy({ children: true });
    mutants.splice(index, 1);
  };

  const onDown = (event: PointerEvent) => {
    if ((event.target as Element | null)?.closest("a, button")) return;
    const rect = app.canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const index = mutants.findIndex((m) => Math.hypot(m.x - x, m.y - y) < hitRadius);
    if (index < 0) return;
    const mutant = mutants[index];
    for (let i = 0; i < 14; i++) {
      const angle = (i / 14) * Math.PI * 2;
      const speed = 0.08 + Math.random() * 0.12;
      sparks.push({ x: mutant.x, y: mutant.y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, life: 1 });
    }
    const text = new PIXI.Text({ text: "mutante morto", style: { fontFamily: monoFont(), fontSize: 12, fill: palette.accent } });
    text.anchor.set(0.5);
    text.position.set(mutant.x, mutant.y - 18);
    app.stage.addChild(text);
    popups.push({ text, life: 1 });
    remove(index);
    killed += 1;
    report();
  };

  const tick = ({ deltaMS }: { deltaMS: number }) => {
    now += deltaMS;
    const { width, height } = app.screen;
    if (now > nextSpawn && mutants.length < maxMutants) {
      spawn();
      nextSpawn = now + 700 + Math.random() * 900;
    }

    for (let i = mutants.length - 1; i >= 0; i--) {
      const m = mutants[i];
      m.age += deltaMS;
      m.turn += (Math.random() - 0.5) * 0.02;
      m.turn *= 0.95;
      m.heading += m.turn;
      // steer back toward the middle while alive, wander off once it survived
      const home = Math.atan2(height / 2 - m.y, width / 2 - m.x);
      const away = m.age > lifespan;
      const target = away ? home + Math.PI : home;
      const off = Math.atan2(Math.sin(target - m.heading), Math.cos(target - m.heading));
      if (away || Math.hypot(width / 2 - m.x, height / 2 - m.y) > Math.min(width, height) * 0.45) m.heading += off * 0.03;
      m.x += Math.cos(m.heading) * m.speed * deltaMS;
      m.y += Math.sin(m.heading) * m.speed * deltaMS;
      m.body.position.set(m.x, m.y);
      m.body.rotation = m.heading;

      const swing = Math.sin(now / 60 + i) * 3;
      m.legs.clear();
      for (const side of [-1, 1]) {
        for (const at of [-6, 0, 6]) {
          const phase = at === 0 ? -swing : swing;
          m.legs.moveTo(at, 0).lineTo(at + phase, side * 13);
        }
      }
      m.legs.stroke({ color: palette.accent, width: 1.4 });

      if (away && (m.x < -40 || m.y < -40 || m.x > width + 40 || m.y > height + 40)) remove(i);
    }

    sparkLayer.clear();
    for (let i = sparks.length - 1; i >= 0; i--) {
      const s = sparks[i];
      s.x += s.vx * deltaMS;
      s.y += s.vy * deltaMS;
      s.life -= deltaMS / 600;
      if (s.life <= 0) sparks.splice(i, 1);
      else sparkLayer.circle(s.x, s.y, 2).fill({ color: palette.accent, alpha: s.life });
    }
    for (let i = popups.length - 1; i >= 0; i--) {
      const p = popups[i];
      p.life -= deltaMS / 900;
      p.text.y -= deltaMS * 0.03;
      p.text.alpha = Math.max(0, p.life);
      if (p.life <= 0) {
        p.text.destroy();
        popups.splice(i, 1);
      }
    }
  };

  app.ticker.add(tick);
  window.addEventListener("pointerdown", onDown);

  return {
    api: undefined,
    destroy: () => {
      app.ticker.remove(tick);
      window.removeEventListener("pointerdown", onDown);
    },
  };
};

export default mutantHunt;
