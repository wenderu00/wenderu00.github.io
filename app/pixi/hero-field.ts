import type { Sprite } from "pixi.js";
import { palette } from "./palette";
import type { Scene } from "./pixi-canvas";

const spacing = 28;
const radius = 150;
const rippleSpeed = 0.9;

type Dot = { sprite: Sprite; hx: number; hy: number; x: number; y: number; vx: number; vy: number; glow: number };

const heroField: Scene = ({ app, PIXI, host }) => {
  const section = host.parentElement ?? host;
  const texture = app.renderer.generateTexture(new PIXI.Graphics().circle(0, 0, 6).fill(0xffffff));
  const layer = new PIXI.Container();
  app.stage.addChild(layer);

  let dots: Dot[] = [];
  const pointer = { x: 0, y: 0, active: false };
  const ripples: { x: number; y: number; r: number }[] = [];

  const build = () => {
    layer.removeChildren().forEach((child) => child.destroy());
    const { width, height } = app.screen;
    dots = [];
    for (let hy = spacing / 2; hy < height; hy += spacing) {
      for (let hx = spacing / 2; hx < width; hx += spacing) {
        const sprite = new PIXI.Sprite(texture);
        sprite.anchor.set(0.5);
        sprite.tint = palette.accent;
        sprite.position.set(hx, hy);
        layer.addChild(sprite);
        dots.push({ sprite, hx, hy, x: hx, y: hy, vx: 0, vy: 0, glow: 0 });
      }
    }
  };

  const local = (event: PointerEvent) => {
    const rect = host.getBoundingClientRect();
    return { x: event.clientX - rect.left, y: event.clientY - rect.top };
  };
  const onMove = (event: PointerEvent) => Object.assign(pointer, local(event), { active: true });
  const onLeave = () => (pointer.active = false);
  const onDown = (event: PointerEvent) => {
    ripples.push({ ...local(event), r: 0 });
    if (ripples.length > 4) ripples.shift();
  };

  let time = 0;
  const tick = ({ deltaMS }: { deltaMS: number }) => {
    time += deltaMS;
    const { width, height } = app.screen;
    // the lit area drifts slowly, like the old CSS mask
    const cx = width * (0.5 + 0.25 * Math.sin(time / 6000));
    const cy = height * (0.45 + 0.3 * Math.sin(time / 4700 + 1));
    const reach = Math.max(width, height) * 0.7;

    for (const ripple of ripples) ripple.r += rippleSpeed * deltaMS;
    while (ripples.length && ripples[0].r > reach * 1.6) ripples.shift();

    for (const dot of dots) {
      let fx = (dot.hx - dot.x) * 0.05;
      let fy = (dot.hy - dot.y) * 0.05;

      if (pointer.active) {
        const dx = dot.x - pointer.x;
        const dy = dot.y - pointer.y;
        const d = Math.hypot(dx, dy) || 1;
        if (d < radius) {
          const push = (1 - d / radius) ** 2 * 6;
          fx += (dx / d) * push;
          fy += (dy / d) * push;
          dot.glow = Math.max(dot.glow, 1 - d / radius);
        }
      }

      for (const ripple of ripples) {
        const dx = dot.hx - ripple.x;
        const dy = dot.hy - ripple.y;
        const d = Math.hypot(dx, dy) || 1;
        const front = Math.abs(d - ripple.r);
        if (front < 24) {
          const fade = 1 - ripple.r / (reach * 1.6);
          fx += (dx / d) * (1 - front / 24) * 3 * fade;
          fy += (dy / d) * (1 - front / 24) * 3 * fade;
          dot.glow = Math.max(dot.glow, fade);
        }
      }

      dot.vx = (dot.vx + fx) * 0.82;
      dot.vy = (dot.vy + fy) * 0.82;
      dot.x += dot.vx;
      dot.y += dot.vy;
      dot.glow *= 0.94;

      const mask = Math.max(0, 1 - Math.hypot(dot.hx - cx, dot.hy - cy) / reach);
      dot.sprite.position.set(dot.x, dot.y);
      dot.sprite.alpha = Math.min(1, mask * 0.45 + dot.glow);
      dot.sprite.scale.set((1.2 + dot.glow * 1.6) / 6);
    }
  };

  build();
  app.renderer.on("resize", build);
  app.ticker.add(tick);
  section.addEventListener("pointermove", onMove);
  section.addEventListener("pointerleave", onLeave);
  section.addEventListener("pointerdown", onDown);

  return {
    api: undefined,
    destroy: () => {
      app.renderer.off("resize", build);
      app.ticker.remove(tick);
      section.removeEventListener("pointermove", onMove);
      section.removeEventListener("pointerleave", onLeave);
      section.removeEventListener("pointerdown", onDown);
      texture.destroy(true);
    },
  };
};

export default heroField;
