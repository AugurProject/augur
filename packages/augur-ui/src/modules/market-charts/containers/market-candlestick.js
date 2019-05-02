import { connect } from "react-redux";

import { selectCurrentTimestampInSeconds } from "src/select-state";
import MarketOutcomeChartsCandlestickHighchart from "modules/market-charts/components/market-outcome-charts--candlestick/market-outcome-charts-candlestick-highchart";

const mapStateToProps = (state, ownProps) => ({
  currentTimeInSeconds: selectCurrentTimestampInSeconds(state)
});

export default connect(mapStateToProps)(
  MarketOutcomeChartsCandlestickHighchart
);
