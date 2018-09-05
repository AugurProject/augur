"use strict";

import "jest-environment-puppeteer";
import { UnlockedAccounts } from "./constants/accounts";
import { waitNextBlock } from "./helpers/wait-new-block";
require("./helpers/beforeAll");

const timeoutMilliseconds = 15000; // TODO: Figure out a way to reduce timeout required for certain DOM elements

jest.setTimeout(100000);

describe("Trading page", () => {
  it("should update the Unrealized P/L for a categorical market when another account buys shares at a different price", async () => {
    // Go to Market trading page
    await expect(page).toClick("#side-nav-items");
    await expect(page).toFill(".filter-search-styles_FilterSearch__input", "city", { timeout: timeoutMilliseconds });
    await expect(page).toClick("a", { text: "Which city will have the highest median single-family home price in 2018?", timeout: timeoutMilliseconds });

    // Switch to secondary account
    await page.evaluate(
      account => window.integrationHelpers.updateAccountAddress(account),
      UnlockedAccounts.SECONDARY_ACCOUNT
    );

    await expect(page).toClick("li", { text: "London", timeout: timeoutMilliseconds });
    await expect(page).toClick("button", { text: "Buy", timeout: timeoutMilliseconds });
    await expect(page).toFill("input#tr__input--quantity", "0.0010", { timeout: timeoutMilliseconds });
    await expect(page).toFill("input#tr__input--limit-price", "0.3100", { timeout: timeoutMilliseconds });
    let isDisabled = await page.$eval(
      ".trading--form-styles_TradingForm__form-body li button",
      el => el.disabled
    );
    while (isDisabled) {
      isDisabled = await page.$eval(
        ".trading--form-styles_TradingForm__form-body li button",
        el => el.disabled
      );
    }
    await expect(page).toClick("button", { text: "Review", timeout: timeoutMilliseconds });
    await expect(page).toClick("button", { text: "Confirm", timeout: timeoutMilliseconds });

    await expect(page).toClick("button", { text: "Approve" , timeout: timeoutMilliseconds });

    await waitNextBlock(2);

    // Perform buy twice since first publicTrade call fails
    // TODO: Figure out why first publicTrade call fails after Approve in integration test. (This does not happen when using the UI manually.)
    await expect(page).toClick("button", { text: "Buy", timeout: timeoutMilliseconds });
    await expect(page).toFill("input#tr__input--quantity", "0.0010", { timeout: timeoutMilliseconds });
    await expect(page).toFill("input#tr__input--limit-price", "0.3100", { timeout: timeoutMilliseconds });
    isDisabled = await page.$eval(
      ".trading--form-styles_TradingForm__form-body li button",
      el => el.disabled
    );
    while (isDisabled) {
      isDisabled = await page.$eval(
        ".trading--form-styles_TradingForm__form-body li button",
        el => el.disabled
      );
    }
    await expect(page).toClick("button", { text: "Review", timeout: timeoutMilliseconds });
    await expect(page).toClick("button", { text: "Confirm", timeout: timeoutMilliseconds });

    await waitNextBlock(10);

    // Ensure that Unrealized P/L and Realized P/L are 0
    await expect(page).toMatchElement(
      ".market-positions-list--position-styles_Position:nth-child(1) li:nth-child(5)",
      { text: "0", timeout: timeoutMilliseconds }
    );
    await expect(page).toMatchElement(
      ".market-positions-list--position-styles_Position:nth-child(1) li:nth-child(6)",
      { text: "0", timeout: timeoutMilliseconds }
    );

    // Switch to contract owner account
    await page.evaluate(
      account => window.integrationHelpers.updateAccountAddress(account),
      UnlockedAccounts.CONTRACT_OWNER
    );

    // Ensure that Unrealized P/L and Realized P/L are 0
    await expect(page).toMatchElement(
      ".market-positions-list--position-styles_Position:nth-child(1) li:nth-child(5)",
      { text: "0", timeout: timeoutMilliseconds }
    );
    await expect(page).toMatchElement(
      ".market-positions-list--position-styles_Position:nth-child(1) li:nth-child(6)",
      { text: "0", timeout: timeoutMilliseconds }
    );

    // Switch to secondary account
    await page.evaluate(
      account => window.integrationHelpers.updateAccountAddress(account),
      UnlockedAccounts.SECONDARY_ACCOUNT
    );

    await expect(page).toClick("button", { text: "Buy", timeout: timeoutMilliseconds });
    await expect(page).toFill("input#tr__input--quantity", "0.0020", { timeout: timeoutMilliseconds });
    await expect(page).toFill("input#tr__input--limit-price", "0.3500", { timeout: timeoutMilliseconds });
    isDisabled = await page.$eval(
      ".trading--form-styles_TradingForm__form-body li button",
      el => el.disabled
    );
    while (isDisabled) {
      isDisabled = await page.$eval(
        ".trading--form-styles_TradingForm__form-body li button",
        el => el.disabled
      );
    }
    await expect(page).toClick("button", { text: "Review", timeout: timeoutMilliseconds });
    await expect(page).toClick("button", { text: "Confirm", timeout: timeoutMilliseconds });

    await waitNextBlock(10);

    // Ensure Unrealized and Realized P/L are correct
    await expect(page).toMatchElement(
      ".market-positions-list--position-styles_Position:nth-child(1) li:nth-child(5)",
      { text: "0.000040", timeout: timeoutMilliseconds }
    );
    await expect(page).toMatchElement(
      ".market-positions-list--position-styles_Position:nth-child(1) li:nth-child(6)",
      { text: "0", timeout: timeoutMilliseconds }
    );

    // Switch to contract owner account
    await page.evaluate(
      account => window.integrationHelpers.updateAccountAddress(account),
      UnlockedAccounts.CONTRACT_OWNER
    );

    // Ensure Unrealized and Realized P/L are correct
    await expect(page).toMatchElement(
      ".market-positions-list--position-styles_Position:nth-child(1) li:nth-child(5)",
      { text: "-0.000040", timeout: timeoutMilliseconds }
    );
    await expect(page).toMatchElement(
      ".market-positions-list--position-styles_Position:nth-child(1) li:nth-child(6)",
      { text: "0", timeout: timeoutMilliseconds }
    );
  });

  it("should update the Unrealized & Realized P/L for a binary market when another account buys & sells shares at different prices", async () => {
    // Switch to secondary account
    await page.evaluate(
      account => window.integrationHelpers.updateAccountAddress(account),
      UnlockedAccounts.SECONDARY_ACCOUNT
    );

    // Go to Market trading page
    await expect(page).toClick("#side-nav-items");
    await expect(page).toClick("a", { text: "Will the Larsen B ice shelf collapse by the end of November 2019?", timeout: timeoutMilliseconds });

    await expect(page).toClick("button", { text: "Sell", timeout: timeoutMilliseconds });
    await expect(page).toFill("input#tr__input--quantity", "0.001", { timeout: timeoutMilliseconds });
    await expect(page).toFill("input#tr__input--limit-price", "0.28", { timeout: timeoutMilliseconds });
    let isDisabled = await page.$eval(
      ".trading--form-styles_TradingForm__form-body li button",
      el => el.disabled
    );
    while (isDisabled) {
      isDisabled = await page.$eval(
        ".trading--form-styles_TradingForm__form-body li button",
        el => el.disabled
      );
    }
    await expect(page).toClick("button", { text: "Review", timeout: timeoutMilliseconds });
    await expect(page).toClick("button", { text: "Confirm", timeout: timeoutMilliseconds });

    await waitNextBlock(10);

    // Ensure that Unrealized P/L and Realized P/L are 0
    await expect(page).toMatchElement(
      ".market-positions-list--position-styles_Position:nth-child(1) li:nth-child(5)",
      { text: "0", timeout: timeoutMilliseconds }
    );
    await expect(page).toMatchElement(
      ".market-positions-list--position-styles_Position:nth-child(1) li:nth-child(6)",
      { text: "0", timeout: timeoutMilliseconds }
    );

    // Switch to contract owner account
    await page.evaluate(
      account => window.integrationHelpers.updateAccountAddress(account),
      UnlockedAccounts.CONTRACT_OWNER
    );

    // Ensure that Unrealized P/L and Realized P/L are 0
    await expect(page).toMatchElement(
      ".market-positions-list--position-styles_Position:nth-child(1) li:nth-child(5)",
      { text: "0", timeout: timeoutMilliseconds }
    );
    await expect(page).toMatchElement(
      ".market-positions-list--position-styles_Position:nth-child(1) li:nth-child(6)",
      { text: "0", timeout: timeoutMilliseconds }
    );

    // Switch to secondary account
    await page.evaluate(
      account => window.integrationHelpers.updateAccountAddress(account),
      UnlockedAccounts.SECONDARY_ACCOUNT
    );

    await expect(page).toClick("button", { text: "Sell", timeout: timeoutMilliseconds });
    await expect(page).toFill("input#tr__input--quantity", "0.002", { timeout: timeoutMilliseconds });
    await expect(page).toFill("input#tr__input--limit-price", "0.25", { timeout: timeoutMilliseconds });
    isDisabled = await page.$eval(
      ".trading--form-styles_TradingForm__form-body li button",
      el => el.disabled
    );
    while (isDisabled) {
      isDisabled = await page.$eval(
        ".trading--form-styles_TradingForm__form-body li button",
        el => el.disabled
      );
    }
    await expect(page).toClick("button", { text: "Review", timeout: timeoutMilliseconds });
    await expect(page).toClick("button", { text: "Confirm", timeout: timeoutMilliseconds });

    await waitNextBlock(10);

    // Ensure that Unrealized and Realized P/L are correct
    await expect(page).toMatchElement(
      ".market-positions-list--position-styles_Position:nth-child(1) li:nth-child(5)",
      { text: "0.000030", timeout: timeoutMilliseconds }
    );
    await expect(page).toMatchElement(
      ".market-positions-list--position-styles_Position:nth-child(1) li:nth-child(6)",
      { text: "0", timeout: timeoutMilliseconds }
    );

    // Switch to contract owner account
    await page.evaluate(
      account => window.integrationHelpers.updateAccountAddress(account),
      UnlockedAccounts.CONTRACT_OWNER
    );

    // Ensure that Unrealized and Realized P/L are correct
    await expect(page).toMatchElement(
      ".market-positions-list--position-styles_Position:nth-child(1) li:nth-child(5)",
      { text: "0.000030", timeout: timeoutMilliseconds }
    );
    await expect(page).toMatchElement(
      ".market-positions-list--position-styles_Position:nth-child(1) li:nth-child(6)",
      { text: "0", timeout: timeoutMilliseconds }
    );

    // Switch to secondary account
    await page.evaluate(
      account => window.integrationHelpers.updateAccountAddress(account),
      UnlockedAccounts.SECONDARY_ACCOUNT
    );

    await expect(page).toClick("button", { text: "Buy", timeout: timeoutMilliseconds });
    await expect(page).toFill("input#tr__input--quantity", "0.001", { timeout: timeoutMilliseconds });
    await expect(page).toFill("input#tr__input--limit-price", "0.31", { timeout: timeoutMilliseconds });
    isDisabled = await page.$eval(
      ".trading--form-styles_TradingForm__form-body li button",
      el => el.disabled
    );
    while (isDisabled) {
      isDisabled = await page.$eval(
        ".trading--form-styles_TradingForm__form-body li button",
        el => el.disabled
      );
    }
    await expect(page).toClick("button", { text: "Review", timeout: timeoutMilliseconds });
    await expect(page).toClick("button", { text: "Confirm", timeout: timeoutMilliseconds });

    await waitNextBlock(10);

    // Ensure that Unrealized and Realized P/L are correct
    await expect(page).toMatchElement(
      ".market-positions-list--position-styles_Position:nth-child(1) li:nth-child(5)",
      { text: "-0.0001", timeout: timeoutMilliseconds }
    );
    await expect(page).toMatchElement(
      ".market-positions-list--position-styles_Position:nth-child(1) li:nth-child(6)",
      { text: "-0.000050", timeout: timeoutMilliseconds }
    );

    // Switch to contract owner account
    await page.evaluate(
      account => window.integrationHelpers.updateAccountAddress(account),
      UnlockedAccounts.CONTRACT_OWNER
    );

    // Ensure that Unrealized and Realized P/L are correct
    await expect(page).toMatchElement(
      ".market-positions-list--position-styles_Position:nth-child(1) li:nth-child(5)",
      { text: "0.0001", timeout: timeoutMilliseconds }
    );
    await expect(page).toMatchElement(
      ".market-positions-list--position-styles_Position:nth-child(1) li:nth-child(6)",
      { text: "0.000050", timeout: timeoutMilliseconds }
    );
  });
});
