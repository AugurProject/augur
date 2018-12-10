import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import BlockInfoData from "modules/block-info/components/block-info-data/block-info-data";

const mapStateToProps = state => ({
  highestBlock: state.blockchain.highestBlock,
  lastProcessedBlock: state.blockchain.lastProcessedBlock,
  isLogged: state.authStatus.isLogged
});

export default withRouter(connect(mapStateToProps)(BlockInfoData));
