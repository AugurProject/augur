import "jest-environment-puppeteer";
import { UnlockedAccounts } from "./constants/accounts";
import { toMarket } from "./helpers/navigation-helper";
require("./helpers/beforeAll");

jest.setTimeout(100000);

describe("Trading", () => {
  beforeAll(async () => {
    const marketId = await page.evaluate((marketDescription) => window.integrationHelpers.findMarketId(marketDescription), 'Will the Larsen B ice shelf collapse by the end of November 2019?');
    await toMarket(marketId);
  });

  it("should display a modal", async () => {
    await expect(page).toClick("button", {
      text: "Sell"
    });

    await expect(page).toFill("input#tr__input--quantity", "0.0001");
    await expect(page).toFill("input#tr__input--limit-price", "0.0001");

    await expect(page).toClick("button", {
      text: "Review"
    });

    await expect(page).toClick("button", {
      text: "Confirm"
    });

    page.on('console', msg => console.log('PAGE LOG:', msg.text()));

    await page.evaluate((account) => window.integrationHelpers.updateAccountAddress(account), UnlockedAccounts.SECONDARY_ACCOUNT);
    await expect(page).toClick("button", {
      text: "Buy",
      timeout: 2000
    });

    await expect(page).toFill("input#tr__input--quantity", "0.0001");
    await expect(page).toFill("input#tr__input--limit-price", "0.0001");

    await expect(page).toClick("button", {
      text: "Review"
    });

    await expect(page).toClick("button", {
      text: "Confirm"
    });
  });
});
