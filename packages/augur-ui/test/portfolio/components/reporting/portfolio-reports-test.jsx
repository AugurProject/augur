/**
 * @todo Add unit tests for when user does have claimable fees.
 */
import React from "react";

import { shallow } from "enzyme";

import PortfolioReports from "src/modules/portfolio/components/portfolio-reports/portfolio-reports";

describe("portfolio-reports", () => {
  let Cmp;
  let getReportingFees;

  describe("When the user has no claimable fees", () => {
    beforeAll(() => {
      getReportingFees = jest.fn();
      const isLogged = true;
      const reportingFees = {
        unclaimedEth: {
          value: 0,
          formattedValue: 0,
          formatted: "-",
          roundedValue: 0,
          rounded: "-",
          minimized: "-",
          denomination: "",
          full: "-"
        },
        unclaimedRep: {
          value: 0,
          formattedValue: 0,
          formatted: "-",
          roundedValue: 0,
          rounded: "-",
          minimized: "-",
          denomination: "",
          full: "-"
        }
      };

      const universe = {
        id: "0xcd8569bb29493f01cffc394e050d2533aa5ea824",
        reputationTokenAddress: "0x69c95d801ba3890c7090bdedeb7e5cc8f2058586",
        disputeRoundDurationInSeconds: "6309888",
        currentReportingPeriodPercentComplete: null,
        reportingCycleTimeRemaining: "Invalid date",
        isForking: false,
        forkingMarket: "0x0000000000000000000000000000000000000000"
      };
      Cmp = shallow(
        <PortfolioReports
          universe={universe}
          reporter="0x913da4198e6be1d5f5e4a40d0667f70c0b5430eb"
          getReportingFees={getReportingFees}
          isLogged={isLogged}
          reportingFees={reportingFees}
        />
      );
    });

    describe("and the Portfolio: Reporting page is loaded", () => {
      describe("getReportingFees function", () => {
        test("Called once with args ", () => {
          expect(getReportingFees).toBeTruthy();
        });
      });

      describe("ETH total", () => {
        test("Display as '-'", () => {
          expect(Cmp.html()).toEqual(
            expect.stringContaining("<span>ETH</span><span>-</span>")
          );
        });
      });

      describe("REP total", () => {
        it("should display as '-'", () => {
          expect(Cmp.html()).toEqual(
            expect.stringContaining("<span>REP</span><span>-</span>")
          );
        });
      });

      describe("claim-reporting-fees-nonforked-markets-button", () => {
        it("should be disabled", () => {
          const button = Cmp.find("button");
          expect(button.html()).toEqual(expect.stringContaining("disabled"));
        });
      });

      describe("claim-reporting-fees-forked-market-button", () => {
        it("should not exist", () => {
          expect(Cmp.html()).toEqual(
            expect.not.stringContaining(
              '<button class="market-portfolio-card-styles_MarketCard__action-footer-light">Claim</button>'
            )
          );
        });
      });
    });
  });
});
