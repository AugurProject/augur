import { connect } from "react-redux";

import OverviewChart from "modules/account/components/overview-chart";
import getProfitLoss from "modules/positions/actions/get-profit-loss";

const mapStateToProps = (state: any) => {
  const { blockchain } = state;
  const { currentAugurTimestamp } = blockchain;

  return {
    universe: state.universe.id,
    currentAugurTimestamp,
  };
};

const mapDispatchToProps = (dispatch: Function) => ({
  getProfitLoss: (
    universe: string,
    startTime: number,
    endTime: number,
    periodInterval: number,
    marketId: string,
    callback: Function,
  ) =>
    dispatch(
      getProfitLoss({
        universe,
        startTime,
        endTime,
        periodInterval,
        marketId,
        callback,
      }),
    ),
});

const OverviewChartContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(OverviewChart);

export default OverviewChartContainer;
