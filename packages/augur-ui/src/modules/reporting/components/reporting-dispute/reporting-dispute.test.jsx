import React from "react";

import { shallow } from "enzyme";
import ReportingDispute from "src/modules/reporting/components/reporting-dispute-markets/reporting-dispute-markets";

describe("report dispute component", () => {
  describe("props", () => {
    let props;

    beforeEach(() => {
      props = {
        doesUserHaveRep: false,
        location: {},
        markets: [],
        marketsCount: 0,
        navigateToAccountDepositHandler: jest.fn(() => {}),
        loadMarkets: jest.fn(() => {})
      };
    });

    describe("doesUserHaveRep", () => {
      let doesUserHaveRep;
      describe("when true", () => {
        beforeEach(() => {
          doesUserHaveRep = true;
        });

        test("should not render ReportDisputeNoRepState component", () => {
          const cmp = shallow(
            <ReportingDispute {...props} doesUserHaveRep={doesUserHaveRep} />
          );
          expect(cmp.find("ReportDisputeNoRepState")).toHaveLength(0);
        });
      });

      describe("when false", () => {
        beforeEach(() => {
          doesUserHaveRep = false;
        });

        test("should render ReportDisputeNoRepState component", () => {
          const cmp = shallow(
            <ReportingDispute {...props} doesUserHaveRep={doesUserHaveRep} />
          );
          expect(cmp.find("ReportDisputeNoRepState")).toHaveLength(1);
        });
      });
    });
  });
});
