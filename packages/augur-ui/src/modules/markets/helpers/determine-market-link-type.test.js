import { constants } from "services/constants";
import {
  TYPE_VIEW,
  TYPE_REPORT,
  TYPE_DISPUTE,
  TYPE_TRADE
} from "modules/markets/constants/link-types";
import { determineMarketLinkType } from "modules/markets/helpers/determine-market-link-type";

describe(`modules/markets/helpers/determine-market-link-type.js`, () => {
  const account = { address: "userId" };

  test(`should be type_view result`, () => {
    expect(determineMarketLinkType({}, account)).toEqual(TYPE_VIEW);
  });

  test(`should be type_view result for reporting state`, () => {
    const market = {
      reportingState: constants.REPORTING_STATE.PRE_REPORTING
    };
    expect(determineMarketLinkType(market, {})).toEqual(TYPE_VIEW);
  });

  test(`should call the expected method`, () => {
    expect(determineMarketLinkType(null, account)).toEqual(TYPE_VIEW);
  });

  test(`should call the expected method`, () => {
    const market = {
      reportingState: constants.REPORTING_STATE.PRE_REPORTING
    };
    expect(determineMarketLinkType(market, account)).toEqual(TYPE_TRADE);
  });

  test(`should call the expected method`, () => {
    const market = {
      reportingState: constants.REPORTING_STATE.DESIGNATED_REPORTING,
      designatedReporter: account.address
    };
    expect(determineMarketLinkType(market, account)).toEqual(TYPE_REPORT);
  });

  test(`should call the expected method`, () => {
    const market = {
      reportingState: constants.REPORTING_STATE.DESIGNATED_REPORTING,
      designatedReporter: "snuggles"
    };
    expect(determineMarketLinkType(market, account)).toEqual(TYPE_VIEW);
  });

  test(`should call the expected method`, () => {
    const market = {
      reportingState: constants.REPORTING_STATE.OPEN_REPORTING
    };
    expect(determineMarketLinkType(market, account)).toEqual(TYPE_REPORT);
  });

  test(`should call the expected method`, () => {
    const market = {
      reportingState: constants.REPORTING_STATE.CROWDSOURCING_DISPUTE
    };
    expect(determineMarketLinkType(market, account)).toEqual(TYPE_DISPUTE);
  });
});
