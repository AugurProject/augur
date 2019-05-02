import React from "react";

import BlockStatus from "modules/account/components/augur-status/block-status";
import SyncStatus from "modules/account/components/augur-status/sync-status";
import Activity from "modules/account/containers/activity";
import QuadBox from "modules/portfolio/components/common/quads/quad-box";
import * as constants from "modules/common-elements/constants";

import Styles from "modules/account/components/augur-status/augur-status.styles";

export interface SyncingInfo {
  percent: number;
  blocksBehind: number;
  highestBlockBn: number;
  lastProcessedBlockBn: number;
}

export interface AugurStatusProps {
  syncingInfo: SyncingInfo;
}

const AugurStatus = (props: AugurStatusProps) => {
  if (!props.syncingInfo) {
    return null;
  }

  const {
    percent,
    blocksBehind,
    highestBlockBn,
    lastProcessedBlockBn
  } = props.syncingInfo;

  return (
    <QuadBox
      title={constants.AUGUR_STATUS_TITLE}
      content={
        <div className={Styles.AugurStatusContent}>
          <SyncStatus syncPercent={percent} />
          <BlockStatus
            blocksBehind={blocksBehind}
            highestBlockBn={highestBlockBn}
            lastProcessedBlockBn={lastProcessedBlockBn}
          />
          <Activity />
        </div>
      }
    />
  );
};

export default AugurStatus;
