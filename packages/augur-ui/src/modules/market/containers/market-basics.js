import { connect } from "react-redux";

import MarketBasics from "modules/market/components/market-basics/market-basics";

import { selectCurrentTimestamp } from "store/select-state";

const mapStateToProps = state => ({
  currentTimestamp: selectCurrentTimestamp(state),
  isMobile: state.appStatus.isMobile,
  isMobileSmall: state.appStatus.isMobileSmall
});

const MarketBasicsContainer = connect(mapStateToProps)(MarketBasics);

export default MarketBasicsContainer;
