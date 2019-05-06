import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { formatAttoRep } from "utils/format-number";
import getValue from "utils/get-value";
import OverviewStats from "modules/account/components/overview-stats/overview-stats";

const mapStateToProps = state => ({
  timeframeData: state.universe.timeframeData
});

const mapDispatchToProps = dispatch => ({});

const mergeProps = (sP, dP, oP) => {
  const properties = [
    {
      key: 0,
      label: "Active Users",
      value: getValue(sP.timeframeData, "activeUsers")
    },
    {
      key: 1,
      label: "Markets Created",
      value: getValue(sP.timeframeData, "marketsCreated")
    },
    {
      key: 2,
      label: "Trades",
      value: getValue(sP.timeframeData, "numberOfTrades")
    },
    {
      key: 3,
      label: "Markets in dispute",
      value: getValue(sP.timeframeData, "disputedMarkets")
    },
    {
      key: 4,
      label: "Volume",
      value: getValue(sP.timeframeData, "volume")
    },
    {
      key: 5,
      label: "REP in dispute",
      value: formatAttoRep(getValue(sP.timeframeData, "amountStaked"), {
        decimals: 4
      }).value
    }
  ];

  return {
    ...oP,
    ...sP,
    ...dP,
    properties
  };
};

const PlatformtOverviewStatsContainer = withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps
  )(OverviewStats)
);

export default PlatformtOverviewStatsContainer;
