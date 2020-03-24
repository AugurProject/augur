import { connect } from "react-redux";

import { selectBlockInfoData } from "modules/block-info/selectors/block-info-data";
import { ZERO } from 'modules/common/constants';
import SyncStatus from "modules/account/components/sync-status";
import { AppState } from "appStore";

const mapStateToProps = (state: AppState) => {
  const {
    percent = 0,
    blocksBehind = '0',
    highestBlockBn = ZERO,
    lastProcessedBlockBn = ZERO,
  } = selectBlockInfoData(state);
  return {
    percent,
    blocksBehind,
    highestBlockBn,
    lastProcessedBlockBn,
  };
};

export default connect(mapStateToProps)(SyncStatus);
