// @ts-check
const { defineConfig, devices } = require("@playwright/test");
const url = require("./sharedMethods/urls.json");
require("dotenv").config();

/**
 * @see https://playwright.dev/docs/test-configuration
 */
module.exports = defineConfig({
  testDir: "./RegPropsTests/tests/",

  fullyParallel: true,

  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 1 : 0,
  /* Opt out of parallel tests on CI. */

  workers: process.env.CI ? 3 : 4,
  reporter: [
    ["github"],
    ["list"],
    ["json", { outputFile: "reports/reportJsonRP.json" }],
    ["junit", { outputFile: "reports/reportRPDev.xml" }],
  ],
  globalSetup: require.resolve("./RegPropsTests/global-setup"),

  use: {
    ...devices["Desktop Chrome"],
    channel: "chrome",
    headless: true,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },

  projects: [
    {
      name: "dev",
      use: {
        baseURL: url.devRCAUrl,
        storageState: "./RegPropsTests/.auth/state.json",
      },
    },
  ],
});
