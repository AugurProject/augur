import React from 'react';

import { formatNumber } from 'utils/format-number';
import { SYNC_BENIND, SYNC_PROCESSED } from 'modules/common/constants';
import { LinearPropertyLabel } from 'modules/common/labels';

import Styles from 'modules/account/components/status.styles.less';

export interface BlockStatusProps {
  blocksBehind: string | number;
  lastProcessedBlockBn: number;
  highestBlockBn: number;
}

const BlockStatus = ({
  blocksBehind,
  lastProcessedBlockBn,
  highestBlockBn,
}: BlockStatusProps) => (
  <div className={Styles.BlockStatus}>
    <LinearPropertyLabel
      highlight
      label={SYNC_BENIND}
      value={String(blocksBehind)}
    />
    <LinearPropertyLabel
      highlight
      label={SYNC_PROCESSED}
      value={`${formatNumber(lastProcessedBlockBn).formatted} / 
        ${formatNumber(highestBlockBn).formatted}`}
    />
  </div>
);

export default BlockStatus;
