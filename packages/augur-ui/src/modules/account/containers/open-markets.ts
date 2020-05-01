import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { AppState } from "appStore";
import OpenMarkets from "modules/account/components/open-markets";
import { CLOSED, MARKET_CLOSED, CLOSED_LONG, CLOSED_SHORT } from "modules/common/constants";
import getLoginAccountPositions from "modules/positions/selectors/login-account-positions";
import getSelectLoginAccountTotals from "modules/positions/selectors/login-account-totals";
import memoize from "memoizee";
import getMarketsPositionsRecentlyTraded from "modules/portfolio/selectors/select-markets-positions-recently-traded";
import { formatPercent } from 'utils/format-number';
import { DateFormattedObject } from "modules/types";

interface MarketTimestamps {
  [marketId: string]: DateFormattedObject;
}
const mapStateToProps = (state: AppState) => {
  const positions = getLoginAccountPositions();
  const totalPercentage = getSelectLoginAccountTotals();
  const timestamps: MarketTimestamps = getMarketsPositionsRecentlyTraded();

  const markets = getPositionsMarkets(timestamps, positions).sort(
    (a: any, b: any) => b.recentlyTraded.timestamp - a.recentlyTraded.timestamp
  );

  const marketsObj = markets.reduce((obj: any, market: any) => {
    if (market) obj[market.id] = market;
    return obj;
  }, {});

  const marketsPick = markets.map((
    { id, description, reportingState, recentlyTraded }: any // when these things change then component will re-render/re-sort
  ) => ({
    id,
    description,
    reportingState,
    recentlyTraded
  }));

  return {
    isLogged: state.authStatus.isLogged,
    markets: marketsPick,
    marketsObj,
    totalPercentage: formatPercent(totalPercentage),
  };
};

const OpenMarketsContainer = withRouter(connect(mapStateToProps)(OpenMarkets));

const getPositionsMarkets = memoize(
  (marketsPositionsRecentlyTraded: MarketTimestamps, positions: any) =>
    positions.markets.reduce((p, m) => {
      if (m.marketStatus === MARKET_CLOSED) return p;
      const pos = m.userPositions.filter(
        (position: any) =>
          position.type !== CLOSED &&
          position.type !== CLOSED_LONG &&
          position.type !== CLOSED_SHORT
      );
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
