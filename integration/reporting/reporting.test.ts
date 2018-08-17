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

describe("Categorical Initial Report", () => {
  beforeAll(async () => {
    await toDefaultView();
  });

  afterAll(async () => {
    flash.dispose();
  });

  beforeEach(async () => {
    await toReporting();

    const market: IMarket = await createCategoricalMarket(4);

    await flash.setMarketEndTime(market.id);
    await flash.pushDays(1); // put market in designated reporting state

    await waitNextBlock();
    await toInitialReporting(market.id);
  });

  it("report on outcome_1", async () => {
    await expect(page).toClick("button", {
      text: "outcome_1",
      timeout: 1000
    });

    await expect(page).toClick("button", {
      text: "Review"
    });

    await expect(page).toClick("button", {
      text: "Submit",
      timeout: 1000
    });
  });

  it("report on outcome_2", async () => {
    await expect(page).toClick("button", {
      text: "outcome_2",
      timeout: 1000
    });

    await expect(page).toClick("button", {
      text: "Review"
    });

    await expect(page).toClick("button", {
      text: "Submit",
      timeout: 1000
    });
  });

  it("report on outcome_3", async () => {
    await expect(page).toClick("button", {
      text: "outcome_3",
      timeout: 1000
    });

    await expect(page).toClick("button", {
      text: "Review"
    });

    await expect(page).toClick("button", {
      text: "Submit",
      timeout: 1000
    });
  });

  it("report on outcome_4", async () => {
    await expect(page).toClick("button", {
      text: "outcome_4",
      timeout: 1000
    });

    await expect(page).toClick("button", {
      text: "Review"
    });

    await expect(page).toClick("button", {
      text: "Submit",
      timeout: 1000
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
      text: "Submit",
      timeout: 1000
    });
  });
});

describe("Categorical Open Report", () => {
  beforeAll(async () => {
    await toDefaultView();
    await waitNextBlock(2);
  });

  afterAll(async () => {
    flash.dispose();
  });

  beforeEach(async () => {
    await page.evaluate(
      account => window.integrationHelpers.updateAccountAddress(account),
      UnlockedAccounts.CONTRACT_OWNER
    );
    await waitNextBlock(2);

    const market: IMarket = await createCategoricalMarket(4);
    await page.evaluate(
      account => window.integrationHelpers.updateAccountAddress(account),
      UnlockedAccounts.SECONDARY_ACCOUNT
    );
    await toReporting();

    await flash.setMarketEndTime(market.id);
    await flash.pushDays(5); // put market in open reporting state
    await waitNextBlock(2);
    await toInitialReporting(market.id);
  });

  it("report on outcome_1", async () => {
    await expect(page).toClick("button", {
      text: "outcome_1",
      timeout: 10000
    });

    await expect(page).toClick("button", {
      text: "Review"
    });

    await expect(page).toClick("button", {
      text: "Submit",
      timeout: 1000
    });
  });

  it("report on outcome_2", async () => {
    await expect(page).toClick("button", {
      text: "outcome_2",
      timeout: 1000
    });

    await expect(page).toClick("button", {
      text: "Review"
    });

    await expect(page).toClick("button", {
      text: "Submit",
      timeout: 1000
    });
  });

  it("report on outcome_3", async () => {
    await expect(page).toClick("button", {
      text: "outcome_3",
      timeout: 1000
    });

    await expect(page).toClick("button", {
      text: "Review"
    });

    await expect(page).toClick("button", {
      text: "Submit",
      timeout: 1000
    });
  });

  it("report on outcome_4", async () => {
    await expect(page).toClick("button", {
      text: "outcome_4",
      timeout: 1000
    });

    await expect(page).toClick("button", {
      text: "Review"
    });

    await expect(page).toClick("button", {
      text: "Submit",
      timeout: 1000
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
      text: "Submit",
      timeout: 1000
    });
  });
});

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

describe("YesNo Open Report", () => {
  beforeAll(async () => {
    await toDefaultView();
  });

  afterAll(async () => {
    flash.dispose();
  });

  beforeEach(async () => {
    await page.evaluate(
      account => window.integrationHelpers.updateAccountAddress(account),
      UnlockedAccounts.CONTRACT_OWNER
    );
    await waitNextBlock(2);

    const market: IMarket = await createYesNoMarket();
    await page.evaluate(
      account => window.integrationHelpers.updateAccountAddress(account),
      UnlockedAccounts.SECONDARY_ACCOUNT
    );
    await toReporting();

    await flash.setMarketEndTime(market.id);
    await flash.pushDays(5); // put market in open reporting state
    await waitNextBlock(2);
    await toInitialReporting(market.id);
  });

  it("report on yes", async () => {
    await expect(page).toClick("button", {
      text: "Yes",
      timeout: 10000
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

describe("Scalar Open Report", () => {
  beforeAll(async () => {
    await toDefaultView();
  });

  afterAll(async () => {
    flash.dispose();
  });

  beforeEach(async () => {
    await page.evaluate(
      account => window.integrationHelpers.updateAccountAddress(account),
      UnlockedAccounts.CONTRACT_OWNER
    );
    await waitNextBlock(2);

    const market: IMarket = await createScalarMarket();
    await page.evaluate(
      account => window.integrationHelpers.updateAccountAddress(account),
      UnlockedAccounts.SECONDARY_ACCOUNT
    );
    await toReporting();

    await flash.setMarketEndTime(market.id);
    await flash.pushDays(5); // put market in open reporting state
    await waitNextBlock(2);
    await toInitialReporting(market.id);
  });

  it("report on 10", async () => {
    await expect(page).toFill("#sr__input--outcome-scalar", "10");
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
