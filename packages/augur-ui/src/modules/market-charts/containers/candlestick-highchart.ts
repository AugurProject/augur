import { connect } from "react-redux";

import { selectCurrentTimestampInSeconds } from "appStore/select-state";
import CandlestickHighchart from "modules/market-charts/components/candlestick/candlestick-highchart";

const mapStateToProps = (state, ownProps) => ({
  currentTimeInSeconds: selectCurrentTimestampInSeconds(state)
});

export default connect(mapStateToProps)(
  CandlestickHighchart,
);
