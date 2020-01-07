import React, { ReactNode } from "react";
import classNames from "classnames";

import BlockStatus from 'modules/account/components/block-status';
import {
  Syncing as SyncingIcon,
} from "modules/common/icons";
import {
  SYNCED,
  SYNCING,
  SYNC_MESSAGE_SYNCED,
  SYNC_MESSAGE_SYNCING,
  SYNC_MESSAGE_BLOCKSBEHIND,
  SYNCING_TITLE,
} from "modules/common/constants";
import { formatPercent } from 'utils/format-number';
import Styles from "modules/account/components/status.styles.less";

export interface DataProps {
  status: ReactNode;
  message: string;
}

export interface SyncStatusProps {
  percent: number;
  blocksBehind: number;
  highestBlockBn: number;
  lastProcessedBlockBn: number;
}

const Synced = (
  <span>
    <span />
    {SYNCED}
  </span>
);

const Syncing = (
  <span>
    <span>{SyncingIcon}</span>
    {SYNCING}
  </span>
);

const SyncStatus = ({
  percent,
  blocksBehind,
  highestBlockBn,
  lastProcessedBlockBn
}: SyncStatusProps) => {
  
  let message = SYNC_MESSAGE_BLOCKSBEHIND;
  let status = Syncing;
  let style = null;

  if (percent >= 99.99) {
    message = SYNC_MESSAGE_SYNCED;
    status = Synced;
    style = Styles.synced;
  } else if (percent >= 99.9) {
    message = SYNC_MESSAGE_SYNCING;
    style = Styles.syncing;
  }

  return (
    <div
      className={classNames(Styles.SyncStatus, style)}
    >
      <h4>{SYNCING_TITLE}</h4>
      {status}
      <h5>{formatPercent(percent).full}</h5>
      <div>{message}</div>
      <BlockStatus
        blocksBehind={blocksBehind}
        highestBlockBn={highestBlockBn}
        lastProcessedBlockBn={lastProcessedBlockBn}
      />
    </div>
  );
};

export default SyncStatus;
