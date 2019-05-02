import { connect } from "react-redux";

import { selectBlockInfoData } from "modules/block-info/selectors/block-info-data";
import AugurStatus from "modules/account/components/augur-status/augur-status";

const mapStateToProps = (state: any) => ({
  syncingInfo: selectBlockInfoData(state)
});

export default connect(mapStateToProps)(AugurStatus);
