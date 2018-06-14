import "jest-environment-puppeteer";
const puppeteer = require('puppeteer');
import {UnlockedAccounts} from "./constants/accounts";

const url = `${process.env.AUGUR_URL}`;

jest.setTimeout(1000000);

describe("Create market page", () => {
  beforeAll(async () => {
    await page.goto(url);

    // TODO: Determine what a 'typical' desktop resolution would be for our users
    await page.setViewport({
      height: 1200,
      width: 1200
    });
  });

  it("should allow user to create a new binary market", async () => {
    // Dismiss approval popup
    await page.waitForSelector(".modal-disclaimer-styles_ModalDisclaimer__ActionButtons");
    await expect(page).toClick("button", { text: "I have read and understand the above" });

    // Go to create-market page & wait for it to load
    await expect(page).toClick("a[href$='#/create-market']");
    await page.waitForSelector("#cm__input--desc");

    // Fill out Define page
    await expect(page).toFill("#cm__input--desc", "Will this yesno market be created successfully?");
    await expect(page).toFill("#cm__input--cat", "Integration Test");
    await expect(page).toFill("#cm__input--tag1", "YesNo");
    await expect(page).toFill("#cm__input--tag2", "Test");
    await expect(page).toClick("button", { text: "Next: Outcome" });

    // Fill out Outcome page
    await expect(page).toClick("button", { text: "Yes/No" });
    await expect(page).toFill("#cm__input--details", "Here is some additional information.");
    await expect(page).toClick("button", { text: "Next: Resolution" });

    // Fill out Resolution page
    await expect(page).toClick("button", { text: "Outcome will be detailed on a public website" });
    await expect(page).toFill(".create-market-form-styles_CreateMarketForm__fields li:nth-child(1) ul li div input", "https://www.reuters.com");
    await expect(page).toClick("button", { text: "Someone Else" });
    await expect(page).toFill(".create-market-form-styles_CreateMarketForm__fields li:nth-child(2) ul li div input", "0xbd355A7e5a7ADb23b51F54027E624BfE0e238DF6");
    await expect(page).toFill("#cm__input--date", "Jan 1, 2030");
    await expect(page).toSelect("#cm__input--time div:nth-child(1) select", "1");
    await expect(page).toSelect("#cm__input--time div:nth-child(2) select", "00");
    await expect(page).toSelect("#cm__input--time div:nth-child(3) select", "AM");
    await expect(page).toClick("button", { text: "Next: Liquidity" });

    // Fill out Liquidity page
    await expect(page).toFill("#cm__input--settlement", "1");
    await expect(page).toFill("#cm__input--quantity", "1");
    await expect(page).toFill("#cm__input--limit-price", "0.5");
    await expect(page).toClick("button", { text: "Add Order" });
    await expect(page).toClick("button", { text: "Next: Review" });

    // Submit new market on Review page
    await expect(page).toClick("button", { text: "Submit" });

    await page.waitForSelector(".side-nav-styles_SideNav__item--selected a");
    await expect(page).toClick("a[href$='#/markets']");
  });

  it("should allow user to create a new categorical market", async () => {
    // Go to create-market page & wait for it to load
    await page.goto(url.concat("#/create-market"));
    await page.waitForSelector("#cm__input--desc");

    // Fill out Define page
    await expect(page).toFill("#cm__input--desc", "Will this categorical market be created successfully?");
    await expect(page).toFill("#cm__input--cat", "Integration Test");
    await expect(page).toFill("#cm__input--tag1", "Categorical");
    await expect(page).toFill("#cm__input--tag2", "Test");
    await expect(page).toClick("button", { text: "Next: Outcome" });

    // Fill out Outcome page
    await expect(page).toClick("button", { text: "Multiple Choice" });
    await expect(page).toFill(".create-market-form-outcome-styles_CreateMarketOutcome__categorical div:nth-child(1) input", "Outcome 1");
    await expect(page).toFill(".create-market-form-outcome-styles_CreateMarketOutcome__categorical div:nth-child(2) input", "Outcome 2");
    await expect(page).toFill(".create-market-form-outcome-styles_CreateMarketOutcome__categorical div:nth-child(3) input", "Outcome 3");
    await expect(page).toFill(".create-market-form-outcome-styles_CreateMarketOutcome__categorical div:nth-child(4) input", "Outcome 4");
    await expect(page).toFill(".create-market-form-outcome-styles_CreateMarketOutcome__categorical div:nth-child(5) input", "Outcome 5");
    await expect(page).toFill(".create-market-form-outcome-styles_CreateMarketOutcome__categorical div:nth-child(6) input", "Outcome 6");
    await expect(page).toFill(".create-market-form-outcome-styles_CreateMarketOutcome__categorical div:nth-child(7) input", "Outcome 7");
    await expect(page).toFill(".create-market-form-outcome-styles_CreateMarketOutcome__categorical div:nth-child(8) input", "Outcome 8");
    await expect(page).toFill("#cm__input--details", "Here is some additional information.");
    await expect(page).toClick("button", { text: "Next: Resolution" });

    // Fill out Resolution page
    await expect(page).toClick("button", { text: "Outcome will be detailed on a public website" });
    await expect(page).toFill(".create-market-form-styles_CreateMarketForm__fields li:nth-child(1) ul li div input", "https://www.reuters.com");
    await expect(page).toClick("button", { text: "Someone Else" });
    await expect(page).toFill(".create-market-form-styles_CreateMarketForm__fields li:nth-child(2) ul li div input", "0xbd355A7e5a7ADb23b51F54027E624BfE0e238DF6");
    await expect(page).toFill("#cm__input--date", "Jan 1, 2030");
    await expect(page).toSelect("#cm__input--time div:nth-child(1) select", "1");
    await expect(page).toSelect("#cm__input--time div:nth-child(2) select", "00");
    await expect(page).toSelect("#cm__input--time div:nth-child(3) select", "AM");
    await expect(page).toClick("button", { text: "Next: Liquidity" });

    // Fill out Liquidity page
    await expect(page).toFill("#cm__input--settlement", "1");
    await expect(page).toFill("#cm__input--quantity", "1");
    await expect(page).toFill("#cm__input--limit-price", "0.5");
    await expect(page).toClick("button", { text: "Add Order" });
    await expect(page).toClick("button", { text: "Next: Review" });

    // Submit new market on Review page
    const navigationPromise = page.waitForNavigation({ waitUntil: "networkidle0" });
    await expect(page).toClick("button", { text: "Submit" });
    await navigationPromise;

    await page.goto(url.concat("#/markets?category=Integration%20Test"), { waitUntil: "networkidle0" });
    // TODO: Add check to ensure market was created
  });

  // it("should allow user to create a new scalar market", async () => {
  //   await page.goto(url.concat("#/create-market"), { waitUntil: "networkidle0" });

  //   // Fill out Define page
  //   await expect(page).toFill("#cm__input--desc", "Will this scalar market be created successfully?");
  //   await expect(page).toFill("#cm__input--cat", "Integration Test");
  //   await expect(page).toFill("#cm__input--tag1", "Scalar");
  //   await expect(page).toFill("#cm__input--tag2", "Test");
  //   await expect(page).toClick("button", { text: "Next: Outcome" });

  //   // Fill out Outcome page
  //   await expect(page).toClick("button", { text: "Numerical Range" });
  //   await expect(page).toFill(".create-market-form-outcome-styles_CreateMarketOutcome__scalar div:nth-child(1) input", "0");
  //   await expect(page).toFill(".create-market-form-outcome-styles_CreateMarketOutcome__scalar div:nth-child(2) input", "100");
  //   await expect(page).toFill(".create-market-form-outcome-styles_CreateMarketOutcome__scalar div:nth-child(3) input", "0.5");
  //   await expect(page).toFill(".create-market-form-outcome-styles_CreateMarketOutcome__scalar div:nth-child(4) input", "0.0001");
  //   await expect(page).toFill("#cm__input--details", "Here is some additional information.");
  //   await expect(page).toClick("button", { text: "Next: Resolution" });

  //   // Fill out Resolution page
  //   await expect(page).toClick("button", { text: "Outcome will be detailed on a public website" });
  //   await expect(page).toFill(".create-market-form-styles_CreateMarketForm__fields li:nth-child(1) ul li div input", "https://www.reuters.com");
  //   await expect(page).toClick("button", { text: "Someone Else" });
  //   await expect(page).toFill(".create-market-form-styles_CreateMarketForm__fields li:nth-child(2) ul li div input", "0xbd355A7e5a7ADb23b51F54027E624BfE0e238DF6");
  //   await expect(page).toFill("#cm__input--date", "Jan 1, 2030");
  //   await expect(page).toSelect("#cm__input--time div:nth-child(1) select", "1");
  //   await expect(page).toSelect("#cm__input--time div:nth-child(2) select", "00");
  //   await expect(page).toSelect("#cm__input--time div:nth-child(3) select", "AM");
  //   await expect(page).toClick("button", { text: "Next: Liquidity" });

  //   // Fill out Liquidity page
  //   await expect(page).toFill("#cm__input--settlement", "1");
  //   await expect(page).toFill("#cm__input--quantity", "1");
  //   await expect(page).toFill("#cm__input--limit-price", "0.5");
  //   await expect(page).toClick("button", { text: "Add Order" });
  //   await expect(page).toClick("button", { text: "Next: Review" });

  //   // Submit new market on Review page
  //   const navigationPromise = page.waitForNavigation({ waitUntil: "networkidle0" });
  //   await expect(page).toClick("button", { text: "Submit" });
  //   await navigationPromise;

  //   await page.goto(url.concat("#/markets?category=Integration%20Test"), { waitUntil: "networkidle0" });
  //   // TODO: Add check to ensure market was created
  // });
});
