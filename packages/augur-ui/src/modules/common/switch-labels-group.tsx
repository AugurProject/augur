import React from "react";
import classNames from "classnames";
import Styles from "modules/common/switch-labels-group.styles";

import {
  MARKET_OPEN,
  MARKET_REPORTING,
  MARKET_CLOSED
} from "modules/common/constants";

export interface KeyValuePair {
  key: string;
  label: string;
  num: number;
}

export interface SwitchLabelsGroupProps {
  tabs: Array<KeyValuePair>;
  selectedTab: string;
  selectTab: Function;
}

export const SwitchLabelsGroup = (props: SwitchLabelsGroupProps) => (
  <div className={Styles.SwitchLabelsGroup}>
    {props.tabs.map(tab => (
      <button
        key={"tab-" + tab.key}
        className={classNames(Styles.Label, {
          [`${Styles.active}`]: props.selectedTab === tab.key,
          [Styles.Open]: tab.key === MARKET_OPEN,
          [Styles.Resolved]: tab.key === MARKET_CLOSED,
          [Styles.Reporting]: tab.key === MARKET_REPORTING
        })}
        onClick={() => {
          props.selectTab(tab.key);
        }}
      >
        <span>
          {tab.label} <span>({tab.num})</span>
        </span>
      </button>
    ))}
  </div>
);
