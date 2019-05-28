import React, { ReactNode } from "react";
import classNames from "classnames";

import {
  Syncing as SyncingIcon,
  ImmediateImportance
} from "modules/common-elements/icons";
import {
  SYNCED,
  SYNCING,
  MANY_BLOCKS_BEHIND,
  SYNC_MESSAGE_SYNCED,
  SYNC_MESSAGE_SYNCING,
  SYNC_MESSAGE_BLOCKSBEHIND,
  SYNCING_TITLE
} from "modules/common-elements/constants";

import Styles from "modules/account/components/status.styles";

export interface dataProps {
  status: ReactNode;
  message: string;
}

export interface SyncStatusProps {
  syncPercent: number;
}

const SyncStatus = (props: SyncStatusProps) => {
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

  let data: dataProps = {
    message: SYNC_MESSAGE_BLOCKSBEHIND,
    status: BlocksBehind
  };

  const { syncPercent } = props;

  if (syncPercent >= 99.99) {
    data = {
      message: SYNC_MESSAGE_SYNCED,
      status: Synced
    };
  } else if (syncPercent >= 99.9) {
    data = {
      message: SYNC_MESSAGE_SYNCING,
      status: Syncing
    };
  }

  const { message, status } = data;

  return (
    <div
      className={classNames(Styles.SyncStatus, {
        [Styles.green]: status === Synced,
        [Styles.yellow]: status === Syncing,
        [Styles.red]: status === BlocksBehind
      })}
    >
      <div>{SYNCING_TITLE}</div>
      {status}
      <div>{syncPercent}%</div>
      <div>{message}</div>
    </div>
  );
};

export default SyncStatus;
