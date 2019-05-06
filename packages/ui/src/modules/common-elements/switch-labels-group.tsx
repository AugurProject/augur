import React from "react";
import classNames from "classnames";
import Styles from "modules/common-elements/switch-labels-group.styles";

import {
  MARKET_OPEN,
  MARKET_REPORTING,
  MARKET_CLOSED
} from "modules/common-elements/constants";

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
        className={classNames(Styles.SwitchLabelsGroup__label, {
          [`${Styles.active}`]: props.selectedTab === tab.key,
          [Styles.SwitchLabelsGroup_open]: tab.key === MARKET_OPEN,
          [Styles.SwitchLabelsGroup_resolved]: tab.key === MARKET_CLOSED,
          [Styles.SwitchLabelsGroup_reporting]: tab.key === MARKET_REPORTING
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
