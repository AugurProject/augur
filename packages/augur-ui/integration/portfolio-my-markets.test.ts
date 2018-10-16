"use strict";

import "jest-environment-puppeteer";
import Flash from "./helpers/flash";
import { UnlockedAccounts } from "./constants/accounts";
import { IFlash, IMarket, MarketCosts } from "./types/types";
import { toMyMarkets, toPortfolio } from "./helpers/navigation-helper";
import {
  createYesNoMarket,
  createScalarMarket
} from "./helpers/create-markets";
import { waitNextBlock } from "./helpers/wait-new-block";
import BigNumber from "bignumber.js";
require("./helpers/beforeAll");

// TODO: Replace uses of `url` with calls to functions in navigation-helper
const url = `${process.env.AUGUR_URL}`;
const SMALL_TIMEOUT = 10000;
const BIG_TIMEOUT = 100000;

jest.setTimeout(200000);

let flash: IFlash = new Flash();

// this test only works on first run, and better so on fresh docker image

describe("My Markets", () => {
  let scalarMarket: IMarket;
  let categoricalMarket: IMarket;
  let yesNoMarket: IMarket;
  let marketId: string;
  let marketCosts: MarketCosts;

  beforeAll(async () => {
    marketId = await page.evaluate(
      marketDescription =>
        window.integrationHelpers.findMarketId(marketDescription),
      "Will the Larsen B ice shelf collapse by the end of November 2019?"
    );
    marketCosts = await page.evaluate(() =>
      window.integrationHelpers.getMarketCreationCostBreakdown()
    );

    // go to my markets page
    await toMyMarkets();
    // verify that you are on that page
    await expect(page).toMatch("portfolio: my markets", {
      timeout: SMALL_TIMEOUT
    });
  });

  afterAll(async () => {
    flash.dispose();
  });

  it("should update market's volume correctly when trades occur", async () => {
    //needs the market to not have any volume
    //check that market has 0 volume

    let market = await page.$("[id='id-" + marketId + "']");
    await expect(market).toMatchElement(".value_volume", {
      text: "0",
      timeout: SMALL_TIMEOUT
    });

    // fill market order
    await flash.fillMarketOrders(marketId, "1", "buy");

    // check that volume updates correctly
    market = await page.$("[id='id-" + marketId + "']");
    await expect(page).toMatchElement("span.value_volume", {
      text: "0.0030",
      timeout: SMALL_TIMEOUT
    });
  });

  it("should show an empty view if the user hasn't created any markets", async () => {
    // needs secondary account to not have any previously created markets
    // use account with no markets created
    await page.evaluate(
      account => window.integrationHelpers.updateAccountAddress(account),
      UnlockedAccounts.SECONDARY_ACCOUNT
    );
    // go to my markets page
    await toMyMarkets();
    // verify that you are on that page
    await expect(page).toMatch("portfolio: my markets", {
      timeout: SMALL_TIMEOUT
    });
    // need account to not have any created markets
    await expect(page).toMatch("You haven't created any markets.", {
      timeout: SMALL_TIMEOUT
    });
  });

  it("should show user account created markets", async () => {
    // get rep needed to create markets
    await page.evaluate(() => window.integrationHelpers.getRep());
    // create a market
    scalarMarket = await createScalarMarket();

    // expect market to be present
    await expect(page).toMatch(scalarMarket.description, {
      timeout: SMALL_TIMEOUT
    });
  });

  it("should have markets move through 'Open', 'In Reporting', and 'Resolved' sections appropriately", async () => {
    // expect market to be in 'Open' section
    await expect(page).toMatchElement(
      "[data-testid='open-" + scalarMarket.id + "']",
      { timeout: SMALL_TIMEOUT }
    );

    // put market in reporting state
    await flash.setMarketEndTime(scalarMarket.id);
    await flash.pushDays(1);
    await waitNextBlock(2);

    // expect market to be in reporting section
    await expect(page).toMatchElement(
      "[data-testid='inReporting-" + scalarMarket.id + "']",
      { timeout: SMALL_TIMEOUT }
    );

    // finalize market
    await flash.forceFinalize(scalarMarket.id);

    // expect market to be in finalized section
    await expect(page).toMatchElement(
      "[data-testid='resolved-" + scalarMarket.id + "']",
      { timeout: SMALL_TIMEOUT }
    );
  });

  it("should the market be resolved to something other than 'Market is Invalid' (and the reporter claims their REP which triggers market finalization), then the Validity bond becomes available in 'Outstanding Returns', is claimable, and the Collected Returns balance updates properly", async () => {
    // need to refresh page because forceFinalize was used
    await waitNextBlock(5);
    await toPortfolio();
    // go to my markets page
    await toMyMarkets();
    // verify that you are on that page
    await expect(page).toMatch("portfolio: my markets", {
      timeout: SMALL_TIMEOUT
    });

    const validityBond = await page.evaluate(
      value => window.integrationHelpers.formatEth(value),
      marketCosts.validityBond
    );
    // check for validity bond
    await expect(page).toMatchElement(
      "[data-testid='unclaimedCreatorFees-" + scalarMarket.id + "']",
      { text: validityBond.formatted, timeout: BIG_TIMEOUT }
    );
    // claim validity bond
    await expect(page).toClick(
      "[data-testid='collectMarketCreatorFees-" + scalarMarket.id + "']",
      { timeout: SMALL_TIMEOUT }
    );
    // check that outstanding returns go away;
    await expect(page).not.toMatchElement(
      "[data-testid='unclaimedCreatorFees-" + scalarMarket.id + "']",
      { text: validityBond.formatted, timeout: BIG_TIMEOUT }
    );
  });

  it("should have outstanding returns become available to the market creator when complete sets settle, and that the amount that becomes available is correct", async () => {});

  it("should be able to collect outstanding returns from settled trades and the Collected Returns balance on the market updates correctly", async () => {
    // 1. fill trades
    // first account is market creater
    await page.evaluate(
      account => window.integrationHelpers.updateAccountAddress(account),
      UnlockedAccounts.CONTRACT_OWNER
    );
    const market = await createYesNoMarket("", 5);
    await waitNextBlock(10);

    // create order
    await flash.createMarketOrder(market.id, "1", "sell", ".5", "5");
    await waitNextBlock(5);

    let flashSecondary: IFlash = new Flash(
      UnlockedAccounts.SECONDARY_ACCOUNT_PRIV
    );

    // use second account to fill order
    await page.evaluate(
      account => window.integrationHelpers.updateAccountAddress(account),
      UnlockedAccounts.SECONDARY_ACCOUNT
    );
    await waitNextBlock(5);

    await flashSecondary.fillMarketOrders(market.id, "1", "buy");
    await waitNextBlock(5);

    // 2. initial report
    await flash.initialReport(market.id, "1", false, false);
    await waitNextBlock(5);

    // 3. push time so market is finalized
    await flash.pushDays(14);
    await waitNextBlock(5);

    // 4. finalize market by clicking button on account 1
    await page.evaluate(
      account => window.integrationHelpers.updateAccountAddress(account),
      UnlockedAccounts.CONTRACT_OWNER
    );
    await waitNextBlock(5);
    await toPortfolio(); // need this back and forth because of a bug ch15283
    await waitNextBlock(10);
    await expect(page).toClick(
      "[data-testid='claimButton-" + market.id + "']",
      { timeout: BIG_TIMEOUT }
    );
    await waitNextBlock(10);
    await page.reload(); // reload needed because of ch15614

    // 5. go to my positions and claim outstanding returns
    // push time to claim
    await flash.pushDays(8);
    await waitNextBlock(5);
    await toPortfolio();
    await waitNextBlock(10);
    await expect(page).toClick(
      "[data-testid='claimButton-" + market.id + "']",
      { timeout: BIG_TIMEOUT }
    );
    await waitNextBlock(10);

    //6. check in my-markets for proceeds
    await page.evaluate(
      account => window.integrationHelpers.updateAccountAddress(account),
      UnlockedAccounts.CONTRACT_OWNER
    );
    await waitNextBlock(5);
    await toMyMarkets();
    await waitNextBlock(5);
    await expect(page).toMatchElement(
      "[data-testid='unclaimedCreatorFees-" + market.id + "']",
      { text: ".2600", timeout: BIG_TIMEOUT }
    );
    await expect(page).toClick(
      "[data-testid='collectMarketCreatorFees-" + market.id + "']",
      { timeout: BIG_TIMEOUT }
    );
    await waitNextBlock(10);
    await expect(page).not.toMatchElement(
      "[data-testid='collectMarketCreatorFees-" + market.id + "']",
      { timeout: BIG_TIMEOUT }
    );
  });
});
