"use strict";

import "jest-environment-puppeteer";
import Flash from "../helpers/flash";
import { IFlash, IMarket } from "../types/types";
import {
  toDefaultView,
  toReporting,
  toInitialReporting
} from "../helpers/navigation-helper";
import {
  createCategoricalMarket,
  createScalarMarket,
  createYesNoMarket
} from "../helpers/create-markets";
import { UnlockedAccounts } from "../constants/accounts";
import { waitNextBlock } from "../helpers/wait-new-block";

jest.setTimeout(30000);

let flash: IFlash = new Flash();

describe("YesNo Initial Report", () => {
  beforeAll(async () => {
    await toDefaultView();
  });

  afterAll(async () => {
    flash.dispose();
  });

  beforeEach(async () => {
    await toReporting();

    const market: IMarket = await createYesNoMarket();

    await flash.setMarketEndTime(market.id);
    await flash.pushDays(1); // put market in designated reporting state

    await waitNextBlock();
    await toInitialReporting(market.id);
  });

  it("report on yes", async () => {
    await expect(page).toClick("button", {
      text: "Yes",
      timeout: 1000
    });

    await expect(page).toClick("button", {
      text: "Review"
    });

    await expect(page).toClick("button", {
      text: "Submit"
    });
  });

  it("report on No", async () => {
    await expect(page).toClick("button", {
      text: "No",
      timeout: 1000
    });

    await expect(page).toClick("button", {
      text: "Review"
    });

    await expect(page).toClick("button", {
      text: "Submit"
    });
  });

  it("report on Invalid", async () => {
    await expect(page).toClick("button", {
      text: "Market is invalid",
      timeout: 1000
    });

    await expect(page).toClick("button", {
      text: "Review"
    });

    await expect(page).toClick("button", {
      text: "Submit"
    });
  });
});
