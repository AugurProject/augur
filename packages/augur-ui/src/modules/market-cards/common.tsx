import React, { Component } from 'react';
import classNames from 'classnames';

import { 
  CATEGORICAL,
  SCALAR,
  YES_NO
} from 'modules/common/constants';
import { createBigNumber } from 'utils/create-big-number';

import Styles from 'modules/market-cards/common.styles';

export interface PercentProps {
  percent: number;
}

export const Percent = (props: PercentProps) => (
  <div className={Styles.Percent}>
  	<span style={{width: props.percent + "%"}}></span>
  </div>
);

export interface OutcomeProps {
  name: string;
  percent?: number;
  invalid?: Boolean;
  index: number;
}

export const Outcome = (props: OutcomeProps) => (
  <div className={classNames(Styles.Outcome, {[Styles.invalid]: props.invalid, [Styles[`Outcome-${props.index}`]]: !props.invalid})}>
  	<div>
    	<span>{props.name}</span>
    	<span>{props.percent}%</span>
    </div>
    <Percent percent={props.percent} />
  </div>
);

export interface ScalarOutcomeProps {
  scalarDenomination: string;
  min: number;
  max: number;
  percent?: number;
}

function calculatePosition(min, max, percent) {
	const range = createBigNumber(max).minus(createBigNumber(min));
	const pricePercentage = createBigNumber(percent || 0)
	  .minus(min)
	  .dividedBy(range)
	  .times(createBigNumber(100)).toNumber();

	return percent === null
	  ? 50
	  : pricePercentage
}

export const ScalarOutcome = (props: ScalarOutcomeProps) => (
  <div className={Styles.ScalarOutcome}>
  	<div>
  		<span style={{left: calculatePosition(props.min, props.max, props.percent) + '%'}}>{props.percent ? props.percent : "-"}</span>
  	</div>
  	<div>
	  	{props.min}
	  	<span>{props.scalarDenomination}</span>
	  	{props.max}
  	</div>
  </div>
);

interface Outcome {
  name: string;
  percent: number;
  invalid?: Boolean;
}

export interface OutcomeGroupProps {
	outcomes: Array<Outcome>;
	expanded?: Boolean;
	marketType: string;
	scalarDenomination?: string;
	min?: number;
	max?: number;
  	percent?: number;
}

export const OutcomeGroup = (props: OutcomeGroupProps) => (
  	<div className={classNames(Styles.OutcomeGroup, {
			[Styles.Categorical]: props.marketType === CATEGORICAL, 
			[Styles.Scalar]: props.marketType === SCALAR, 
			[Styles.YesNo]: props.marketType === YES_NO
		})}>
  		{props.marketType === SCALAR &&
  			<ScalarOutcome
  				min={props.min}
  				max={props.max}
  				percent={props.percent}
  				scalarDenomination={props.scalarDenomination}
  			/>
  		}
	  	{props.outcomes.map((outcome: Outcome, index: number) =>
	  		(!props.expanded && index < 2 || props.expanded) && <Outcome
	  			name={outcome.name}
	  			percent={outcome.percent}
	  			invalid={outcome.invalid}
	  			index={index > 2 ? index : index + 1}
	  		/> 
	  	)}
  	</div>
);