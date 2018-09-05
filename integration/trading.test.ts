"use strict";

import "jest-environment-puppeteer";
import { UnlockedAccounts } from "./constants/accounts";
import { waitNextBlock } from "./helpers/wait-new-block";
require("./helpers/beforeAll");

const timeoutMilliseconds = 15000; // TODO: Figure out a way to reduce timeout required for certain DOM elements

jest.setTimeout(100000);


function delay(time) {
  return new Promise(function(resolve) {
      setTimeout(resolve, time)
  });
}

describe("Trading page", () => {
  it("should change Unrealized & Realized P/L correctly when shares are bought/sold with different accounts", async () => {
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
    await delay(1000);
    await expect(page).toClick("button", { text: "Review", timeout: timeoutMilliseconds });
    await expect(page).toClick("button", { text: "Confirm", timeout: timeoutMilliseconds });

    await delay(500);

    await expect(page).toClick("button", { text: "Approve" , timeout: timeoutMilliseconds });

    await waitNextBlock(2);

    // Perform sell twice since first publicTrade call fails
    // TODO: Figure out why first publicTrade call fails
    await expect(page).toClick("button", { text: "Sell", timeout: timeoutMilliseconds });
    await expect(page).toFill("input#tr__input--quantity", "0.001", { timeout: timeoutMilliseconds });
    await expect(page).toFill("input#tr__input--limit-price", "0.28", { timeout: timeoutMilliseconds });
    await delay(1000);
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
    await delay(1000);
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
    // TODO: Currently, Unrealized P/L displays as -0.0000. This check should be updated once this bug is fixed.
    await expect(page).toMatchElement(
      ".market-positions-list--position-styles_Position:nth-child(1) li:nth-child(5)",
      { text: "-0.0000", timeout: timeoutMilliseconds }
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
    await delay(1000);
    await expect(page).toClick("button", { text: "Review", timeout: timeoutMilliseconds });
    await expect(page).toClick("button", { text: "Confirm", timeout: timeoutMilliseconds });

    await waitNextBlock(10);

    // Ensure that Unrealized and Realized P/L are correct
    // TODO: Currently, Realized P/L displays as -0.0000. This check should be updated once this bug is fixed.
    await expect(page).toMatchElement(
      ".market-positions-list--position-styles_Position:nth-child(1) li:nth-child(5)",
      { text: "-0.0001", timeout: timeoutMilliseconds }
    );
    await expect(page).toMatchElement(
      ".market-positions-list--position-styles_Position:nth-child(1) li:nth-child(6)",
      { text: "-0.0000", timeout: timeoutMilliseconds }
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
