import "jest-environment-puppeteer";
const puppeteer = require('puppeteer');
import {UnlockedAccounts} from "./constants/accounts";

const url = `${process.env.AUGUR_URL}`;

jest.setTimeout(100000);

describe("Create market page", () => {
  beforeAll(async () => {
    await page.goto(url, {waitUntil: "networkidle0"});

    // TODO: Determine what a 'typical' desktop resolution would be for our users
    await page.setViewport({
      height: 1200,
      width: 1200
    });
  });

  it("should allow user to create a new binary market", async () => {
    // Dismiss welcome to beta popup
    await expect(page).toClick("button", { text: "I have read and understand the above" });

    await page.goto(url.concat("#/create-market"), {waitUntil: "networkidle0"});

    // Fill out Define page
    await expect(page).toFill("#cm__input--desc", "Will this integration test succeed?");
    await expect(page).toFill("#cm__input--cat", "Integration Test");
    await expect(page).toFill("#cm__input--tag1", "Integration");
    await expect(page).toFill("#cm__input--tag2", "Test");
    await expect(page).toClick("button", { text: "Next: Outcome" });

    // Fill out Outcome page
    await expect(page).toClick("button", { text: "Yes/No" });
    await expect(page).toFill("#cm__input--details", "Here is some additional information.");
    await expect(page).toClick("button", { text: "Next: Resolution" });

    // Fill out Resolution page
    await expect(page).toClick("button", { text: "Outcome will be detailed on a public website" });
    await expect(page).toFill(".create-market-form-styles_CreateMarketForm__fields li:nth-child(1) ul li div input", "https://www.reuters.com");
    await expect(page).toClick("button", { text: "Someone Else" });
    await expect(page).toFill(".create-market-form-styles_CreateMarketForm__fields li:nth-child(2) ul li div input", "0xbd355A7e5a7ADb23b51F54027E624BfE0e238DF6");
    await expect(page).toFill("#cm__input--date", "Jan 1, 2030");
    await expect(page).toSelect("#cm__input--time div:nth-child(1) select", "1");
    await expect(page).toSelect("#cm__input--time div:nth-child(2) select", "00");
    await expect(page).toSelect("#cm__input--time div:nth-child(3) select", "AM");
    await expect(page).toClick("button", { text: "Next: Liquidity" });

    // Fill out Liquidity page
    await expect(page).toFill("#cm__input--settlement", "1");
    await expect(page).toFill("#cm__input--quantity", "1");
    await expect(page).toFill("#cm__input--limit-price", "0.5");
    await expect(page).toClick("button", { text: "Add Order" });
    await expect(page).toClick("button", { text: "Next: Review" });

    // Submit new market on Review page
    await expect(page).toClick("button", { text: "Submit" });
  });
});
