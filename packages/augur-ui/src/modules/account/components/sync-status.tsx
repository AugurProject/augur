import React, { ReactNode } from "react";
import classNames from "classnames";

import BlockStatus from 'modules/account/components/block-status';
import {
  Syncing as SyncingIcon,
  ImmediateImportance,
} from "modules/common/icons";
import {
  SYNCED,
  SYNCING,
  MANY_BLOCKS_BEHIND,
  SYNC_MESSAGE_SYNCED,
  SYNC_MESSAGE_SYNCING,
  SYNC_MESSAGE_BLOCKSBEHIND,
  SYNCING_TITLE,
} from "modules/common/constants";

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
  <div>
    <span />
    {SYNCED}
  </div>
);

const Syncing = (
  <div>
    <span>{SyncingIcon}</span>
    {SYNCING}
  </div>
);

const BlocksBehind = (
  <div>
    <span>{ImmediateImportance}</span>
    {SYNCING} <span>{MANY_BLOCKS_BEHIND}</span>
  </div>
);

const SyncStatus = ({
  percent,
  blocksBehind,
  highestBlockBn,
  lastProcessedBlockBn
}: SyncStatusProps) => {
  
  let message = SYNC_MESSAGE_BLOCKSBEHIND;
  let status = BlocksBehind;

  if (percent >= 99.99) {
    message = SYNC_MESSAGE_SYNCED;
    status = Synced;
  } else if (percent >= 99.9) {
    message = SYNC_MESSAGE_SYNCING;
    status = Syncing;
  }

  return (
    <div
      className={classNames(Styles.SyncStatus, {
        [Styles.green]: status === Synced,
        [Styles.yellow]: status === Syncing,
        [Styles.red]: status === BlocksBehind,
      })}
    >
      <div>{SYNCING_TITLE}</div>
      {status}
      <div>{percent}%</div>
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
