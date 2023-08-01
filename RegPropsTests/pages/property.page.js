import AbstractPage from "./abstract.page";

class PropertyPage extends AbstractPage {
  constructor(page) {
    super(page);
    this.propertyId = this.getByText("100007");
  }
}
module.exports = PropertyPage;
