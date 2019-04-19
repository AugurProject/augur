import { connect } from "react-redux";
import memoize from "memoizee";
import Positions from "modules/portfolio/components/positions/positions";
import getLoginAccountPositions from "modules/positions/selectors/login-account-positions";
import { updateModal } from "modules/modal/actions/update-modal";
import { MODAL_CLAIM_TRADING_PROCEEDS } from "modules/common-elements/constants";

const mapStateToProps = state => {
  const positions = getLoginAccountPositions();

  // NOTE: for data wiring, this should probably be just done as calls for getting openPosition Markets, getting Reporting Markets, and getting Closed Markets respectively from the node and just passed the expected keys below
  const markets = getPositionsMarkets(positions);

  return {
    markets
  };
};

const mapDispatchToProps = dispatch => ({
  claimTradingProceeds: marketId =>
    dispatch(updateModal({ type: MODAL_CLAIM_TRADING_PROCEEDS, marketId }))
});

const getPositionsMarkets = memoize(
  positions => Array.from(new Set([...positions.markets])),
  { max: 1 }
);

const PositionsContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Positions);

export default PositionsContainer;
