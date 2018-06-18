"use strict";

import "jest-environment-puppeteer";
import Flash from "../helpers/flash";
import { IFlash, IMarket } from "../types/types"
import { toDefaultView, toReporting, toInitialReporting } from "../helpers/navigation-helper";
import { createCategoricalMarket } from '../helpers/create-markets'
import {UnlockedAccounts} from "../constants/accounts";
import { waitNextBlock } from '../helpers/wait-new-block'

jest.setTimeout(30000);

let flash: IFlash = new Flash();

describe("Categorical Open Report", () => {
  beforeAll(async () => {
    await toDefaultView()
  });

  afterAll(async () => {
    flash.dispose()
  })

  beforeEach(async () => {
    await page.evaluate((account) => window.integrationHelpers.updateAccountAddress(account), UnlockedAccounts.CONTRACT_OWNER);

    const market: IMarket = await createCategoricalMarket(8)
    console.log('market created', market.id)
    await page.evaluate((account) => window.integrationHelpers.updateAccountAddress(account), UnlockedAccounts.SECONDARY_ACCOUNT);
    console.log('user switched')
    await toReporting()

    await flash.setMarketEndTime(market.id)
    await flash.pushDays(5) // put market in open reporting state
    await waitNextBlock(2)
    await toInitialReporting(market.id)
  });

  it("report on outcome_1", async () => {
    await expect(page).toClick("button", {
      text: "outcome_1",
      timeout: 1000,
    });

    await expect(page).toClick("button", {
      text: "Review"
    });

    await expect(page).toClick("button", {
      text: "Submit",
      timeout: 1000,
    });
  })

  it("report on outcome_2", async () => {
    await expect(page).toClick("button", {
      text: "outcome_2",
      timeout: 1000,
    });

    await expect(page).toClick("button", {
      text: "Review"
    });

    await expect(page).toClick("button", {
      text: "Submit",
      timeout: 1000,
    });
  })

  it("report on outcome_3", async () => {
    await expect(page).toClick("button", {
      text: "outcome_3",
      timeout: 1000,
    });

    await expect(page).toClick("button", {
      text: "Review"
    });

    await expect(page).toClick("button", {
      text: "Submit",
      timeout: 1000,
    });
  })

  it("report on outcome_4", async () => {
    await expect(page).toClick("button", {
      text: "outcome_4",
      timeout: 1000,
    });

    await expect(page).toClick("button", {
      text: "Review"
    });

    await expect(page).toClick("button", {
      text: "Submit",
      timeout: 1000,
    });
  })

  it("report on outcome_5", async () => {
    await expect(page).toClick("button", {
      text: "outcome_5",
      timeout: 1000,
    });

    await expect(page).toClick("button", {
      text: "Review"
    });

    await expect(page).toClick("button", {
      text: "Submit",
      timeout: 1000,
    });
  })

  it("report on outcome_6", async () => {
    await expect(page).toClick("button", {
      text: "outcome_6",
      timeout: 1000,
    });

    await expect(page).toClick("button", {
      text: "Review"
    });

    await expect(page).toClick("button", {
      text: "Submit",
      timeout: 1000,
    });
  })

  it("report on outcome_7", async () => {
    await expect(page).toClick("button", {
      text: "outcome_7",
      timeout: 1000,
    });

    await expect(page).toClick("button", {
      text: "Review"
    });

    await expect(page).toClick("button", {
      text: "Submit",
      timeout: 1000,
    });
  })

  it("report on outcome_8", async () => {
    await expect(page).toClick("button", {
      text: "outcome_8",
      timeout: 1000,
    });

    await expect(page).toClick("button", {
      text: "Review"
    });

    await expect(page).toClick("button", {
      text: "Submit",
      timeout: 1000,
    });
  })

  it("report on Invalid", async () => {
    await expect(page).toClick("button", {
      text: "Market is invalid",
      timeout: 1000,
    });

    await expect(page).toClick("button", {
      text: "Review"
    });

    await expect(page).toClick("button", {
      text: "Submit",
      timeout: 1000,
    });
  })

})
