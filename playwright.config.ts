import { defineConfig, devices } from "@playwright/test";
import { defineBddProject } from "playwright-bdd";

const port = 4173;

export default defineConfig({
  forbidOnly: !!process.env.CI,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL: `http://localhost:${port}`,
  },
  projects: [
    { name: "chromium", testDir: "./e2e", use: { ...devices["Desktop Chrome"] } },
    {
      ...defineBddProject({ name: "bdd", features: "features/*.feature", steps: "e2e/steps/*.ts", outputDir: ".features-gen" }),
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: `npx serve out -l ${port}`,
    url: `http://localhost:${port}`,
    reuseExistingServer: !process.env.CI,
  },
});
