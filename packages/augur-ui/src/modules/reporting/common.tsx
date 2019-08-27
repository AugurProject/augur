import React, { Component } from 'react';
import classNames from 'classnames';
import { calculatePosition } from "modules/market-cards/common";
import { createBigNumber } from 'utils/create-big-number';
import { ZERO } from "modules/common/constants";
import { FormattedNumber } from "modules/types";
import ReactTooltip from 'react-tooltip';

import TooltipStyles from 'modules/common/tooltip.styles.less';
import Styles from 'modules/reporting/common.styles.less';

export interface ReportingPercentProps {
  firstPercent: FormattedNumber;
  secondPercent: FormattedNumber;
  thirdPercent: FormattedNumber;
  total: BigNumber;
}

export const ReportingPercent = (props: ReportingPercentProps) => {
	const firstPercent = calculatePosition(ZERO, props.total, props.firstPercent);
	const secondPercent = calculatePosition(ZERO, props.total, props.secondPercent);
	const thirdPercent = calculatePosition(ZERO, props.total, props.thirdPercent);

	return (
	  <div className={Styles.ReportingPercent}>
	  	<span style={{width: firstPercent + "%"}}/>
	  	<span 
	  		style={{width: secondPercent + "%", left: firstPercent + 'px'}}   
	  		data-tip
          	data-for='tooltip--existingStake'
        />
        <ReactTooltip
          id='tooltip--existingStake'
          className={TooltipStyles.Tooltip}
          effect='solid'
          place='top'
          type='light'
        >
         	My Existing Stake
          	<p>{props.firstPercent.formattedValue} REP</p>
        </ReactTooltip>
	  	<span style={{width: thirdPercent + "%", left: firstPercent + thirdPercent + 'px'}}/>
	  </div>
	);
}