"use strict";

import "jest-environment-puppeteer";
import Flash from "../helpers/flash";
import { IFlash, IMarket } from "../types/types";
import {
  toDefaultView,
  clickToMarkets,
  searchForMarketByDescription
} from "../helpers/navigation-helper";
import {
  createCategoricalMarket,
  createScalarMarket,
  createYesNoMarket
} from "../helpers/create-markets";
import { UnlockedAccounts } from "../constants/accounts";
import { waitNextBlock } from "../helpers/wait-new-block";
require("../helpers/beforeAll");

const timeoutMilliseconds = 10000;

jest.setTimeout(100000);

let flash: IFlash = new Flash();

describe("Scalar Open Report", () => {
  beforeAll(async () => {
    await toDefaultView();
  });

  afterAll(async () => {
    flash.dispose();
  });

  beforeEach(async () => {
    await waitNextBlock(2);
    clickToMarkets(timeoutMilliseconds);

    await page.evaluate(
      account => window.integrationHelpers.updateAccountAddress(account),
      UnlockedAccounts.CONTRACT_OWNER
    );
    await waitNextBlock(2);

    const market: IMarket = await createScalarMarket();
    await waitNextBlock(20);

    await page.evaluate(
      account => window.integrationHelpers.updateAccountAddress(account),
      UnlockedAccounts.SECONDARY_ACCOUNT
    );

    await flash.setMarketEndTime(market.id);
    await waitNextBlock(5);
    await flash.pushDays(5); // put market in open reporting state
    await waitNextBlock(5);

    searchForMarketByDescription(market.description, timeoutMilliseconds);
    await waitNextBlock(10);
  });

  it("report on 10", async () => {
    await expect(page).toFill("#sr__input--outcome-scalar", "10");
    await expect(page).toClick("button", {
      text: "Review",
      timeout: timeoutMilliseconds
    });

    await expect(page).toClick("button", {
      text: "Submit",
      timeout: timeoutMilliseconds
    });
  });

  it("report on 0", async () => {
    await expect(page).toFill("#sr__input--outcome-scalar", "0");
    await expect(page).toClick("button", {
      text: "Review",
      timeout: timeoutMilliseconds
    });

    await expect(page).toClick("button", {
      text: "Submit",
      timeout: timeoutMilliseconds
    });
  });

  it("report on -10", async () => {
    await expect(page).toFill("#sr__input--outcome-scalar", "-10");
    await expect(page).toClick("button", {
      text: "Review",
      timeout: timeoutMilliseconds
    });

    await expect(page).toClick("button", {
      text: "Submit",
      timeout: timeoutMilliseconds
    });
  });

  it("report on 5.01", async () => {
    await expect(page).toFill("#sr__input--outcome-scalar", "5.01");
    await expect(page).toClick("button", {
      text: "Review",
      timeout: timeoutMilliseconds
    });

    await expect(page).toClick("button", {
      text: "Submit",
      timeout: timeoutMilliseconds
    });
  });

  it("report on -5.01", async () => {
    await expect(page).toFill("#sr__input--outcome-scalar", "-5.01");
    await expect(page).toClick("button", {
      text: "Review",
      timeout: timeoutMilliseconds
    });

    await expect(page).toClick("button", {
      text: "Submit",
      timeout: timeoutMilliseconds
    });
  });

  it("report on Invalid", async () => {
    await expect(page).toClick("button", {
      text: "Market is invalid",
      timeout: timeoutMilliseconds
    });

    await expect(page).toClick("button", {
      text: "Review",
      timeout: timeoutMilliseconds
    });

    await expect(page).toClick("button", {
      text: "Submit",
      timeout: timeoutMilliseconds
    });
  });
});
