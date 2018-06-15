"use strict";

import "jest-environment-puppeteer";
import Flash from "./helpers/flash";
import { IFlash } from "./types/types"
import { dismissDisclaimerModal } from "./helpers/dismiss-disclaimer-modal";
import { toInitialReporting } from "./helpers/navigation-helper";

const url = `${process.env.AUGUR_URL}`;
const marketDesc = 'Will Ethereum trade at $2000 or higher at any time before the end of 2018?'
jest.setTimeout(100000);

describe("Initial Report -- Yes", () => {
  beforeAll(async () => {

    // No idea what a 'typical' desktop resolution would be for our users.
    await page.setViewport({
      height: 1200,
      width: 1200
    });

    await page.goto(url);
    await dismissDisclaimerModal(page);
    const marketId =  await page.evaluate((marketDescription) => window.integrationHelpers.findMarketId(marketDescription), marketDesc);

    const flash: IFlash = new Flash();
    await flash.setMarketEndTime(marketId)
    await flash.pushSeconds(100) // get in market in designated reporting state

    await toInitialReporting(marketDesc)

  });

  it("report on yes", async () => {
    await expect(page).toClick("button", {
      text: "Yes"
    });

    await expect(page).toClick("button", {
      text: "Review"
    });

    await expect(page).toClick("button", {
      text: "Submit"
    });
  })
})
