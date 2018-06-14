"use strict";

import "jest-environment-puppeteer";
import Flash from "./helpers/flash";
import { IMarket, IFlash } from "./types/types"

const url = `${process.env.AUGUR_URL}`;
let marketId: string
const marketDesc = 'Will Ethereum trade at $2000 or higher at any time before the end of 2018?'
jest.setTimeout(100000);

describe.only("Initial Report", () => {
  beforeAll(async () => {
    await page.goto(url);
    const marketId =  await page.evaluate((marketDescription) => window.integrationHelpers.findMarketId(marketDescription), marketDesc);

    const flash: IFlash = new Flash();
    await flash.setMarketEndTime(marketId)
    await flash.pushSeconds(100) // get in market in designated reporting state

    await page.goto(url.concat('/#/report?id=' + marketId));

    // No idea what a 'typical' desktop resolution would be for our users.
    await page.setViewport({
      height: 1200,
      width: 1200
    });
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

  it("report on no", async () => {
    await expect(page).toClick("button", {
      text: "No"
    });

    await expect(page).toClick("button", {
      text: "Review"
    });

    await expect(page).toClick("button", {
      text: "Submit"
    });
  })

  it("report on Invalid", async () => {
    await expect(page).toClick("button", {
      text: "Market Is Invalid"
    });

    await expect(page).toClick("button", {
      text: "Review"
    });

    await expect(page).toClick("button", {
      text: "Submit"
    });
  })
})
