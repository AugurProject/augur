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


describe("Scalar Initial Report", () => {
  beforeAll(async () => {
    await toDefaultView();
  });

  afterAll(async () => {
    flash.dispose();
  });

  beforeEach(async () => {
    await toReporting();

    const market: IMarket = await createScalarMarket();

    await flash.setMarketEndTime(market.id);
    await flash.pushDays(1); // put market in designated reporting state

    await waitNextBlock();
    await toInitialReporting(market.id);
  });

  it("report on 10", async () => {
    await expect(page).toFill("#sr__input--outcome-scalar", "10", {
      timeout: 10000
    });
    await expect(page).toClick("button", {
      text: "Review"
    });

    await expect(page).toClick("button", {
      text: "Submit"
    });
  });

  it("report on 0", async () => {
    await expect(page).toFill("#sr__input--outcome-scalar", "0");
    await expect(page).toClick("button", {
      text: "Review"
    });

    await expect(page).toClick("button", {
      text: "Submit"
    });
  });

  it("report on -10", async () => {
    await expect(page).toFill("#sr__input--outcome-scalar", "-10");
    await expect(page).toClick("button", {
      text: "Review"
    });

    await expect(page).toClick("button", {
      text: "Submit"
    });
  });

  it("report on 5.01", async () => {
    await expect(page).toFill("#sr__input--outcome-scalar", "5.01");
    await expect(page).toClick("button", {
      text: "Review"
    });

    await expect(page).toClick("button", {
      text: "Submit"
    });
  });

  it("report on -5.01", async () => {
    await expect(page).toFill("#sr__input--outcome-scalar", "-5.01");
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
