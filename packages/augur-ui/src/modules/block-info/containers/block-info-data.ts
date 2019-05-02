import { connect } from "react-redux";

import BlockInfoData from "modules/block-info/components/block-info-data/block-info-data";
import { selectBlockInfoData } from "modules/block-info/selectors/block-info-data";

const mapStateToProps = (state: any) => ({
  syncInfo: selectBlockInfoData(state),
  isLogged: state.authStatus.isLogged
});

export default connect(mapStateToProps)(BlockInfoData);
