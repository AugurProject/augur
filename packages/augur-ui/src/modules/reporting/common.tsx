import React, { Component } from 'react';
import classNames from 'classnames';
// import { calculatePosition } from "modules/market-cards/common";

import Styles from 'modules/reporting/common.styles.less';
import { ButtonActionType } from 'modules/types';

export interface ReportingPercentProps {
  firstPercent: number;
  secondPercent: number;
  thirdPercent: number;
}

export const ReportingPercent = (props: ReportingPercentProps) => (
  <div className={Styles.ReportingPercent}>
  	<span style={{width: props.firstPercent + "%"}}></span>
  	<span style={{width: props.secondPercent + "%"}}></span>
  	<span style={{width: props.thirdPercent + "%"}}></span>
  </div>
);

export interface ReportingModalButtonProps {
  labelText: string;
  action: ButtonActionType;
}

export const ReportingModalButton = (props: ReportingModalButtonProps) => (
  <button className={Styles.ReportingModalButton} onClick={e => props.action(e)}>{props.labelText}</button>
);
