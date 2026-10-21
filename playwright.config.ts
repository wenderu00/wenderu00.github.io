import { defineConfig, devices } from "@playwright/test";
import { defineBddConfig } from "playwright-bdd";

const port = 4173;

const bddTestDir = defineBddConfig({
  features: "e2e/features/*.feature",
  steps: "e2e/steps/*.ts",
  outputDir: ".features-gen",
  language: "pt",
});

export default defineConfig({
  forbidOnly: !!process.env.CI,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL: `http://localhost:${port}`,
  },
  projects: [
    { name: "chromium", testDir: "./e2e", use: { ...devices["Desktop Chrome"] } },
    // reduced motion keeps the BDD scenarios independent of animation timing
    { name: "bdd", testDir: bddTestDir, use: { ...devices["Desktop Chrome"], reducedMotion: "reduce" } },
    {
      name: "bdd-celular",
      testDir: bddTestDir,
      use: { ...devices["Pixel 7"], viewport: { width: 360, height: 740 }, reducedMotion: "reduce" },
    },
  ],
  webServer: {
    command: `npx serve out -l ${port}`,
    url: `http://localhost:${port}`,
    reuseExistingServer: !process.env.CI,
  },
});
