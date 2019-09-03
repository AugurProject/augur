import { connect } from 'react-redux';
import { ReportingCard } from 'modules/reporting/common';
import { selectMarket } from "modules/markets/selectors/market";

const mapStateToProps = (state, ownProps) => {
  return {
    market: selectMarket(ownProps.marketId),
    currentAugurTimestamp: state.blockchain.currentAugurTimestamp,
    reportingWindowStatsEndTime: state.reportingWindowStats.endTime,
  };
};

const mapDispatchToProps = dispatch => ({});

const ReportingCardContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(ReportingCard);

export default ReportingCardContainer;
