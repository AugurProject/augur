import { connect } from "react-redux";
import { AppState } from "appStore";
import BlockInfoData from "modules/block-info/block-info-data";
import { selectBlockInfoData } from "modules/block-info/selectors/block-info-data";

const mapStateToProps = (state: AppState) => ({
  syncInfo: selectBlockInfoData(state),
  isLogged: state.authStatus.isLogged
});

export default connect(mapStateToProps)(BlockInfoData);
