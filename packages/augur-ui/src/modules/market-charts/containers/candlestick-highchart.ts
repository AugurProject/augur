import { connect } from "react-redux";

import CandlestickHighchart from "modules/market-charts/components/candlestick/candlestick-highchart";
import { AppStatus } from "modules/app/store/app-status";

const mapStateToProps = (state, ownProps) => ({
  currentTimeInSeconds: AppStatus.get().blockchain.currentAugurTimestamp,
});

export default connect(mapStateToProps)(
  CandlestickHighchart,
);
