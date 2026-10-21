// Mutation testing for the "Mate o mutante" game logic only: the game should practice what it preaches.
/** @type {import("@stryker-mutator/api/core").PartialStrykerOptions} */
const config = {
  mutate: ["app/mate-o-mutante/logica.ts"],
  testRunner: "command",
  commandRunner: { command: "node --test tests/mate-o-mutante.test.mjs" },
  reporters: ["clear-text", "progress", "html"],
  thresholds: { high: 90, low: 80, break: 80 },
};

export default config;
