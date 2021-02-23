import React from 'react';
import Styles from 'modules/common/toggle-switch.styles.less';
import classNames from 'classnames';

export const ToggleSwitch = ({toggle, setToggle}) => (
  <button className={classNames(Styles.ToggleSwitch, {
    [Styles.On]: toggle
  })} onClick={() => setToggle()}>
    <span>On</span>
    <span>Off</span>
    <div />
  </button>
)
