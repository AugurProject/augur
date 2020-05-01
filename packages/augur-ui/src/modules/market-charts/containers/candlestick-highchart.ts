import { connect } from "react-redux";

import CandlestickHighchart from "modules/market-charts/components/candlestick/candlestick-highchart";
import { AppStatusState } from "modules/app/store/app-status";

const mapStateToProps = (state, ownProps) => ({
  currentTimeInSeconds: AppStatusState.get().blockchain.currentAugurTimestamp,
});

export default connect(mapStateToProps)(
  CandlestickHighchart,
);
