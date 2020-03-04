import React from "react";
import classNames from "classnames";
import Styles from "modules/common/switch-back-lay-group.styles";

import {
  BETTING_BACK,
  BETTING_LAY,
} from "modules/common/constants";

export interface KeyValuePair {
  key: string;
  label: string;
  num: number;
}

export interface SwitchBackLayGroupProps {
  type: BETTING_LAY | BETTING_BACK;
  selectTab: Function;
}

export const SwitchBackLayGroup = ({type, selectTab }: SwitchBackLayGroupProps) => (
  <div className={Styles.SwitchBackLayGroup}>
    <button
      className={classNames(Styles.Label, {
        [Styles.Selected]: type === BETTING_BACK
      })}
      onClick={() => {
        selectTab(type);
      }}
    >
      BACK
    </button>

    <button
      className={classNames(Styles.Label, {
        [Styles.Selected]: type === BETTING_LAY,
      })}
      onClick={() => {
        selectTab(type);
      }}
    >
      LAY
    </button>
  </div>
);
