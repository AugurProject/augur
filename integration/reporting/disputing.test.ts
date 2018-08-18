import "jest-environment-puppeteer";
import Flash from "../helpers/flash";
import { IFlash, IMarket, Outcome } from "../types/types";
import { UnlockedAccounts } from "../constants/accounts";
import { toDisputing } from "../helpers/navigation-helper";
import {
  createYesNoMarket,
  createCategoricalMarket,
  createScalarMarket
} from "../helpers/create-markets";
import { waitNextBlock } from "../helpers/wait-new-block";
require("../helpers/beforeAll");

// TODO: Replace uses of `url` with calls to functions in navigation-helper
const url = `${process.env.AUGUR_URL}`;
const SMALL_TIMEOUT = 80000;
const BIG_TIMEOUT = 160000;

jest.setTimeout(200000);

let flash: IFlash = new Flash();

const disputeOnAllOutcomes = async (
  marketId: string,
  outcomes: Outcome[],
  isScalar: boolean = false
) => {
  const amount = "0.3000";

  for (let i = 0; i < outcomes.length; i++) {
    if (!outcomes[i].tentativeWinning) {
      await disputeOnOutcome(marketId, outcomes[i], amount);
      await verifyDisputedOutcome(marketId, outcomes[i].id, amount);
    }
  }

  if (isScalar) {
    const values: string[] = ["-2", ".2", "-.2", "10", "-10"];
    for (const value of values) {
      await disputeOnScalarOutcome(marketId, value, amount);
    }
  }
  return;
};

const disputeOnOutcome = async (
  marketId: string,
  outcome: Outcome,
  amount: string
) => {
  await expect(page).toClick("[data-testid='link-" + marketId + "']", {
    text: "dispute",
    timeout: BIG_TIMEOUT
  });
  await expect(page).toClick("[data-testid='button-" + outcome.id + "']", {
    timeout: BIG_TIMEOUT
  });
  await expect(page).toFill("#sr__input--stake", amount, {
    timeout: SMALL_TIMEOUT
  });
  await expect(page).toClick("button", {
    text: "Review",
    timeout: SMALL_TIMEOUT
  });
  await expect(page).toClick("button", {
    text: "Submit",
    timeout: BIG_TIMEOUT
  });
  return;
};

const disputeOnScalarOutcome = async (
  marketId: string,
  outcomeValue: string,
  amount: string
) => {
  await expect(page).toClick("[data-testid='link-" + marketId + "']", {
    text: "dispute",
    timeout: BIG_TIMEOUT
  });
  await expect(page).toClick("[data-testid='scalar-dispute-button']", {
    timeout: BIG_TIMEOUT
  });
  await expect(page).toFill("#sr__input--outcome-scalar", outcomeValue, {
    timeout: SMALL_TIMEOUT
  });
  await expect(page).toFill("#sr__input--stake", amount, {
    timeout: SMALL_TIMEOUT
  });
  await expect(page).toClick("button", {
    text: "Review",
    timeout: SMALL_TIMEOUT
  });
  await expect(page).toClick("button", {
    text: "Submit",
    timeout: BIG_TIMEOUT
  });
  return;
};

const verifyDisputedOutcome = async (
  marketId: string,
  outcomeId: string,
  amount: string
) => {
  // TODO: need to be aware of "+ more" button
  await expect(page).toMatchElement(
    "[data-testid='disputeBond-" + marketId + "-" + outcomeId + "']",
    {
      text: amount,
      timeout: BIG_TIMEOUT
    }
  );
  return;
};

describe("Disputing", () => {
  let market: IMarket;

  beforeAll(async () => {
    await toDisputing();

    market = await createYesNoMarket();
    await waitNextBlock(10);
    await flash.initialReport(market.id, "0", false, false);
    await flash.pushWeeks(1); // push into dispute window
  });

  afterAll(async () => {
    flash.dispose();
  });

  describe("Basics", () => {
    it("should be shown the 'No-REP' message if your account has no REP", async () => {
      await page.evaluate(
        account => window.integrationHelpers.updateAccountAddress(account),
        UnlockedAccounts.SECONDARY_ACCOUNT
      );
      await toDisputing();
      await expect(page).toMatch(
        "You have 0 REP available. Add funds to dispute markets or purchase participation tokens.",
        { timeout: SMALL_TIMEOUT }
      );
    });

    it("should not be able to submit a dispute without REP", async () => {
      // check that button is disabled
      await expect(page).toMatchElement(
        "[data-testid='link-" + market.id + "']",
        { text: "dispute", timeout: SMALL_TIMEOUT }
      );
    });
  });

  describe("Disputing Mechanisms", () => {
    let yesNoMarket: IMarket;
    let categoricalMarket: IMarket;
    let scalarMarket: IMarket;
    let outcomes: { [key: string]: Outcome[] };

    beforeAll(async () => {
      await page.evaluate(() => window.integrationHelpers.getRep());
      await waitNextBlock(2);
    });

    describe("Yes/No Market", () => {
      beforeAll(async () => {
        yesNoMarket = await createYesNoMarket();
        await waitNextBlock(15);
        await flash.initialReport(yesNoMarket.id, "0", false, false);
        await flash.pushWeeks(1);
        await waitNextBlock(15);
        outcomes = await page.evaluate(() =>
          window.integrationHelpers.getMarketDisputeOutcomes()
        );
      });

      it("should be able to dispute on all outcomes", async () => {
        await disputeOnAllOutcomes(
          yesNoMarket.id,
          outcomes[yesNoMarket.id],
          false
        );
      });
    });

    describe("Categorical Market", () => {
      beforeAll(async () => {
        categoricalMarket = await createCategoricalMarket(4);
        await waitNextBlock(15);
        await flash.initialReport(categoricalMarket.id, "0", false, false);
        await flash.pushWeeks(1);
        await waitNextBlock(15);
        outcomes = await page.evaluate(() =>
          window.integrationHelpers.getMarketDisputeOutcomes()
        );
      });
      it("should be able to dispute on all outcomes", async () => {
        await disputeOnAllOutcomes(
          categoricalMarket.id,
          outcomes[categoricalMarket.id],
          false
        );
      });
    });

    describe("Scalar Market", () => {
      beforeAll(async () => {
        scalarMarket = await createScalarMarket();
        await waitNextBlock(15);
        await flash.initialReport(scalarMarket.id, "0", false, false);
        await flash.pushWeeks(1);
        await waitNextBlock(15);
        outcomes = await page.evaluate(() =>
          window.integrationHelpers.getMarketDisputeOutcomes()
        );
      });
      it("should be able to dispute on all outcomes", async () => {
        await disputeOnAllOutcomes(
          scalarMarket.id,
          outcomes[scalarMarket.id],
          true
        );
      });
    });
  });

  describe("Dispute Window", () => {
    let daysLeft: number;
    let reportingWindowStats;

    it("should have days remaining be correct", async () => {
      await toDisputing();
      reportingWindowStats = await page.evaluate(() =>
        window.integrationHelpers.getReportingWindowStats()
      );
      let currentTimestamp = await page.evaluate(() =>
        window.integrationHelpers.getCurrentTimestamp()
      );
      currentTimestamp = currentTimestamp / 1000;
      daysLeft = await page.evaluate(
        (endTime, startTime) =>
          window.integrationHelpers.getDaysRemaining(endTime, startTime),
        reportingWindowStats.endTime,
        currentTimestamp
      );
      const denomination = daysLeft === 1 ? " day" : " days";

      if (daysLeft === 0) {
        const hoursLeft = await page.evaluate(
          (endTime, startTime) =>
            window.integrationHelpers.getHoursRemaining(endTime, startTime),
          reportingWindowStats.endTime,
          currentTimestamp
        );
        denomination = hoursLeft === 1 ? " hour" : " hours";
        // check that days left is expected number
        await expect(page).toMatchElement("[data-testid='daysLeft']", {
          text: hoursLeft + denomination + " left",
          timeout: SMALL_TIMEOUT
        });
      } else {
        // check that days left is expected number
        await expect(page).toMatchElement("[data-testid='daysLeft']", {
          text: daysLeft + denomination + " left",
          timeout: SMALL_TIMEOUT
        });
      }
    });

    it("should have days remaining increment properly", async () => {
      // push time
      await flash.pushDays(1);
      const daysLeftIncr = daysLeft === 0 ? 6 : daysLeft - 1;
      const denomination = daysLeftIncr === 1 ? " day" : " days";

      if (daysLeftIncr === 0) {
        let currentTimestamp = await page.evaluate(() =>
          window.integrationHelpers.getCurrentTimestamp()
        );
        currentTimestamp = currentTimestamp / 1000;
        daysLeftIncr = await page.evaluate(
          (endTime, startTime) =>
            window.integrationHelpers.getHoursRemaining(endTime, startTime),
          reportingWindowStats.endTime,
          currentTimestamp
        );
        denomination = daysLeftIncr === 1 ? " hour" : " hours";
      } else if (daysLeftIncr === 6) {
        daysLeftIncr = 0;
        denomination = " hours";
      }

      // check that days left is previous calculation - time pushed
      await expect(page).toMatchElement("[data-testid='daysLeft']", {
        text: daysLeftIncr + denomination + " left",
        timeout: SMALL_TIMEOUT
      });
    });

    it("should have correct end date", async () => {
      // get new stats because endTime could be different because of time push
      reportingWindowStats = await page.evaluate(() =>
        window.integrationHelpers.getReportingWindowStats()
      );
      const formattedDate = await page.evaluate(
        date => window.integrationHelpers.convertUnixToFormattedDate(date),
        reportingWindowStats.endTime
      );

      // check that dispute window ends is displayed correctly
      await expect(page).toMatchElement("[data-testid='endTime']", {
        text: "Dispute Window ends " + formattedDate.formattedLocal,
        timeout: BIG_TIMEOUT
      });
    });

    it("should update correctly when time is pushed and a new dispute window starts", async () => {
      // push into new dispute window
      await flash.pushDays(7);

      // get new stats
      reportingWindowStats = await page.evaluate(() =>
        window.integrationHelpers.getReportingWindowStats()
      );
      const formattedDate = await page.evaluate(
        date => window.integrationHelpers.convertUnixToFormattedDate(date),
        reportingWindowStats.endTime
      );

      // check that dispute window ends is displayed correctly
      await expect(page).toMatchElement("[data-testid='endTime']", {
        text: "Dispute Window ends " + formattedDate.formattedLocal,
        timeout: BIG_TIMEOUT
      });
    });

    it("should create a new dispute window properly even when no markets were reported on or disputed in the previous dispute window", async () => {});
  });

  describe("Market Card", () => {
    let market: IMarket;

    describe("Dispute Bonds", () => {
      it("should have all of the dispute bonds on a market be equal to one another in the first dispute round", async () => {
        // create new yes/no market
        market = await createYesNoMarket();
        await waitNextBlock(10);

        // put yes/no market into disputing
        await flash.initialReport(market.id, "0", false, false);
        await waitNextBlock(2);

        // check that dispute bonds for outcomes yes and market is invalid are expected
        // TODO: make .6994 not hard coded, and make this reusable for different market types -- use outcomes selector
        await expect(page).toMatchElement(
          "[data-testid='disputeBondTarget-" + market.id + "-1']",
          {
            text: "0.6994 REP",
            timeout: BIG_TIMEOUT
          }
        );

        await expect(page).toMatchElement(
          "[data-testid='disputeBondTarget-" + market.id + "-0.5']",
          {
            text: "0.6994 REP",
            timeout: BIG_TIMEOUT
          }
        );
      });

      it("should have dispute bonds be equal to twice the amount placed by the initial reporter in the first dispute round", async () => {
        // TODO:
        // With markets reported on by the Designated Reporter, this is twice the stake placed by the Designated Reporter.
        // With markets reported on in Open Reporting, this is twice the no-show bond.
        // Test both.
      });
    });

    describe("Round Numbers", () => {
      it("should have round number be 1 while a market is waiting for its first Dispute window and while in its first round number", async () => {
        await expect(page).toMatchElement(
          "[data-testid='roundNumber-" + market.id + "']",
          {
            text: "1",
            timeout: SMALL_TIMEOUT
          }
        );
      });

      it("should have round number increase if a dispute is successful and a market is waiting for or is in its next dispute window", async () => {
        await flash.disputeContribute(market.id, "1", false, false);
        await expect(page).toMatchElement(
          "[data-testid='roundNumber-" + market.id + "']",
          {
            text: "2",
            timeout: SMALL_TIMEOUT
          }
        );
      });
    });

    describe("Listed Outcomes", () => {
      describe("Yes/No Market", () => {
        let yesNoMarket: IMarket;

        it("should have the market's reported-on outcome display correctly on the market card", async () => {
          yesNoMarket = await createYesNoMarket();
          await waitNextBlock(10);
          await flash.initialReport(yesNoMarket.id, "0", false, false);
          await flash.pushWeeks(1);
          await waitNextBlock(2);
          // expect not to have a dispute bond for winning outcome
          await expect(page).not.toMatchElement(
            "[data-testid='disputeBondTarget-" + yesNoMarket.id + "-0']"
          );
        });
        it("should have 'Yes', 'No', and 'Market is Invalid' outcomes be present", async () => {
          await expect(page).toMatch("Yes");
          await expect(page).toMatch("Invalid");
          await expect(page).toMatch("No");
        });
      });
      describe("Categorical Market", () => {
        it("should have the market's reported-on outcome display correctly on the market card", async () => {
          const categoricalMarket = await createCategoricalMarket(4);
          await waitNextBlock(10);
          await flash.initialReport(categoricalMarket.id, "0", false, false);
          await flash.pushWeeks(1);
          await waitNextBlock(2);
          // expect not to have a dispute bond for winning outcome
          await expect(page).not.toMatchElement(
            "[data-testid='disputeBondTarget-" + categoricalMarket.id + "-0']"
          );
        });
      });
      describe("Scalar Market", () => {
        it("should have the market's reported-on outcome display correctly on the market card", async () => {
          const scalarMarket = await createScalarMarket();
          await waitNextBlock(10);
          await flash.initialReport(scalarMarket.id, "1", false, false);
          await waitNextBlock(2);
          await flash.pushWeeks(1);

          await expect(page).toMatch("Invalid", { timeout: SMALL_TIMEOUT });
          // expect not to have a dispute bond for winning outcome
          await expect(page).toMatchElement(
            "[data-testid='winning-" + scalarMarket.id + "-1']"
          );
        });

        it("should have no other outcomes listed when the tentative winning outcome is 'Market is Invalid'", async () => {
          const scalarMarket = await createScalarMarket();
          await waitNextBlock(10);
          await flash.initialReport(scalarMarket.id, "0", true, false);
          await waitNextBlock(2);
          await flash.pushWeeks(1);

          await expect(page).toMatch("Invalid", { timeout: SMALL_TIMEOUT });
          // expect not to have a dispute bond for winning outcome
          await expect(page).not.toMatchElement(
            "[data-testid='disputeBondTarget-" + scalarMarket.id + "-0']"
          );
        });
      });
    });
  });
});
