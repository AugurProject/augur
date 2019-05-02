import { connect } from "react-redux";

import AccountOverviewChartCmp from "modules/account/components/account-overview-chart/account-overview-chart";
import getProfitLoss from "modules/positions/actions/get-profit-loss";

const mapStateToProps = state => {
  const { blockchain } = state;
  const { currentAugurTimestamp } = blockchain;

  return {
    universe: state.universe.id,
    currentAugurTimestamp
  };
};

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

const AccountOverviewChart = connect(
  mapStateToProps,
  mapDispatchToProps
)(AccountOverviewChartCmp);

export default AccountOverviewChart;
