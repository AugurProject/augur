"use strict";

import "jest-environment-puppeteer";
import Flash from "./helpers/flash";
import { UnlockedAccounts } from "./constants/accounts";
import { IFlash, IMarket } from "./types/types"
import { dismissDisclaimerModal } from "./helpers/dismiss-disclaimer-modal";
import { toMyMarkets, toPortfolio } from "./helpers/navigation-helper";
import { createScalarMarket, createYesNoMarket, createCategoricalMarket, createAssignedReporterMarket } from './helpers/create-markets'
import { waitNextBlock } from './helpers/wait-new-block'
import BigNumber from 'bignumber.js'

const url = `${process.env.AUGUR_URL}`;

jest.setTimeout(200000);

let flash: IFlash = new Flash();

describe("My Markets", () => {
  const scalarMarket: IMarket;
  const categoricalMarket: IMarket;
  const yesNoMarket: IMarket;

  beforeAll(async () => {
    await page.goto(url);

    // No idea what a 'typical' desktop resolution would be for our users.
    await page.setViewport({
      height: 1500,
      width: 1200
    });
    await dismissDisclaimerModal(page);

    // use account with no markets created
    await page.evaluate((account) => window.integrationHelpers.updateAccountAddress(account), UnlockedAccounts.SECONDARY_ACCOUNT);
    // go to my markets page
    await toMyMarkets()
    // verify that you are on that page
    await expect(page).toMatch('portfolio: my markets', { timeout: 5000 })
    // get rep needed to create markets
    await page.evaluate(() => window.integrationHelpers.getRep());
    page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  });

  afterAll(async () => {
    flash.dispose()
  })

  it("should show an empty view if the user hasn't created any markets", async () => {
    // need account to not have any created markets
    //await expect(page).toMatch('You haven\'t created any markets.', { timeout: 5000 })
  });

  // it("should show user account created markets", async () => {
  //   // create a market
  //   scalarMarket = await createScalarMarket()

  //   // expect market to be present
  //   await expect(page).toMatch(scalarMarket.description, { timeout: 5000 })
  // });

  // it("should have markets move through 'Open', 'In Reporting', and 'Resolved' sections appropriately", async () => {
  //   // expect market to be in 'Open' section
  //   await expect(page).toMatchElement("[data-testid='open-" + scalarMarket.id + "']", { timeout: 5000 })

  //   // put market in reporting state
  //   await flash.setMarketEndTime(scalarMarket.id)
  //   await flash.pushDays(1) 
  //   await waitNextBlock(2)

  //   // expect market to be in reporting section
  //   await expect(page).toMatchElement("[data-testid='inReporting-" + scalarMarket.id + "']", { timeout: 5000 })

  //   // finalize market
  //   await flash.forceFinalize(scalarMarket.id)

  //   // expect market to be in finalized section
  //   await expect(page).toMatchElement("[data-testid='resolved-" + scalarMarket.id + "']", { timeout: 10000 })
  // });

  it("should update market's volume correctly when trades occur", async () => {
    yesNoMarket = await createYesNoMarket()

    await page.evaluate((marketId, outcomeId) => window.integrationHelpers.placeTrade(marketId, outcomeId), yesNoMarket.marketId, 0);
  });

  it("should have outstanding returns become available to the market creator when complete sets settle, and that the amount that becomes available is correct", async () => {
  });

  it("should be able to collect outstanding returns from settled trades and the Collected Returns balance on the market updates correctly", async () => {
  });

  // it("should the market be resolved to something other than 'Market is Invalid' (and the reporter claims their REP which triggers market finalization), then the Validity bond becomes available in 'Outstanding Returns', is claimable, and the Collected Returns balance updates properly", async () => {
  //   // need to refresh page 
  //   await waitNextBlock(2)
  //   await toPortfolio()
  //   // go to my markets page
  //   await toMyMarkets()
  //   // verify that you are on that page
  //   await expect(page).toMatch('portfolio: my markets', { timeout: 5000 })

  //   // check for validity bond
  //   await expect(page).toMatchElement("[data-testid='unclaimedCreatorFees-" + scalarMarket.id + "'", { timeout: 100000 })
  //   // claim reporter gas bond
  //   await expect(page).toClick("[data-testid='collectMarketCreatorFees-" + scalarMarket.id + "'", { timeout: 10000 })
  //   // check that outstanding returns go away
  //   await expect(page).not.toMatchElement("[data-testid='unclaimedCreatorFees-" + scalarMarket.id + "'", { timeout: 10000 })
  // });

  // it("should verify that, when a market is reported on by the Designated Reporter, the reporter gas bond becomes available in 'Outstanding Returns', is claimable, and the Collected Returns balance updates properly.", async () => {
  //   // create market with designated reporter
  //   const assignedReporterMarket = await createAssignedReporterMarket(UnlockedAccounts.CONTRACT_OWNER)
  //   // make designated report
  //   await flash.designateReport(assignedReporterMarket.id, "0")

  //   // need to refresh page 
  //   await waitNextBlock(2)
  //   await toPortfolio()
  //   // go to my markets page
  //   await toMyMarkets()
  //   // verify that you are on that page
  //   await expect(page).toMatch('portfolio: my markets', { timeout: 5000 })

  //   // check for reporter gas bond
  //   await expect(page).toMatchElement("[data-testid='unclaimedCreatorFees-" + assignedReporterMarket.id + "'", { timeout: 100000 }) // ned to find creationFee
  //   // claim reporter gas bond
  //   await expect(page).toClick("[data-testid='collectMarketCreatorFees-" + assignedReporterMarket.id + "'", { timeout: 10000 })
  //   // check that outstanding returns go away
  //   await expect(page).not.toMatchElement("[data-testid='unclaimedCreatorFees-" + assignedReporterMarket.id + "'", { timeout: 10000 })
  // });

  it("should show most recently resolved markets at the top of the Resolved list", async () => {
  });
});
