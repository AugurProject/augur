import { connect } from "react-redux";

import { selectBlockInfoData } from "modules/block-info/selectors/block-info-data";
import AugurStatus from "modules/account/components/augur-status";
import { AppState } from "store";

const mapStateToProps = (state: AppState) => ({
  syncingInfo: selectBlockInfoData(state)
});

export default connect(mapStateToProps)(AugurStatus);
