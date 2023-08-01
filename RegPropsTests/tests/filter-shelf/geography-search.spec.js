const { test, expect } = require("@playwright/test");

import LandingPage from "../../pages/landing.page";

test.describe("[devEnv] Geography filter shelf", () => {
  test.beforeEach(async ({ page }) => {
    const landingPage = new LandingPage(page);

    await landingPage.goto();
    await landingPage.toggleGeographyFilter();
  });

  test("Shopping cart should be empty if no selection is made", async ({
    page,
  }) => {
    const landingPage = new LandingPage(page);

    await expect(landingPage.shoppingCartEmptyText).toBeVisible();
  });

  test("The metro/market list should be visible by default in the picklist", async ({
    page,
  }) => {
    const landingPage = new LandingPage(page);

    await landingPage.toggleGeographyPicklist();

    await expect(landingPage.picklistSubmarketMetroMarket).toBeVisible();

    const picklistItemsCount = await landingPage.picklistItem.count();

    await expect(picklistItemsCount).toBeGreaterThanOrEqual(1);
  });

  test("Should be possible to add geography items to the shopping cart via picklist", async ({
    page,
  }) => {
    const landingPage = new LandingPage(page);

    await landingPage.selectGeographyPicklistItem();

    await expect(landingPage.shoppingCartItems).toHaveCount(1);
  });

  test("Should be possible to remove geography from the shopping cart", async ({
    page,
  }) => {
    const landingPage = new LandingPage(page);

    await landingPage.selectGeographyPicklistItem();

    await landingPage.shoppingCartRemoveButton.click();

    await expect(landingPage.shoppingCartItems).toHaveCount(0);
    await expect(landingPage.shoppingCartEmptyText).toBeVisible();
  });

  test("Should be possible to exclude geography from the shopping cart", async ({
    page,
  }) => {
    const landingPage = new LandingPage(page);

    await landingPage.selectGeographyPicklistItem();

    await expect(landingPage.shoppingCartExcludeButton).toBeVisible();
    await landingPage.shoppingCartExcludeButton.click();
    await expect(landingPage.shoppingCartExcludeButton).not.toBeVisible();
  });
});
