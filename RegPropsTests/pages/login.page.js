import AbstractPage from "./abstract.page";

class LoginPage extends AbstractPage {
  constructor(page) {
    super(page);
    this.clickHereToLoginButton = page.locator(".login-btn", {
      hasText: "Click Here to Log In",
    });
    this.email = page.locator("#username");
    this.password = page.locator("#password");
    this.signInButton = page.getByRole("button", { name: "Sign In" });
    this.mainLogo = page.locator(".mainLogo");
  }

  async goto(url) {
    await this.page.goto(url + "/");
  }

  async login(email = process.env.email, pass = process.env.pass) {
    await this.clickHereToLoginButton.click();
    await this.email.type(email);
    await this.signInButton.click();
    await this.password.type(pass);
    await this.signInButton.click();
    await this.mainLogo.waitFor();
  }
}

module.exports = LoginPage;