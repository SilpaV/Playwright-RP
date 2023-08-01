import { chromium } from "@playwright/test";
import LoginPage from "./pages/login.page";
const url = require("../sharedMethods/urls.json");
const fs = require("fs");
require("dotenv").config();
let requestedUrl;
let email;
let password;

const storageState = "./RegPropsTests/.auth/state.json";

function getCredentials() {
  switch (process.env.RUN_ENV) {
    case "test":
      requestedUrl = url.testRCAUrl;
      email = "svonteru@rcanalytics.com";
      password = "Alwayshappy1@$";
      break;
    case "dev":
      requestedUrl = url.devRCAUrl;
      email = "svonteru@rcanalytics.com";
      password = "Alwayshappy1@$";

      break;
    default:
      requestedUrl = url.testRCAUrl;
      email = "svonteru@rcanalytics.com";
      password = "Alwayshappy1@$";
  }
  return { requestedUrl, email, password };
}
async function doLogin() {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await browser.newPage();

  const loginPage = new LoginPage(page);
  await loginPage.goto(getCredentials().requestedUrl);
  await loginPage.login(getCredentials().email, getCredentials().password);
  await page.waitForTimeout(3000);
  await page.context().storageState({ path: storageState });
}

async function globalSetup() {
  //Do gloabal setup if env not local
  if (process.env.RUN_ENV != "local") {
    console.log("Env is not local");
    //if file state.json already existing check origin
    if (fs.existsSync(storageState)) {
      console.log("File state.json is existing");
      const file = require("./.auth/state.json");
      const domain = file.origins[0].origin;
      //if origin is NOT the same as target env - do login
      if (!domain.includes(process.env.RUN_ENV)) {
        console.log(
          `Domain: ${file.origins[0].origin} and env is: ${process.env.RUN_ENV}! Doing re-login.`
        );
        await doLogin();
      } else {
        console.log(
          `Domain: ${file.origins[0].origin} and env is: ${process.env.RUN_ENV}! Keeping state.`
        );
      }
    } else {
      console.log("File state.json is not existing! Doing login.");
      await doLogin();
    }
  }
}
export default globalSetup;
