import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import OpenMarkets from "modules/account/components/open-markets";
import { pick } from "lodash";
import { CLOSED, MARKET_CLOSED } from "modules/common-elements/constants";
import getLoginAccountPositions from "modules/positions/selectors/login-account-positions";
import getSelectLoginAccountTotals from "modules/positions/selectors/login-account-totals";
import memoize from "memoizee";
import getMarketsPositionsRecentlyTraded from "modules/portfolio/selectors/select-markets-positions-recently-traded";

const mapStateToProps = (state: any) => {
  const positions = getLoginAccountPositions();
  const totalPercentage = getSelectLoginAccountTotals();
  const timestamps = getMarketsPositionsRecentlyTraded(state);

  const markets = getPositionsMarkets(timestamps, positions).sort(
    (a: any, b: any) => b.recentlyTraded.timestamp - a.recentlyTraded.timestamp
  );

  const marketsObj = markets.reduce((obj: any, market: any) => {
    obj[market.id] = market;
    return obj;
  }, {});

  const marketsPick = markets.map((
    market: any // when these things change then component will re-render/re-sort
  ) => pick(market, ["id", "description", "reportingState", "recentlyTraded"]));

  return {
    isLogged: state.authStatus.isLogged,
    markets: marketsPick,
    marketsObj,
    totalPercentage
  };
};

const OpenMarketsContainer = withRouter(connect(mapStateToProps)(OpenMarkets));

const getPositionsMarkets = memoize(
  (marketsPositionsRecentlyTraded: any, positions: any) =>
    positions.markets.reduce((p, m) => {
      if (m.marketStatus === MARKET_CLOSED) return p;
      const pos = m.userPositions.filter((position: any) => position.type !== CLOSED);
      return pos.length === 0
        ? p
        : [
            ...p,
            {
              ...m,
              userPositions: pos,
              recentlyTraded: marketsPositionsRecentlyTraded[m.id]
            }
          ];
    }, []),
  { max: 1 }
);

export default OpenMarketsContainer;
