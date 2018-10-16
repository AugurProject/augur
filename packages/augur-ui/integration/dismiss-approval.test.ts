import "jest-environment-puppeteer";
import { UnlockedAccounts } from "./constants/accounts";
import { toMarket } from "./helpers/navigation-helper";
require("./helpers/beforeAll");

const timeoutMilliseconds = 2000;

jest.setTimeout(100000);

describe("Trading", () => {
  beforeAll(async () => {
    const marketId = await page.evaluate(
      marketDescription =>
        window.integrationHelpers.findMarketId(marketDescription),
      "Will the Larsen B ice shelf collapse by the end of November 2019?"
    );
    await toMarket(marketId);
  });

  it("should display a modal", async () => {
    await expect(page).toClick("button", {
      text: "Sell",
      timeout: timeoutMilliseconds
    });

    await expect(page).toFill("input#tr__input--quantity", "0.0001", {
      timeout: timeoutMilliseconds
    });
    await expect(page).toFill("input#tr__input--limit-price", "0.0001", {
      timeout: timeoutMilliseconds
    });

    await expect(page).toClick("button", {
      text: "Review",
      timeout: timeoutMilliseconds
    });

    await expect(page).toClick("button", {
      text: "Confirm",
      timeout: timeoutMilliseconds
    });

    page.on("console", msg => console.log("PAGE LOG:", msg.text()));

    await page.evaluate(
      account => window.integrationHelpers.updateAccountAddress(account),
      UnlockedAccounts.SECONDARY_ACCOUNT
    );
    await expect(page).toClick("button", {
      text: "Buy",
      timeout: timeoutMilliseconds
    });

    await expect(page).toFill("input#tr__input--quantity", "0.0001", {
      timeout: timeoutMilliseconds
    });
    await expect(page).toFill("input#tr__input--limit-price", "0.0001", {
      timeout: timeoutMilliseconds
    });

    await expect(page).toClick("button", {
      text: "Review",
      timeout: timeoutMilliseconds
    });

    await expect(page).toClick("button", {
      text: "Confirm",
      timeout: timeoutMilliseconds
    });
  });
});
