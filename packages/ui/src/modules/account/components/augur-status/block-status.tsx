import React from "react";
import classNames from "classnames";

import { formatNumber } from "utils/format-number";
import * as constants from "modules/common-elements/constants";
import { LinearPropertyLabel } from "modules/common-elements/labels";

import Styles from "modules/account/components/augur-status/block-status.styles";

export interface BlockStatusProps {
  blocksBehind: number;
  lastProcessedBlockBn: number;
  highestBlockBn: number;
}

const BlockStatus = (props: BlockStatusProps) => {
  const { blocksBehind, lastProcessedBlockBn, highestBlockBn } = props;
  return (
    <>
      <div className={classNames(Styles.BlockStatus, Styles.HideOnMobile)}>
        <div>
          <div>{constants.SYNC_BENIND}</div>
          <div>{blocksBehind}</div>
        </div>

        <div>
          <div>{constants.SYNC_PROCESSED}</div>
          <div>
            {formatNumber(lastProcessedBlockBn.toString()).formatted} /{" "}
            {formatNumber(highestBlockBn.toString()).formatted}
          </div>
        </div>
      </div>
      <div className={Styles.ShowOnMobile}>
        <LinearPropertyLabel
          highlight
          label={constants.SYNC_BENIND}
          value={blocksBehind}
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
    </>
  );
};

export default BlockStatus;
