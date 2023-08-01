# Playwright-RP
Playwright Registered Properties
# Playwright-RP RegPropsTests setup

For RegPropsTests testing we are using [**Playwright** ](https://playwright.dev/docs/intro)

## Setup project

Setup project should be done only **!once!** if any of the steps are not working with `Error: self signed certificate in certificate chain` look into root [README](../README.md) to fix the problem

FROM ROOT: 
1. Install yarn if you don't already have it

```sh
npm install -g yarn
```

2. Install the project packages

```sh
yarn install
```

3. Init playwright and add [browsers](https://playwright.dev/docs/intro)

```sh
yarn create playwright
```
- when running command you will be prompted with several questions:
  - Do you want to use TypeScript or JavaScript? -> JavaScript
  - Where to put your end-to-end tests? -> RegPropsTests/tests
  - Add a GitHub Actions workflow? -> false
  - Install Playwright browsers (can be done manually via 'yarn playwright install')? - true (wait for browsers to be installed)
  - ... playwright.config.js already exists. Override it? -> false
  - You're all set!

- After all questions folder test-examples with demo spec will be created, view it and **delete**.

## Adding tests
If any of the steps are not working with `Error: self signed certificate in certificate chain` look into root [README](../README.md) to fix the problem.

All tests located in **tests** folder. 
All tests should have name *testName.**spec**.js*(e.g login.spec.js)

We are using POM (page object model) for defining selectors and methods in order to keep tests clean, understandable and easy to debug. More about POM can be found [here](https://playwright.dev/docs/pom)

Usefull links for test anotations:
- https://playwright.dev/docs/api/class-test 

All pages located in pages folder and should have name *pageName.page.js*(e.g landing.page.js)

Usefull links:
 - locators: since we have app in iframe in test/dev env and no iframe locally, we are using custom made locators, which can switch automatically beetween envs.
  
**Usage:**

```sh
this.geography = this.getByText("Geography", { exact: true });
this.propertyLink = this.getLocator("a[href*='RP']");

  ```
  Availabel commands:
  - this.getByText
  - this.getByRole
  - this.getLocator
  - this.getByTestId

 - [actions](https://playwright.dev/docs/input)
 - [assertions](https://playwright.dev/docs/test-assertions)
 - [best practices](https://playwright.dev/docs/best-practices#best-practices)

## Running tests
Tests can be ran in several different ways:

We have several environments to run tests against:
1. From terminal will run all tests from tests folder in headed mode (browser will be launched)
   
- test:
  - yarn pw-test

- local:
  - yarn pw-local

- dev:
  - yarn pw-dev


1. From [VSCode](https://playwright.dev/docs/getting-started-vscode):
    - Install the VS Code extension from the marketplace or from the extensions tab in VS Code.(*Note: Use **Microsoft** publisher*)
    - You can run a single test by clicking the green triangle next to your test block to run your test. Playwright will run through each line of the test and when it finishes you will see a green tick next to your test block as well as the time it took to run the test.
    - Run tests against different profiles:
      - Right clcik on the triangle close to your desired test and select "Execute against profile"
      - Select run profile: Run {1.test, 2.local, 3.dev}
      - OR Select debug profile: Debug {1.test, 2.local, 3.dev}
      - For dev/test env: create .env file in root and set 
        ```sh
        RUN_ENV={"test"/"dev"}
        ```

## Debugging tests
Same as runing, test can be debugged in several ways:
1. From terminal:
     ```sh
    yarn pwd-test
    ```
    Will run all tests from tests folder in debug mode. Special utility from Playwright will be launched, so that debugging can be as smooth as possible.
  
2. From [VSCode](https://playwright.dev/docs/getting-started-vscode#debugging-tests)
    - Right clicking on the line next to the test you want to run and select "Debug Test"
    - Test will start in debug mode and Playwright Debugger will be shown in the left panel

### Test results
After test run few reports will be genereted to ```reports/``` folder:
 - reportE2E.xml - in order to publish tests in Azure Dashboard
 - reportJsonE2E.json - in order to send messages to teams.

Playwright using default ```list``` reporter and ```github``` reporter.

In case test has failed all results will be located in ```test-results/folder``` 

Each test in case of failure producing screenshot: ```test-results/testName/test-failed-1.png``` and a trace, which is a very convinient way for debugging tests. 
After test run and failed, you'll see massage how to open specific trace for the test, for example:
```sh
attachment #1: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results\login-Login-and-navigate-to-RP-module-Test-expecting-second-module-instead-of-fourth---fail-test\trace.zip
    Usage:

        npx playwright show-trace test-results\login-Login-and-navigate-to-RP-module-Test-expecting-second-module-instead-of-fourth---fail-test\trace.zip
```
run command 
```sh
npx playwright show-trace test-results\login-Login-and-navigate-to-RP-module-Test-expecting-second-module-instead-of-fourth---fail-test\trace.zip
```
and local trace viewer will be opened.
It is also possible to use trace viewer in the browser, just follow the [link](https://trace.playwright.dev/) and upload .zip file.

More about trace-viwer can be found [here](https://playwright.dev/docs/trace-viewer-intro#viewing-the-trace)