"use strict";

import "jest-environment-puppeteer";
import { UnlockedAccounts } from "./constants/accounts";
import { toMarket } from "./helpers/navigation-helper";
import { waitNextBlock } from "./helpers/wait-new-block";
require("./helpers/beforeAll");

const timeoutMilliseconds = 15000; // TODO: Figure out a way to reduce timeout required for certain DOM elements

// let flash: IFlash = new Flash();

describe("Trading page", () => {
  it("should change unrealized P/L if a share is bought with a different account", async () => {
    // Switch to secondary account
    await page.evaluate(
      account => window.integrationHelpers.updateAccountAddress(account),
      UnlockedAccounts.SECONDARY_ACCOUNT
    );

    // Go to Market trading page
    await expect(page).toClick("#side-nav-items");
    await expect(page).toClick("a", { text: "Will the Larsen B ice shelf collapse by the end of November 2019?", timeout: timeoutMilliseconds });

    await expect(page).toClick("button", { text: "Sell" });
    await expect(page).toFill("input#tr__input--quantity", "0.001");
    await expect(page).toFill("input#tr__input--limit-price", "0.28");
    await expect(page).toClick("button", { text: "Review" });
    await expect(page).toClick("button", { text: "Confirm" });
    await expect(page).toClick("button", { text: "Approve" });

    // Perform sell twice since first publicTrade call fails
    // TODO: Figure out why first publicTrade call fails
    await expect(page).toClick("button", { text: "Sell" });
    await expect(page).toFill("input#tr__input--quantity", "0.001");
    await expect(page).toFill("input#tr__input--limit-price", "0.28");
    await expect(page).toClick("button", { text: "Review" });
    await expect(page).toClick("button", { text: "Confirm" });

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

    await expect(page).toClick("button", { text: "Sell" });
    await expect(page).toFill("input#tr__input--quantity", "0.002");
    await expect(page).toFill("input#tr__input--limit-price", "0.25");
    await expect(page).toClick("button", { text: "Review" });
    await expect(page).toClick("button", { text: "Confirm" });

    // Ensure that Unrealized P/L is 0.000030 and Realized P/L is 0
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

    // Ensure that Unrealized P/L is not 0 and Realized P/L is 0
    // TODO: Currently, Unrealized P/L displays as -0.0000. This check should be updated once this bug is fixed.
    await expect(page).toMatchElement(
      ".market-positions-list--position-styles_Position:nth-child(1) li:nth-child(5)",
      { text: "-0.0000", timeout: timeoutMilliseconds }
    );
    await expect(page).toMatchElement(
      ".market-positions-list--position-styles_Position:nth-child(1) li:nth-child(6)",
      { text: "0", timeout: timeoutMilliseconds }
    );
  });

  it("should change unrealized P/L if a share is bought/sold at different prices by the same account", async () => {
  });
});
