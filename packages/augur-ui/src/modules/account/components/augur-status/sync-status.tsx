import React, { ReactNode } from "react";
import classNames from "classnames";

import {
  Syncing as SyncingIcon,
  ImmediateImportance
} from "modules/common-elements/icons";
import * as constants from "modules/common-elements/constants";

import Styles from "modules/account/components/augur-status/sync-status.styles";

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
      {constants.SYNCED}
    </div>
  );

  const Syncing = (
    <div>
      <span>{SyncingIcon}</span>
      {constants.SYNCING}
    </div>
  );

  const BlocksBehind = (
    <div>
      <span>{ImmediateImportance}</span>
      {constants.SYNCING} <span>{constants.MANY_BLOCKS_BEHIND}</span>
    </div>
  );

  let data: dataProps;

  if (props.syncPercent >= 99.99) {
    data = {
      message: constants.SYNC_MESSAGE_SYNCED,
      status: Synced
    };
  } else if (props.syncPercent >= 99.9) {
    data = {
      message: constants.SYNC_MESSAGE_SYNCING,
      status: Syncing
    };
  } else {
    data = {
      message: constants.SYNC_MESSAGE_BLOCKSBEHIND,
      status: BlocksBehind
    };
  }

  return (
    <div
      className={classNames(Styles.SyncStatus, {
        [Styles.SyncStatus__green]: data.status === Synced,
        [Styles.SyncStatus__yellow]: data.status === Syncing,
        [Styles.SyncStatus__red]: data.status === BlocksBehind
      })}
    >
      <div>{constants.SYNCING_TITLE}</div>
      {data.status}
      <div>{props.syncPercent}%</div>
      <div>{data.message}</div>
    </div>
  );
};

export default SyncStatus;
