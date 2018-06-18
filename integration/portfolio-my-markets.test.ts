"use strict";

import "jest-environment-puppeteer";
import Flash from "./helpers/flash";
import { UnlockedAccounts } from "./constants/accounts";
import { IFlash, IMarket } from "./types/types"
import { dismissDisclaimerModal } from "./helpers/dismiss-disclaimer-modal";
import { toMyMarkets } from "./helpers/navigation-helper";
import { createScalarMarket, createYesNoMarket, createCategoricalMarket } from './helpers/create-markets'
import { waitNextBlock } from './helpers/wait-new-block'
import BigNumber from 'bignumber.js'

const url = `${process.env.AUGUR_URL}`;

jest.setTimeout(10000);

let flash: IFlash = new Flash();

describe("My Markets", () => {
  beforeAll(async () => {
    await page.goto(url);

    // No idea what a 'typical' desktop resolution would be for our users.
    await page.setViewport({
      height: 1200,
      width: 1200
    });
    await dismissDisclaimerModal(page);

    // use account with no markets created
    await page.evaluate((account) => window.integrationHelpers.updateAccountAddress(account), UnlockedAccounts.SECONDARY_ACCOUNT);
    // go to my markets page
    await toMyMarkets()
    // verify that you are on that page
    await expect(page).toMatch('portfolio: my markets', { timeout: 5000 })

  });

  afterAll(async () => {
    flash.dispose()
  })

  it("should show an empty view if the user hasn't created any markets", async () => {
    await expect(page).toMatch('You haven\'t created any markets.', { timeout: 5000 })
  });

  it("should show all user account created markets", async () => {
    // create three markets
    //const scalarMarket: IMarket = await createScalarMarket()
    //await waitNextBlock()
    //const categoricalMarket: IMarket = await createCategoricalMarket(8)
    //const yesNoMarket: IMarket = await createYesNoMarket()
     const currentTimestamp: number = await page.evaluate(() => window.integrationHelpers.getCurrentTimestamp());

      const daysToAdjust = 2 * 86400000;
      const now = new Date(currentTimestamp)
      const marketDate = new Date(now.valueOf() + (daysToAdjust))
      const endTime = marketDate.getTime() / 1000
      const marketDesc = 'New YesNo Testing Market ' + endTime
      const marketEndTime = { timestamp: endTime}
      const newMarket =
      {
        category: "space",
        description: marketDesc,
        designatedReporterAddress: "",
        designatedReporterType: "DESIGNATED_REPORTER_SELF",
        endTime: marketEndTime,
        expirySourceType: "EXPIRY_SOURCE_GENERIC",
        orderBook: {},
        orderBookSeries: {},
        orderBookSorted: {},
        settlementFee: 0,
        tag1: "",
        tag2: "",
        tickSize: "0.0001",
        type: "yesNo",
      }
      const market = await page.evaluate((market) => window.integrationHelpers.createMarket(market), newMarket);
  });

  it("should have markets move through 'Open', 'In Reporting', and 'Resolved' sections appropriately", async () => {
  });

  it("should update market's volume correctly when trades occur", async () => {
  });

  it("should have outstanding returns become available to the market creator when complete sets settle, and that the amount that becomes available is correct", async () => {
  });

  it("should be able to collect outstanding returns from settled trades and the Collected Returns balance on the market updates correctly", async () => {
  });

  it("should the market be resolved to something other than 'Market is Invalid' (and the reporter claims their REP which triggers market finalization), then the Validity bond becomes available in 'Outstanding Returns', is claimable, and the Collected Returns balance updates properly", async () => {
  });

  it("should verify that, when a market is reported on by the Designated Reporter, the reporter gas bond becomes available in 'Outstanding Returns', is claimable, and the Collected Returns balance updates properly.", async () => {
  });

  it("should show most recently resolved markets at the top of the Resolved list", async () => {
  });
});
