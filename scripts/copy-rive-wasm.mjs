import { copyFileSync, mkdirSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";

// Serve the Rive runtime from the site itself instead of a third-party CDN.
const require = createRequire(import.meta.url);
const source = path.join(path.dirname(require.resolve("@rive-app/canvas")), "rive.wasm");
const target = path.resolve(import.meta.dirname, "..", "public", "rive", "rive.wasm");

mkdirSync(path.dirname(target), { recursive: true });
copyFileSync(source, target);
