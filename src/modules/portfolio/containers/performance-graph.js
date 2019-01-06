import { connect } from "react-redux";

import PerformanceGraph from "modules/portfolio/components/performance-graph/performance-graph";
import getProfitLoss from "modules/positions/actions/get-profit-loss";
import { selectIsAnimating } from "src/select-state";

const mapStateToProps = state => ({
  universe: state.universe.id,
  currentAugurTimestamp: state.blockchain.currentAugurTimestamp,
  isAnimating: selectIsAnimating(state)
});

const mapDispatchToProps = dispatch => ({
  getProfitLoss: (
    universe,
    startTime,
    endTime,
    periodInterval,
    marketId,
    callback
  ) =>
    dispatch(
      getProfitLoss({
        universe,
        startTime,
        endTime,
        periodInterval,
        marketId,
        callback
      })
    )
});

const PerformanceGraphContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(PerformanceGraph);

export default PerformanceGraphContainer;
