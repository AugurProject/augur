import React from "react";
import classNames from "classnames";

import { formatNumber } from "utils/format-number";
import * as constants from "modules/common/constants";
import { LinearPropertyLabel } from "modules/common/labels";

import Styles from "modules/account/components/status.styles.less";

export interface BlockStatusProps {
  blocksBehind: number;
  lastProcessedBlockBn: number;
  highestBlockBn: number;
}

const BlockStatus = (props: BlockStatusProps) => {
  const { blocksBehind, lastProcessedBlockBn, highestBlockBn } = props;
  return (
    <div className={Styles.BlockStatus}>
      <LinearPropertyLabel
        highlight
        label={constants.SYNC_BENIND}
        value={String(blocksBehind)}
      />
      <LinearPropertyLabel
        highlight
        label={constants.SYNC_PROCESSED}
        value={
          formatNumber(lastProcessedBlockBn.toString()).formatted +
          "/" +
          formatNumber(highestBlockBn.toString()).formatted
        }
      />
    </div>
  );
};

export default BlockStatus;
