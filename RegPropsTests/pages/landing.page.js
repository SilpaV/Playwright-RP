import AbstractPage from "./abstract.page";

class LandingPage extends AbstractPage {
  constructor(page) {
    super(page);
    this.propertyLink = this.getLocator("a[href*='ukkk/detail/100007']");
    this.propertyTableAddress = this.getByText("Address");
    this.propertyTableDescription = this.getByText("Description");
    this.propertyTableAquisitionDate = this.getByText("Aquisition Date");
    this.propertyTableSfUnits = this.getByText("SF/Units");

    // Filter shelf
    this.filterShelfGeography = this.getByText("Geography");
    this.picklistItem = this.getByTestId("filter-shelf-picklist-item");

    // Picklist
    this.picklistToggleButton = this.getByTestId(
      "filter-shelf-picklist-button"
    );
    this.picklistSubmarketMetroMarket = this.getByText("Metro/Market");
    this.picklistItem = this.getByTestId("filter-shelf-picklist-item");
    this.picklistZones = this.getByTestId("filter-shelf-picklist-zones")


    // Shopping cart
    this.shoppingCartEmptyText = this.getByText(
      "Geographies selected below will appear here."
    );
    this.shoppingCartItems = this.getByTestId(
      "filter-shelf-shopping-cart-item"
    );
    this.shoppingCartRemoveButton = this.getByTestId(
      "filter-shelf-shopping-cart-button-remove"
    );
    this.shoppingCartExcludeButton = this.getByTestId(
      "filter-shelf-shopping-cart-button-exclude"
    );
    this.shoppingCartIncludeButton = this.getByTestId(
      "filter-shelf-shopping-cart-button-include"
    );
  }

  async goto() {
    await this.page.goto("/");
    if (this.page.url().includes("rcanalytics")) {
      await this.page.goto("/fourth-module");
    }
  }

  async gotoPropertyPage() {
    if (process.env.RUN_ENV == "dev") {
      this.page.waitForTimeout(4000);
      await this.propertyLink.click();
    } else {
      await this.propertyLink.click();
    }
  }

  async toggleGeographyFilter() {
    await this.filterShelfGeography.click();
    await this.picklistToggleButton.waitFor()
  }

  async toggleGeographyPicklist() {
    await this.picklistToggleButton.click();
    await this.picklistZones.waitFor()
  }

  async selectGeographyPicklistItem() {
    await this.toggleGeographyPicklist();
    await this.picklistItem.first().click();
  }
}

module.exports = LandingPage;
