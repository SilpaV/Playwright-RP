const { test, expect } = require("@playwright/test");
import LandingPage from "../pages/landing.page";
import PropertyPage from "../pages/property.page";

test.describe("Login and navigate to RegProps module", () => {
  test.beforeEach(async ({ page }) => {
    const landingPange = new LandingPage(page);
    await landingPange.goto();
  });

  test("[testEnv] Should be possible to login to fourth module landing page", async ({
    page,
  }) => {
    await expect(page).toHaveURL(/.*fourth-module/);
  });

  test("[testEnv] Should be possible to navigate to property page", async ({
    page,
  }) => {
    const landingPange = new LandingPage(page);
    const propertyPage = new PropertyPage(page);

    await expect(landingPange.propertyLink).toBeVisible;

    await landingPange.gotoPropertyPage();

    await expect(propertyPage.propertyId).toBeVisible;
  });

  test("[testEnv] Should be able to see all table headers", async ({
    page,
  }) => {
    const landingPage = new LandingPage(page);

    await expect(landingPage.propertyTableAddress).toBeVisible;
    await expect(landingPage.propertyTableDescription).toBeVisible;
    await expect(landingPage.propertyTableAquisitionDate).toBeVisible;
    await expect(landingPage.propertyTableSfUnits).toBeVisible;
  });
});
