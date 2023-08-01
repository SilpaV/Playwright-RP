class AbstractPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;

    this.fourthModuleIFrame = page.frameLocator("#fourthModuleIFrame");
  }

  getByText(locator) {
    if (process.env.RUN_ENV!= "local") {
    
      return this.fourthModuleIFrame.getByText(locator);
    } else return this.page.getByText(locator);
  }

  getByRole(role, name) {
    if (process.env.RUN_ENV!= "local") {
      return this.page
        .frameLocator("#fourthModuleIFrame")
        .getByRole(`${role}[name="${name}"i]`);
    } else return this.page.getByRole(`${role}[name="${name}"i]`);
  }

  getLocator(locator) {
    if (process.env.RUN_ENV!= "local") {
      return this.fourthModuleIFrame.locator(locator);
    } else return this.page.locator(locator);
  }

  getByTestId(locator) {
    if (process.env.RUN_ENV!= "local") {
      return this.fourthModuleIFrame.getByTestId(locator);
    } else return this.page.getByTestId(locator);
  }
}

module.exports = AbstractPage;
