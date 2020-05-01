import { connect } from "react-redux";
import memoize from "memoizee";
import Positions from "modules/portfolio/components/positions/positions";
import getLoginAccountPositions from "modules/positions/selectors/login-account-positions";
import { MODAL_CLAIM_MARKETS_PROCEEDS } from "modules/common/constants";
import getMarketsPositionsRecentlyTraded from "modules/portfolio/selectors/select-markets-positions-recently-traded";
import { AppStatusActions } from "modules/app/store/app-status";

const mapStateToProps = (state) => {
  const positions = getLoginAccountPositions();
  const timestamps = getMarketsPositionsRecentlyTraded();
  const markets = getPositionsMarkets(timestamps, positions);

  return {
    markets,
  };
};

const mapDispatchToProps = (dispatch) => ({
  claimTradingProceeds: (marketId) =>
    AppStatusActions.actions.setModal({ type: MODAL_CLAIM_MARKETS_PROCEEDS, marketId }),
});

const getPositionsMarkets = memoize(
  (marketsPositionsRecentlyTraded, positions) =>
    Array.from(new Set([...positions.markets])).map((m) => ({
      ...m,
      recentlyTraded: marketsPositionsRecentlyTraded[m.id],
    })),
  { max: 1 },
);

const PositionsContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(Positions);

export default PositionsContainer;
