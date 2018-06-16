"use strict";

// TODO: Add more tests to make this test suite match the create-market walkthrough

import "jest-environment-puppeteer";
import {dismissDisclaimerModal} from "./helpers/dismiss-disclaimer-modal";

const url = `${process.env.AUGUR_URL}`;
const timeoutMilliseconds = 9000; // TODO: Figure out a way to reduce timeout required for certain DOM elements

jest.setTimeout(100000);

describe("Create market page", () => {
  beforeAll(async () => {
    await page.goto(url);


    // TODO: Determine what a 'typical' desktop resolution would be for our users
    await page.setViewport({
      height: 1200,
      width: 1200
    });
  });

  it("should allow user to create a new yes/no market", async () => {
    await dismissDisclaimerModal(page);

    // Go to create-market page & wait for it to load
    await page.goto(url.concat("#/create-market"), { waitUntil: "networkidle0"});
    await page.waitForSelector("#cm__input--desc", { visible: true });

    // Fill out Define page
    await expect(page).toFill("#cm__input--desc", "Will this yes/no market be created successfully?");
    await expect(page).toFill("#cm__input--cat", "Integration Test");
    await expect(page).toFill("#cm__input--tag1", "Yes/No");
    await expect(page).toFill("#cm__input--tag2", "Test");
    await expect(page).toClick("button", { text: "Next: Outcome" });

    // Fill out Outcome page
    await expect(page).toClick("li button", { text: "Yes/No" });
    await expect(page).toFill("#cm__input--details", "Here is some additional information.");
    await expect(page).toClick("button", { text: "Next: Resolution" });

    // Fill out Resolution page
    await expect(page).toClick("button", { text: "Outcome will be detailed on a public website" });
    await expect(page).toFill(".create-market-form-styles_CreateMarketForm__fields li:nth-child(1) ul li div input", "https://www.reuters.com");
    await expect(page).toClick("button", { text: "Someone Else" });
    await expect(page).toFill(".create-market-form-styles_CreateMarketForm__fields li:nth-child(2) ul li div input", "0xbd355A7e5a7ADb23b51F54027E624BfE0e238DF6");
    await expect(page).toFill("#cm__input--date", "Jan 1, 2030");
    await expect(page).toSelect("#cm__input--time div:nth-child(1) select", "11");
    await expect(page).toSelect("#cm__input--time div:nth-child(2) select", "59");
    await expect(page).toSelect("#cm__input--time div:nth-child(3) select", "PM");
    await expect(page).toClick("button", { text: "Next: Liquidity" });

    // Fill out market creator settlement fee
    await expect(page).toFill("#cm__input--settlement", "1");

    // Place buy orders
    await expect(page).toFill("#cm__input--quantity", "2");
    await expect(page).toFill("#cm__input--limit-price", "0.4");
    await expect(page).toClick("button", { text: "Add Order" });

    await expect(page).toFill("#cm__input--quantity", "1");
    await expect(page).toFill("#cm__input--limit-price", "0.37");
    await expect(page).toClick("button", { text: "Add Order" });

    await expect(page).toFill("#cm__input--quantity", "3");
    await expect(page).toFill("#cm__input--limit-price", "0.34");
    await expect(page).toClick("button", { text: "Add Order" });

    // Place sell orders
    await expect(page).toClick("button", { text: "Sell" });

    await expect(page).toFill("#cm__input--quantity", "1");
    await expect(page).toFill("#cm__input--limit-price", "0.43");
    await expect(page).toClick("button", { text: "Add Order" });

    await expect(page).toFill("#cm__input--quantity", "2");
    await expect(page).toFill("#cm__input--limit-price", "0.47");
    await expect(page).toClick("button", { text: "Add Order" });

    await expect(page).toFill("#cm__input--quantity", "2");
    await expect(page).toFill("#cm__input--limit-price", "0.5");
    await expect(page).toClick("button", { text: "Add Order" });

    // Go to the Review page
    await expect(page).toClick("button", { text: "Next: Review" });

    // Submit new market
    await expect(page).toClick("button", { text: "Submit" });

    // Make sure user is redirected to Transactions page
    await page.waitForSelector(".transactions-styles_Transaction__item", { visible: true });

    // Go to new market trading page
    await page.goto(url.concat("#/markets?category=Integration%20Test&tags=Yes%2FNo"), { waitUntil: "networkidle0"});
    await page.waitForSelector(".market-common-styles_MarketCommon__topcontent h1 span a", { visible: true });
    await expect(page).toClick(".market-common-styles_MarketCommon__topcontent h1 span a", { timeout: timeoutMilliseconds });

    // TODO: Verify settlement fee is correct & liquidity got created
  });

  it("should allow user to create a new categorical market", async () => {
    // Go to create-market page & wait for it to load
    await page.goto(url.concat("#/create-market"), { waitUntil: "networkidle0"});
    await page.waitForSelector("#cm__input--desc", { visible: true });

    // Fill out Define page
    await expect(page).toFill("#cm__input--desc", "Will this categorical market be created successfully?", { timeout: timeoutMilliseconds });
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
    await expect(page).toSelect("#cm__input--time div:nth-child(1) select", "11");
    await expect(page).toSelect("#cm__input--time div:nth-child(2) select", "59");
    await expect(page).toSelect("#cm__input--time div:nth-child(3) select", "PM");
    await expect(page).toClick("button", { text: "Next: Liquidity" });

    // Fill out market creator settlement fee
    await expect(page).toFill("#cm__input--settlement", "1");

    // Place buy orders
    await expect(page).toFill("#cm__input--quantity", "2");
    await expect(page).toFill("#cm__input--limit-price", "0.4");
    await expect(page).toClick("button", { text: "Add Order" });

    await expect(page).toFill("#cm__input--quantity", "1");
    await expect(page).toFill("#cm__input--limit-price", "0.37");
    await expect(page).toClick("button", { text: "Add Order" });

    await expect(page).toFill("#cm__input--quantity", "3");
    await expect(page).toFill("#cm__input--limit-price", "0.34");
    await expect(page).toClick("button", { text: "Add Order" });

    // Place sell orders
    await expect(page).toClick("button", { text: "Sell" });

    await expect(page).toFill("#cm__input--quantity", "1");
    await expect(page).toFill("#cm__input--limit-price", "0.43");
    await expect(page).toClick("button", { text: "Add Order" });

    await expect(page).toFill("#cm__input--quantity", "2");
    await expect(page).toFill("#cm__input--limit-price", "0.47");
    await expect(page).toClick("button", { text: "Add Order" });

    await expect(page).toFill("#cm__input--quantity", "2");
    await expect(page).toFill("#cm__input--limit-price", "0.5");
    await expect(page).toClick("button", { text: "Add Order" });

    // Go to the Review page
    await expect(page).toClick("button", { text: "Next: Review" });

    // Submit new market
    await expect(page).toClick("button", { text: "Submit" });

    // Make sure user is redirected to Transactions page
    await page.waitForSelector(".transactions-styles_Transaction__item", { visible: true });

    // Go to new market trading page
    await page.goto(url.concat("#/markets?category=Integration%20Test&tags=Categorical"), { waitUntil: "networkidle0"});
    await page.waitForSelector(".market-common-styles_MarketCommon__topcontent h1 span a", { visible: true });
    await expect(page).toClick(".market-common-styles_MarketCommon__topcontent h1 span a", { timeout: timeoutMilliseconds });

    // TODO: Verify settlement fee is correct & liquidity got created
  });

  it("should allow user to create a new scalar market", async () => {
    // Go to create-market page & wait for it to load
    await page.goto(url.concat("#/create-market"), { waitUntil: "networkidle0"});
    await page.waitForSelector("#cm__input--desc", { visible: true });

    // Fill out Define page
    await expect(page).toFill("#cm__input--desc", "Will this scalar market be created successfully?", { timeout: timeoutMilliseconds });
    await expect(page).toFill("#cm__input--cat", "Integration Test");
    await expect(page).toFill("#cm__input--tag1", "Scalar");
    await expect(page).toFill("#cm__input--tag2", "Test");
    await expect(page).toClick("button", { text: "Next: Outcome" });

    // Fill out Outcome page
    await expect(page).toClick("button", { text: "Numerical Range" });
    await expect(page).toFill(".create-market-form-outcome-styles_CreateMarketOutcome__scalar div:nth-child(1) input", "0");
    await expect(page).toFill(".create-market-form-outcome-styles_CreateMarketOutcome__scalar div:nth-child(2) input", "30");
    await expect(page).toFill(".create-market-form-outcome-styles_CreateMarketOutcome__scalar div:nth-child(3) input", "0.5");
    await expect(page).toFill(".create-market-form-outcome-styles_CreateMarketOutcome__scalar div:nth-child(4) input", "0.0001");
    await expect(page).toFill("#cm__input--details", "Here is some additional information.");
    await expect(page).toClick("button", { text: "Next: Resolution" });

    // Fill out Resolution page
    await expect(page).toClick("button", { text: "Outcome will be detailed on a public website" });
    await expect(page).toFill(".create-market-form-styles_CreateMarketForm__fields li:nth-child(1) ul li div input", "https://www.reuters.com");
    await expect(page).toClick("button", { text: "Someone Else" });
    await expect(page).toFill(".create-market-form-styles_CreateMarketForm__fields li:nth-child(2) ul li div input", "0xbd355A7e5a7ADb23b51F54027E624BfE0e238DF6");
    await expect(page).toFill("#cm__input--date", "Jan 1, 2030");
    await expect(page).toSelect("#cm__input--time div:nth-child(1) select", "11");
    await expect(page).toSelect("#cm__input--time div:nth-child(2) select", "59");
    await expect(page).toSelect("#cm__input--time div:nth-child(3) select", "PM");
    await expect(page).toClick("button", { text: "Next: Liquidity" });

    // Fill out market creator settlement fee
    await expect(page).toFill("#cm__input--settlement", "1");

    // Place buy orders
    await expect(page).toFill("#cm__input--quantity", "12");
    await expect(page).toFill("#cm__input--limit-price", "1");
    await expect(page).toClick("button", { text: "Add Order" });

    await expect(page).toFill("#cm__input--quantity", "10");
    await expect(page).toFill("#cm__input--limit-price", "2");
    await expect(page).toClick("button", { text: "Add Order" });

    await expect(page).toFill("#cm__input--quantity", "7");
    await expect(page).toFill("#cm__input--limit-price", "3");
    await expect(page).toClick("button", { text: "Add Order" });

    // Place sell orders
    await expect(page).toClick("button", { text: "Sell" });

    await expect(page).toFill("#cm__input--quantity", "2");
    await expect(page).toFill("#cm__input--limit-price", "15");
    await expect(page).toClick("button", { text: "Add Order" });

    await expect(page).toFill("#cm__input--quantity", "1");
    await expect(page).toFill("#cm__input--limit-price", "17.5");
    await expect(page).toClick("button", { text: "Add Order" });

    await expect(page).toFill("#cm__input--quantity", "2");
    await expect(page).toFill("#cm__input--limit-price", "20");
    await expect(page).toClick("button", { text: "Add Order" });

    // Go to the Review page
    await expect(page).toClick("button", { text: "Next: Review" });

    // Submit new market
    await expect(page).toClick("button", { text: "Submit" });

    // Make sure user is redirected to Transactions page
    await page.waitForSelector(".transactions-styles_Transaction__item", { visible: true });

    // Go to new market trading page
    await page.goto(url.concat("#/markets?category=Integration%20Test&tags=Scalar"), { waitUntil: "networkidle0"});
    await page.waitForSelector(".market-common-styles_MarketCommon__topcontent h1 span a", { visible: true });
    await expect(page).toClick(".market-common-styles_MarketCommon__topcontent h1 span a", { timeout: timeoutMilliseconds });

    // TODO: Verify settlement fee is correct & liquidity got created
  });
});
