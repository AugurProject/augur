"use strict";

import "jest-environment-puppeteer";
import Flash from "./helpers/flash";
import { IFlash, IMarket, MarketCosts } from "./types/types";
import {
  OrderType,
  createLiquidity,
  verifyLiquidity
} from "./helpers/liquidity";
import { UnlockedAccounts } from "./constants/accounts";
import { waitNextBlock } from "./helpers/wait-new-block";
require("./helpers/beforeAll");

// TODO: Replace uses of `url` with calls to functions in navigation-helper
const url = `${process.env.AUGUR_URL}`;
const timeoutMilliseconds = 10000; // TODO: Figure out a way to reduce timeout required for certain DOM elements

jest.setTimeout(100000);

let flash: IFlash = new Flash();

describe("Create market page", () => {
  it("should allow user to create a new yes/no market", async () => {
    // Go to create-market page and wait for it to load
    await page.goto(url.concat("#/create-market"), {
      waitUntil: "networkidle0"
    });
    await page.waitForSelector("#cm__input--desc", { visible: true });

    // Verify that a market must have a Market Question and a Category, but Tags are optional
    let isDisabled = await page.$eval(
      ".create-market-form-styles_CreateMarketForm__next",
      el => el.disabled
    );
    expect(isDisabled).toEqual(true);

    await expect(page).toFill(
      "#cm__input--desc",
      "Will this yes/no market be created successfully?"
    );

    isDisabled = await page.$eval(
      ".create-market-form-styles_CreateMarketForm__next",
      el => el.disabled
    );
    expect(isDisabled).toEqual(true);

    await page.$eval("#cm__input--desc", input => (input.value = ""));
    await expect(page).toFill("#cm__input--cat", "climate");

    isDisabled = await page.$eval(
      ".create-market-form-styles_CreateMarketForm__next",
      el => el.disabled
    );
    expect(isDisabled).toEqual(false);

    // Verify that Tags and Category must be unique
    await expect(page).toFill("#cm__input--tag1", "climate");

    isDisabled = await page.$eval(
      ".create-market-form-styles_CreateMarketForm__next",
      el => el.disabled
    );
    expect(isDisabled).toEqual(true);

    await page.$eval("#cm__input--cat", input => (input.value = ""));
    await page.$eval("#cm__input--tag1", input => (input.value = ""));

    // Verify suggested category is populated as Category name is typed and that it can be clicked to auto-fill the Category field
    await expect(page).toFill("#cm__input--cat", "cli");
    await expect(page).toMatchElement(
      ".create-market-form-define-styles_CreateMarketDefine__suggested-categories li button:nth-child(1)",
      { text: "CLIMATE" }
    );
    await expect(page).toClick(
      ".create-market-form-define-styles_CreateMarketDefine__suggested-categories li button:nth-child(1)"
    );
    let categoryValue = await page.$eval("#cm__input--cat", el => el.value);
    expect(categoryValue).toEqual("CLIMATE");

    await page.$eval("#cm__input--cat", input => (input.value = ""));

    // Fill out Define page
    await expect(page).toFill(
      "#cm__input--desc",
      "Will this yes/no market be created successfully?"
    );
    await expect(page).toFill("#cm__input--cat", "Integration Test");
    await expect(page).toFill("#cm__input--tag1", "Yes/No");
    await expect(page).toFill("#cm__input--tag2", "Test");


    await expect(page).toMatchElement(
      ".category-tag-trail-styles_CategoryTagTrail .word-trail-styles_WordTrail:nth-child(1) .tag-trail-button",
      { text: "Integration Test" }
    );
    await expect(page).toMatchElement(".tag-trail-button", { text: "Yes/No" });
    await expect(page).toMatchElement(".tag-trail-button", { text: "Test" });

    await expect(page).toClick("button", { text: "Next: Outcome" });

    // Fill out Outcome page
    await expect(page).toClick("li button", { text: "Yes/No" });

    // Verify that the Additional Details field is optional
    isDisabled = await page.$eval(
      ".create-market-form-styles_CreateMarketForm__next",
      el => el.disabled
    );
    expect(isDisabled).toEqual(false);

    await expect(page).toFill(
      "#cm__input--details",
      "Here is some additional information."
    );
    await expect(page).toClick("button", { text: "Next: Resolution" });

    // Fill out Resolution page
    // Confirm that the Datepicker doesn't allow the user to choose a day in the past
    await expect(page).toClick("#cm__input--date");
    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("Enter");
    const currentDateString = await page.$eval(
      "#cm__input--date",
      el => el.value
    );
    await expect(page).toClick("#cm__input--date");
    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("ArrowLeft");
    await page.keyboard.press("Enter");
    let endDateString = await page.$eval("#cm__input--date", el => el.value);
    expect(currentDateString).toEqual(endDateString);

    await expect(page).toClick("#cm__input--date");
    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("ArrowRight");
    await page.keyboard.press("Enter");

    await expect(page).toSelect(
      "#cm__input--time div:nth-child(1) select",
      "11"
    );
    await expect(page).toSelect(
      "#cm__input--time div:nth-child(2) select",
      "59"
    );
    await expect(page).toSelect(
      "#cm__input--time div:nth-child(3) select",
      "PM"
    );

    endDateString = await page.$eval("#cm__input--date", el => el.value);
    endDateString += " 11:59 PM";
    const endDate = new Date(endDateString);

    // Verify that the Designated Reporter is required
    await expect(page).toClick("button", {
      text: "Outcome will be detailed on a public website"
    });
    await expect(page).toFill(
      ".create-market-form-styles_CreateMarketForm__fields li:nth-child(1) ul li div input",
      "a"
    );
    isDisabled = await page.$eval(
      ".create-market-form-styles_CreateMarketForm__next",
      el => el.disabled
    );
    expect(isDisabled).toEqual(true);
    await page.keyboard.press("Backspace");

    // Verify that the Resolution Source is required
    await expect(page).toClick("button", { text: "Someone Else" });
    await expect(page).toFill(
      ".create-market-form-styles_CreateMarketForm__fields li:nth-child(2) ul li div input",
      "0xbd355A7e5a7ADb23b51F54027E624BfE0e238DF6"
    );
    isDisabled = await page.$eval(
      ".create-market-form-styles_CreateMarketForm__next",
      el => el.disabled
    );
    expect(isDisabled).toEqual(true);

    await expect(page).toFill(
      ".create-market-form-styles_CreateMarketForm__fields li:nth-child(1) ul li div input",
      "https://www.reuters.com"
    );
    await expect(page).toClick("button", { text: "Next: Liquidity" });

    // Fill out Liquidity page
    // Verify Settlement Fee is required and must be a number between 0 and 100
    await expect(page).toClick("#cm__input--settlement");
    await page.keyboard.press("Backspace");
    isDisabled = await page.$eval(
      ".create-market-form-styles_CreateMarketForm__next",
      el => el.disabled
    );
    expect(isDisabled).toEqual(true);
    await expect(page).toFill("#cm__input--settlement", "-1");
    isDisabled = await page.$eval(
      ".create-market-form-styles_CreateMarketForm__next",
      el => el.disabled
    );
    expect(isDisabled).toEqual(true);
    await expect(page).toFill("#cm__input--settlement", "101");
    isDisabled = await page.$eval(
      ".create-market-form-styles_CreateMarketForm__next",
      el => el.disabled
    );
    expect(isDisabled).toEqual(true);
    await expect(page).toFill("#cm__input--settlement", "0");
    isDisabled = await page.$eval(
      ".create-market-form-styles_CreateMarketForm__next",
      el => el.disabled
    );
    expect(isDisabled).toEqual(false);

    // Verify that orders must be priced between min and max value for the market
    await expect(page).toFill(
      ".create-market-form-liquidity-styles_CreateMarketLiquidity__order-form-body li:nth-child(1) input",
      "1"
    );
    await expect(page).toFill(
      ".create-market-form-liquidity-styles_CreateMarketLiquidity__order-form-body li:nth-child(2) input",
      "-0.1"
    );
    isDisabled = await page.$eval(
      ".create-market-form-liquidity-styles_CreateMarketLiquidity__order-add button",
      el => el.disabled
    );
    expect(isDisabled).toEqual(true);
    await expect(page).toFill(
      ".create-market-form-liquidity-styles_CreateMarketLiquidity__order-form-body li:nth-child(2) input",
      "1"
    );
    isDisabled = await page.$eval(
      ".create-market-form-liquidity-styles_CreateMarketLiquidity__order-add button",
      el => el.disabled
    );
    expect(isDisabled).toEqual(true);
    await expect(page).toClick(
      ".create-market-form-liquidity-styles_CreateMarketLiquidity__order-form-body li:nth-child(1) input"
    );
    await page.keyboard.press("Backspace");
    await expect(page).toClick(
      ".create-market-form-liquidity-styles_CreateMarketLiquidity__order-form-body li:nth-child(2) input"
    );
    await page.keyboard.press("Backspace");

    // Add liquidity orders
    await expect(page).toFill("#cm__input--settlement", "1");

    const orders = [
      {
        type: OrderType.Ask,
        outcome: "Yes",
        quantity: "2.0000",
        price: "0.5000"
      },
      {
        type: OrderType.Ask,
        outcome: "Yes",
        quantity: "2.0000",
        price: "0.4700"
      },
      {
        type: OrderType.Ask,
        outcome: "Yes",
        quantity: "1.0000",
        price: "0.4300"
      },
      {
        type: OrderType.Bid,
        outcome: "Yes",
        quantity: "2.0000",
        price: "0.4000"
      },
      {
        type: OrderType.Bid,
        outcome: "Yes",
        quantity: "1.0000",
        price: "0.3700"
      },
      {
        type: OrderType.Bid,
        outcome: "Yes",
        quantity: "3.0000",
        price: "0.3400"
      }
    ];
    await createLiquidity(orders);

    // Go to the Review page
    await expect(page).toClick("button", { text: "Next: Review" });

    // Submit new market
    isDisabled = await page.$eval(
      ".create-market-form-styles_CreateMarketForm__submit",
      el => el.disabled
    );
    while (isDisabled) {
      isDisabled = await page.$eval(
        ".create-market-form-styles_CreateMarketForm__submit",
        el => el.disabled
      );
    }

    // Verify that the broken-down stats are accurate
    await expect(page).toMatchElement(
      ".create-market-form-review-styles_CreateMarketReview__wrapper div:nth-child(1) ul li:nth-child(1) span:nth-child(2)",
      { text: "0.0100 ETH", timeout: timeoutMilliseconds }
    );
    await expect(page).toMatchElement(
      ".create-market-form-review-styles_CreateMarketReview__wrapper div:nth-child(1) ul li:nth-child(2) span:nth-child(2)",
      { text: "0.3497 REP", timeout: timeoutMilliseconds }
    );
    await expect(page).toMatchElement(
      ".create-market-form-review-styles_CreateMarketReview__wrapper div:nth-child(1) ul li:nth-child(3) span:nth-child(2)",
      { text: "0.0518 ETH", timeout: timeoutMilliseconds }
    );

    // Verify that the ETH and gas required to place liquidity orders is included in the totals
    await expect(page).toMatchElement(
      ".create-market-form-review-styles_CreateMarketReview__wrapper div:nth-child(2) ul li:nth-child(1) span:nth-child(2)",
      { text: "4.8200 ETH", timeout: timeoutMilliseconds }
    );
    await expect(page).toMatchElement(
      ".create-market-form-review-styles_CreateMarketReview__wrapper div:nth-child(2) ul li:nth-child(2) span:nth-child(2)",
      { text: "0.0840 ETH", timeout: timeoutMilliseconds }
    );

    await expect(page).toClick("button", { text: "Submit" });
    await waitNextBlock(10);

    // Make sure user is redirected to Portfolio: Transactions page
    await page.waitForSelector(".transactions-styles_Transaction__item", {
      visible: true
    });

    // Go to market category page
    await page.goto(
      url.concat("#/markets?category=INTEGRATION%20TEST&tags=YES%2FNO"),
      { waitUntil: "networkidle0" }
    );
    await page.waitForSelector(
      ".market-common-styles_MarketCommon__topcontent h1 span a",
      { visible: true }
    );

    // Verify that the market End Date/Time are displayed on the market card
    let marketCardEndDateString = await page.$eval(
      ".value_expires",
      el => el.textContent
    );
    let marketCardEndDate = new Date(marketCardEndDateString);
    expect(marketCardEndDate.toString()).toEqual(endDate.toString());

    // Go to new market trading page
    await expect(page).toClick(
      ".market-common-styles_MarketCommon__topcontent h1 span a",
      { timeout: timeoutMilliseconds }
    );

    // Verify that Additional Information is displayed
    await expect(page).toMatchElement(
      ".market-header-styles_MarketHeader__AdditionalDetails-text",
      {
        text: "Here is some additional information.",
        timeout: timeoutMilliseconds
      }
    );

    // Verify that Resolution Source is displayed
    await expect(page).toMatchElement(
      ".market-header-styles_MarketHeader__details span",
      { text: "https://www.reuters.com", timeout: timeoutMilliseconds }
    );

    // Verify that the Market End Date/Time are displayed
    let marketPageEndDateString = await page.$eval(
      ".core-properties-styles_CoreProperties__coreContainer .core-properties-styles_CoreProperties__column:nth-child(4) span:nth-child(2)",
      el => el.textContent
    );
    let marketPageEndDate = new Date(marketPageEndDateString);
    expect(marketPageEndDate.toString()).toEqual(endDate.toString());

    // Verify settlement fee is correct
    await expect(page).toMatchElement(
      ".market-header-styles_MarketHeader__properties .core-properties-styles_CoreProperties__property:nth-child(2) span:nth-child(2)",
      { text: "2.0000%", timeout: timeoutMilliseconds }
    );

    // Verify liquidity got created
    await verifyLiquidity(orders);
  });

  it("should allow only market creator to submit designated report when market creator is the designated reporter", async () => {
    // Go to create-market page and wait for it to load
    await page.goto(url.concat("#/create-market"), {
      waitUntil: "networkidle0"
    });
    await page.waitForSelector("#cm__input--desc", { visible: true });

    // Fill out Define page
    await expect(page).toFill("#cm__input--desc", "Designated Report Test 1");
    await expect(page).toFill("#cm__input--cat", "Designated Report Test");
    await expect(page).toFill("#cm__input--tag1", "Self");
    await expect(page).toClick("button", { text: "Next: Outcome" });

    // Fill out Outcome page
    await expect(page).toClick("li button", { text: "Yes/No" });
    await expect(page).toClick("button", { text: "Next: Resolution" });

    // Fill out Resolution page
    await expect(page).toClick("button", { text: "General knowledge" });
    await expect(page).toClick("button", { text: "Myself" });
    await expect(page).toSelect(
      "#cm__input--time div:nth-child(1) select",
      "11"
    );
    await expect(page).toSelect(
      "#cm__input--time div:nth-child(2) select",
      "59"
    );
    await expect(page).toSelect(
      "#cm__input--time div:nth-child(3) select",
      "PM"
    );

    // Verify that End Date field is required
    isDisabled = await page.$eval(
      ".create-market-form-styles_CreateMarketForm__next",
      el => el.disabled
    );
    expect(isDisabled).toEqual(true);

    await expect(page).toClick("#cm__input--date");
    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("ArrowRight");
    await page.keyboard.press("Enter");

    await expect(page).toClick("button", { text: "Next: Liquidity" });

    // Go to the Review page
    await expect(page).toFill("#cm__input--settlement", "1");
    await expect(page).toClick("button", { text: "Next: Review" });

    // Submit new market
    let isDisabled = await page.$eval(
      ".create-market-form-styles_CreateMarketForm__submit",
      el => el.disabled
    );
    while (isDisabled) {
      isDisabled = await page.$eval(
        ".create-market-form-styles_CreateMarketForm__submit",
        el => el.disabled
      );
    }
    await expect(page).toClick("button", { text: "Submit" });
    await waitNextBlock(10);

    await flash.pushDays(2);

    // Verify that market creator can view market on Reporting:Reports page
    await page.goto(url.concat("#/reporting-report-markets"), {
      waitUntil: "networkidle0"
    });
    await expect(page).toMatchElement("a", {
      text: "Designated Report Test 1",
      timeout: timeoutMilliseconds
    });

    // Switch to a different account
    await page.evaluate(
      account => window.integrationHelpers.updateAccountAddress(account),
      UnlockedAccounts.SECONDARY_ACCOUNT
    );

    // Verify that another user cannot view market on Reporting:Reports page
    await page.goto(url.concat("#/reporting-report-markets"), {
      waitUntil: "networkidle0"
    });
    await expect(page).not.toMatchElement("a", {
      text: "Designated Report Test 1",
      timeout: timeoutMilliseconds
    });

    // Switch back to market creator account
    await page.evaluate(
      account => window.integrationHelpers.updateAccountAddress(account),
      UnlockedAccounts.CONTRACT_OWNER
    );
  });

  it("should allow designated reporter to submit designated report, but not market creator", async () => {
    // Go to create-market page and wait for it to load
    await page.goto(url.concat("#/create-market"), {
      waitUntil: "networkidle0"
    });
    await page.waitForSelector("#cm__input--desc", { visible: true });

    // Fill out Define page
    await expect(page).toFill("#cm__input--desc", "Designated Report Test 2");
    await expect(page).toFill("#cm__input--cat", "Designated Report Test");
    await expect(page).toFill("#cm__input--tag1", "Else");
    await expect(page).toClick("button", { text: "Next: Outcome" });

    // Fill out Outcome page
    await expect(page).toClick("li button", { text: "Yes/No" });
    await expect(page).toClick("button", { text: "Next: Resolution" });

    // Fill out Resolution page
    await expect(page).toClick("button", { text: "General knowledge" });
    await expect(page).toClick("button", { text: "Someone Else" });
    await expect(page).toFill(
      ".create-market-form-styles_CreateMarketForm__fields li:nth-child(2) ul li div input",
      UnlockedAccounts.SECONDARY_ACCOUNT
    );
    await expect(page).toClick("#cm__input--date");
    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("ArrowRight");
    await page.keyboard.press("Enter");
    await expect(page).toSelect(
      "#cm__input--time div:nth-child(2) select",
      "59"
    );
    await expect(page).toSelect(
      "#cm__input--time div:nth-child(3) select",
      "PM"
    );

    // Verify that End Time Hour field is required
    isDisabled = await page.$eval(
      ".create-market-form-styles_CreateMarketForm__next",
      el => el.disabled
    );
    expect(isDisabled).toEqual(true);

    await expect(page).toSelect(
      "#cm__input--time div:nth-child(1) select",
      "11"
    );
    await expect(page).toClick("button", { text: "Next: Liquidity" });

    // Go to the Review page
    await expect(page).toFill("#cm__input--settlement", "1");
    await expect(page).toClick("button", { text: "Next: Review" });

    // Submit new market
    let isDisabled = await page.$eval(
      ".create-market-form-styles_CreateMarketForm__submit",
      el => el.disabled
    );
    while (isDisabled) {
      isDisabled = await page.$eval(
        ".create-market-form-styles_CreateMarketForm__submit",
        el => el.disabled
      );
    }
    await expect(page).toClick("button", { text: "Submit" });
    await waitNextBlock(10);

    await flash.pushDays(2);

    // Verify that market creator cannot view market on Reporting:Reports page
    await page.goto(url.concat("#/reporting-report-markets"), {
      waitUntil: "networkidle0"
    });
    await expect(page).not.toMatchElement("a", {
      text: "Designated Report Test 2",
      timeout: timeoutMilliseconds
    });

    // Switch to a different account
    await page.evaluate(
      account => window.integrationHelpers.updateAccountAddress(account),
      UnlockedAccounts.SECONDARY_ACCOUNT
    );

    // Verify that the designated reporter can view market on Reporting:Reports page
    await page.goto(url.concat("#/reporting-report-markets"), {
      waitUntil: "networkidle0"
    });
    await expect(page).toMatchElement("a", {
      text: "Designated Report Test 2",
      timeout: timeoutMilliseconds
    });

    // Switch back to market creator account
    await page.evaluate(
      account => window.integrationHelpers.updateAccountAddress(account),
      UnlockedAccounts.CONTRACT_OWNER
    );
  });

  it("should allow user to create a new categorical market", async () => {
    // Go to create-market page & wait for it to load
    await page.goto(url.concat("#/create-market"), {
      waitUntil: "networkidle0"
    });
    await page.waitForSelector("#cm__input--desc", { visible: true });

    // Fill out Define page
    await expect(page).toFill(
      "#cm__input--desc",
      "Will this categorical market be created successfully?",
      { timeout: timeoutMilliseconds }
    );
    await expect(page).toFill("#cm__input--cat", "Integration Test");
    await expect(page).toFill("#cm__input--tag1", "Categorical");
    await expect(page).toFill("#cm__input--tag2", "Test");
    await expect(page).toClick("button", { text: "Next: Outcome" });

    // Fill out Outcome page
    await expect(page).toClick("button", { text: "Multiple Choice" });

    // Verify there are 8 inputs under the "Potential Outcomes" label and the first 2 are required
    await page.waitForSelector("[data-testid='categoricalOutcome-0']", {
      visible: true
    });
    await page.waitForSelector("[data-testid='categoricalOutcome-1']", {
      visible: true
    });
    await page.waitForSelector("[data-testid='categoricalOutcome-2']", {
      visible: true
    });
    await page.waitForSelector("[data-testid='categoricalOutcome-3']", {
      visible: true
    });
    await page.waitForSelector("[data-testid='categoricalOutcome-4']", {
      visible: true
    });
    await page.waitForSelector("[data-testid='categoricalOutcome-5']", {
      visible: true
    });
    await page.waitForSelector("[data-testid='categoricalOutcome-6']", {
      visible: true
    });
    await page.waitForSelector("[data-testid='categoricalOutcome-7']", {
      visible: true
    });

    // Verify that Outcome names must be unique
    await expect(page).toFill(
      "[data-testid='categoricalOutcome-0']",
      "Outcome 1"
    );
    await expect(page).toFill(
      "[data-testid='categoricalOutcome-1']",
      "Outcome 1"
    );

    let isDisabled = await page.$eval(
      ".create-market-form-styles_CreateMarketForm__next",
      el => el.disabled
    );
    expect(isDisabled).toEqual(true);

    await expect(page).toFill(
      "[data-testid='categoricalOutcome-1']",
      "Outcome 2"
    );
    await expect(page).toFill(
      "[data-testid='categoricalOutcome-2']",
      "Outcome 3"
    );
    await expect(page).toFill(
      "[data-testid='categoricalOutcome-3']",
      "Outcome 4"
    );
    await expect(page).toFill(
      "[data-testid='categoricalOutcome-4']",
      "Outcome 5"
    );
    await expect(page).toFill(
      "[data-testid='categoricalOutcome-5']",
      "Outcome 6"
    );
    await expect(page).toFill(
      "[data-testid='categoricalOutcome-6']",
      "Outcome 7"
    );
    await expect(page).toFill(
      "[data-testid='categoricalOutcome-7']",
      "Outcome 8"
    );

    // Verify that the Additional Details field is optional
    isDisabled = await page.$eval(
      ".create-market-form-styles_CreateMarketForm__next",
      el => el.disabled
    );
    expect(isDisabled).toEqual(false);

    await expect(page).toFill(
      "#cm__input--details",
      "Here is some additional information."
    );
    await expect(page).toClick("button", { text: "Next: Resolution" });

    // Fill out Resolution page
    await expect(page).toClick("button", {
      text: "Outcome will be detailed on a public website"
    });
    await expect(page).toFill(
      ".create-market-form-styles_CreateMarketForm__fields li:nth-child(1) ul li div input",
      "https://www.reuters.com"
    );
    await expect(page).toClick("button", { text: "Someone Else" });
    await expect(page).toFill(
      ".create-market-form-styles_CreateMarketForm__fields li:nth-child(2) ul li div input",
      "0xbd355A7e5a7ADb23b51F54027E624BfE0e238DF6"
    );
    await expect(page).toClick("#cm__input--date");
    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("ArrowRight");
    await page.keyboard.press("Enter");
    await expect(page).toSelect(
      "#cm__input--time div:nth-child(1) select",
      "11"
    );
    await expect(page).toSelect(
      "#cm__input--time div:nth-child(3) select",
      "PM"
    );

    // Verify that End Time Minute field is required
    isDisabled = await page.$eval(
      ".create-market-form-styles_CreateMarketForm__next",
      el => el.disabled
    );
    expect(isDisabled).toEqual(true);

    await expect(page).toSelect(
      "#cm__input--time div:nth-child(2) select",
      "59"
    );
    await expect(page).toClick("button", { text: "Next: Liquidity" });

    // Fill out Liquidity page
    await expect(page).toFill("#cm__input--settlement", "1");

    const orders = [
      {
        type: OrderType.Ask,
        outcome: "Outcome 1",
        quantity: "2.0000",
        price: "0.5000"
      },
      {
        type: OrderType.Ask,
        outcome: "Outcome 1",
        quantity: "2.0000",
        price: "0.4700"
      },
      {
        type: OrderType.Ask,
        outcome: "Outcome 1",
        quantity: "1.0000",
        price: "0.4300"
      },
      {
        type: OrderType.Bid,
        outcome: "Outcome 1",
        quantity: "2.0000",
        price: "0.4000"
      },
      {
        type: OrderType.Bid,
        outcome: "Outcome 1",
        quantity: "1.0000",
        price: "0.3700"
      },
      {
        type: OrderType.Bid,
        outcome: "Outcome 1",
        quantity: "3.0000",
        price: "0.3400"
      },
      {
        type: OrderType.Bid,
        outcome: "Outcome 2",
        quantity: "2.0000",
        price: "0.5000"
      },
      {
        type: OrderType.Ask,
        outcome: "Outcome 3",
        quantity: "2.0000",
        price: "0.4100"
      }
    ];
    await createLiquidity(orders);

    // Go to the Review page
    await expect(page).toClick("button", { text: "Next: Review" });

    // Submit new market
    isDisabled = await page.$eval(
      ".create-market-form-styles_CreateMarketForm__submit",
      el => el.disabled
    );
    while (isDisabled) {
      isDisabled = await page.$eval(
        ".create-market-form-styles_CreateMarketForm__submit",
        el => el.disabled
      );
    }
    await expect(page).toClick("button", { text: "Submit" });
    await waitNextBlock(10);

    // Make sure user is redirected to Transactions page
    await page.waitForSelector(".transactions-styles_Transaction__item", {
      visible: true
    });

    // Go to new market trading page
    await page.goto(
      url.concat("#/markets?category=INTEGRATION%20TEST&tags=CATEGORICAL"),
      { waitUntil: "networkidle0" }
    );
    await page.waitForSelector(
      ".market-common-styles_MarketCommon__topcontent h1 span a",
      { visible: true }
    );
    await expect(page).toClick(
      ".market-common-styles_MarketCommon__topcontent h1 span a",
      { timeout: timeoutMilliseconds }
    );

    // Verify settlement fee is correct
    await expect(page).toMatchElement(
      ".market-header-styles_MarketHeader__properties .core-properties-styles_CoreProperties__property:nth-child(2) span:nth-child(2)",
      { text: "2.0000%", timeout: timeoutMilliseconds }
    );

    // Confirm that when the market is created, all outcomes are properly listed as the market's outcomes
    await expect(page).toMatchElement(
      ".market-outcomes-list-styles_MarketOutcomesList__table-body .market-outcomes-list--outcome-styles_Outcome:nth-child(1) li:nth-child(1)",
      { text: "Outcome 1", timeout: timeoutMilliseconds }
    );
    await expect(page).toMatchElement(
      ".market-outcomes-list-styles_MarketOutcomesList__table-body .market-outcomes-list--outcome-styles_Outcome:nth-child(2) li:nth-child(1)",
      { text: "Outcome 2", timeout: timeoutMilliseconds }
    );
    await expect(page).toMatchElement(
      ".market-outcomes-list-styles_MarketOutcomesList__table-body .market-outcomes-list--outcome-styles_Outcome:nth-child(3) li:nth-child(1)",
      { text: "Outcome 3", timeout: timeoutMilliseconds }
    );
    await expect(page).toMatchElement(
      ".market-outcomes-list-styles_MarketOutcomesList__table-body .market-outcomes-list--outcome-styles_Outcome:nth-child(4) li:nth-child(1)",
      { text: "Outcome 4", timeout: timeoutMilliseconds }
    );
    await expect(page).toMatchElement(
      ".market-outcomes-list-styles_MarketOutcomesList__table-body .market-outcomes-list--outcome-styles_Outcome:nth-child(5) li:nth-child(1)",
      { text: "Outcome 5", timeout: timeoutMilliseconds }
    );
    await expect(page).toMatchElement(
      ".market-outcomes-list-styles_MarketOutcomesList__table-body .market-outcomes-list--outcome-styles_Outcome:nth-child(6) li:nth-child(1)",
      { text: "Outcome 6", timeout: timeoutMilliseconds }
    );
    await expect(page).toMatchElement(
      ".market-outcomes-list-styles_MarketOutcomesList__table-body .market-outcomes-list--outcome-styles_Outcome:nth-child(7) li:nth-child(1)",
      { text: "Outcome 7", timeout: timeoutMilliseconds }
    );
    await expect(page).toMatchElement(
      ".market-outcomes-list-styles_MarketOutcomesList__table-body .market-outcomes-list--outcome-styles_Outcome:nth-child(8) li:nth-child(1)",
      { text: "Outcome 8", timeout: timeoutMilliseconds }
    );

    // Verify liquidity got created
    await verifyLiquidity(orders);
  });

  it("should allow user to create a new scalar market", async () => {
    // Go to create-market page & wait for it to load
    await page.goto(url.concat("#/create-market"), {
      waitUntil: "networkidle0"
    });
    await page.waitForSelector("#cm__input--desc", { visible: true });

    // Fill out Define page
    await expect(page).toFill(
      "#cm__input--desc",
      "Will this scalar market be created successfully?",
      { timeout: timeoutMilliseconds }
    );
    await expect(page).toFill("#cm__input--cat", "Integration Test");
    await expect(page).toFill("#cm__input--tag1", "Scalar");
    await expect(page).toFill("#cm__input--tag2", "Test");
    await expect(page).toClick("button", { text: "Next: Outcome" });

    // Fill out Outcome page
    await expect(page).toClick("button", { text: "Numerical Range" });

    // Verify that there are 3 input boxes under the "Range Values" header, and an additional input under the "Precision" label
    await page.waitForSelector("#cm__input--min", { visible: true });
    await page.waitForSelector("#cm__input--max", { visible: true });
    await page.waitForSelector("#cm__input--denomination", { visible: true });
    await page.waitForSelector("#cm__input--ticksize", { visible: true });

    // Verify that the Precision field is defaulted to 0.0001
    let defaultPrecisionValue = await page.$eval(
      "#cm__input--ticksize",
      el => el.value
    );
    await expect(defaultPrecisionValue).toMatch("0.0001");

    // Verify that Min Value is required and must be less than Max Value
    await expect(page).toFill("#cm__input--max", "0");
    let isDisabled = await page.$eval(
      ".create-market-form-styles_CreateMarketForm__next",
      el => el.disabled
    );
    await expect(isDisabled).toEqual(true);
    await expect(page).toFill("#cm__input--min", "30");
    isDisabled = await page.$eval(
      ".create-market-form-styles_CreateMarketForm__next",
      el => el.disabled
    );
    await expect(isDisabled).toEqual(true);
    await page.$eval("#cm__input--min", input => (input.value = ""));
    await expect(page).toFill("#cm__input--min", "30");
    isDisabled = await page.$eval(
      ".create-market-form-styles_CreateMarketForm__next",
      el => el.disabled
    );
    await expect(isDisabled).toEqual(true);

    // Verify that Max Value is required
    await page.$eval("#cm__input--min", input => (input.value = ""));
    await page.$eval("#cm__input--max", input => (input.value = ""));
    await expect(page).toFill("#cm__input--min", "0");
    isDisabled = await page.$eval(
      ".create-market-form-styles_CreateMarketForm__next",
      el => el.disabled
    );
    await expect(isDisabled).toEqual(true);
    await expect(page).toFill("#cm__input--max", "30");
    await expect(page).toFill("#cm__input--denomination", "dollars");
    isDisabled = await page.$eval(
      ".create-market-form-styles_CreateMarketForm__next",
      el => el.disabled
    );
    await expect(isDisabled).toEqual(false);

    // Verify that Denomination is required
    await page.keyboard.press("Backspace");
    await page.keyboard.press("Backspace");
    await page.keyboard.press("Backspace");
    await page.keyboard.press("Backspace");
    await page.keyboard.press("Backspace");
    await page.keyboard.press("Backspace");
    await page.keyboard.press("Backspace");
    isDisabled = await page.$eval(
      ".create-market-form-styles_CreateMarketForm__next",
      el => el.disabled
    );
    await expect(isDisabled).toEqual(true);
    await expect(page).toFill("#cm__input--denomination", "dollars");

    // Verify that Precision is required
    await page.click("#cm__input--ticksize");
    await page.keyboard.press("Backspace");
    await page.keyboard.press("Backspace");
    await page.keyboard.press("Backspace");
    await page.keyboard.press("Backspace");
    await page.keyboard.press("Backspace");
    await page.keyboard.press("Backspace");
    isDisabled = await page.$eval(
      ".create-market-form-styles_CreateMarketForm__next",
      el => el.disabled
    );
    await expect(isDisabled).toEqual(true);
    await expect(page).toFill("#cm__input--ticksize", "0.0001");

    // Verify that the Denomination field and Additional Details field are optional
    isDisabled = await page.$eval(
      ".create-market-form-styles_CreateMarketForm__next",
      el => el.disabled
    );
    await expect(isDisabled).toEqual(false);

    await expect(page).toFill("#cm__input--denomination", "dollars");
    await expect(page).toFill(
      "#cm__input--details",
      "Here is some additional information."
    );
    await expect(page).toClick("button", { text: "Next: Resolution" });

    // Fill out Resolution page
    await expect(page).toClick("button", {
      text: "Outcome will be detailed on a public website"
    });
    await expect(page).toFill(
      ".create-market-form-styles_CreateMarketForm__fields li:nth-child(1) ul li div input",
      "https://www.reuters.com"
    );
    await expect(page).toClick("button", { text: "Someone Else" });
    await expect(page).toFill(
      ".create-market-form-styles_CreateMarketForm__fields li:nth-child(2) ul li div input",
      "0xbd355A7e5a7ADb23b51F54027E624BfE0e238DF6"
    );
    await expect(page).toClick("#cm__input--date");
    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("ArrowRight");
    await page.keyboard.press("Enter");
    await expect(page).toSelect(
      "#cm__input--time div:nth-child(1) select",
      "11"
    );
    await expect(page).toSelect(
      "#cm__input--time div:nth-child(2) select",
      "59"
    );

    // Verify that End Time PM field is required
    isDisabled = await page.$eval(
      ".create-market-form-styles_CreateMarketForm__next",
      el => el.disabled
    );
    expect(isDisabled).toEqual(true);

    await expect(page).toSelect(
      "#cm__input--time div:nth-child(3) select",
      "PM"
    );
    await expect(page).toClick("button", { text: "Next: Liquidity" });

    // Fill out Liquidity page
    await expect(page).toFill("#cm__input--settlement", "1");

    const orders = [
      {
        type: OrderType.Ask,
        outcome: "20.0000",
        quantity: "2.0000",
        price: "20.0000"
      },
      {
        type: OrderType.Ask,
        outcome: "17.5000",
        quantity: "1.0000",
        price: "17.5000"
      },
      {
        type: OrderType.Ask,
        outcome: "15.0000",
        quantity: "2.0000",
        price: "15.0000"
      },
      {
        type: OrderType.Bid,
        outcome: "3.0000",
        quantity: "7.0000",
        price: "3.0000"
      },
      {
        type: OrderType.Bid,
        outcome: "2.0000",
        quantity: "10.0000",
        price: "2.0000"
      },
      {
        type: OrderType.Bid,
        outcome: "1.0000",
        quantity: "12.0000",
        price: "1.0000"
      }
    ];
    await createLiquidity(orders);

    // Go to the Review page
    await expect(page).toClick("button", { text: "Next: Review" });

    // Submit new market
    isDisabled = await page.$eval(
      ".create-market-form-styles_CreateMarketForm__submit",
      el => el.disabled
    );
    while (isDisabled) {
      isDisabled = await page.$eval(
        ".create-market-form-styles_CreateMarketForm__submit",
        el => el.disabled
      );
    }
    await expect(page).toClick("button", { text: "Submit" });
    await waitNextBlock(10);

    // Make sure user is redirected to Transactions page
    await page.waitForSelector(".transactions-styles_Transaction__item", {
      visible: true
    });

    // Go to new market's category/tags page
    await page.goto(
      url.concat("#/markets?category=INTEGRATION%20TEST&tags=SCALAR"),
      { waitUntil: "networkidle0" }
    );
    await page.waitForSelector(
      ".market-common-styles_MarketCommon__topcontent h1 span a",
      { visible: true }
    );

    // Verify that the min, max, & denomination are properly displayed on the Markets List market card
    await expect(page).toMatchElement(
      ".market-outcomes-yes-no-scalar-styles_MarketOutcomes__min",
      { text: "0 dollars" }
    );
    await expect(page).toMatchElement(
      ".market-outcomes-yes-no-scalar-styles_MarketOutcomes__max",
      { text: "30 dollars" }
    );

    // Go to new market trading page
    await expect(page).toClick(
      ".market-common-styles_MarketCommon__topcontent h1 span a",
      { timeout: timeoutMilliseconds }
    );

    // Verify settlement fee is correct
    await expect(page).toMatchElement(
      ".market-header-styles_MarketHeader__properties .core-properties-styles_CoreProperties__property:nth-child(2) span:nth-child(2)",
      { text: "2.0000%", timeout: timeoutMilliseconds }
    );

    // Verify that the precision is the same as the entered precision value
    const step = await page.$eval("#tr__input--quantity", el => el.step);
    await expect(step).toEqual("0.0001");
    const placeholder = await page.$eval(
      "#tr__input--quantity",
      el => el.placeholder
    );
    await expect(placeholder).toEqual("0.0001 Shares");

    // Verify liquidity got created
    await verifyLiquidity(orders);
  });
});
