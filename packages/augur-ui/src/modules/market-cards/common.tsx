import React, { Component } from 'react';
import classNames from 'classnames';

import { 
  CATEGORICAL,
  SCALAR,
  YES_NO
} from 'modules/common/constants';
import { createBigNumber } from 'utils/create-big-number';
import ReactTooltip from "react-tooltip";
import TooltipStyles from "modules/common/tooltip.styles.less";
import { CheckCircleIcon } from "modules/common/icons";
import { OutcomeFormatted } from "modules/types";

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
  description: string;
  lastPricePercent?: number;
  invalid?: Boolean;
  index: number;
}

export const Outcome = (props: OutcomeProps) => (
  <div className={classNames(Styles.Outcome, {[Styles.invalid]: props.invalid, [Styles[`Outcome-${props.index}`]]: !props.invalid})}>
  	<div>
    	<span>{props.description}</span>
    	<span>{props.lastPricePercent.formatted}%</span>
    </div>
    <Percent percent={props.lastPricePercent.value} />
  </div>
);

export interface ScalarOutcomeProps {
  scalarDenomination: string;
  min: number;
  max: number;
  lastPrice?: number;
}

function calculatePosition(min, max, lastPrice) {
	const range = createBigNumber(max).minus(createBigNumber(min));
	const pricePercentage = createBigNumber(lastPrice || 0)
	  .minus(min)
	  .dividedBy(range)
	  .times(createBigNumber(100)).toNumber();

	return lastPrice === null
	  ? 50
	  : pricePercentage
}

export const ScalarOutcome = (props: ScalarOutcomeProps) => (
  <div className={Styles.ScalarOutcome}>
  	<div>
  		{ props.lastPrice !== null &&
  			<span style={{left: calculatePosition(props.min, props.max, props.lastPrice) + '%'}}>{props.lastPrice}</span>
  		}
  	</div>
  	<div>
	  	{props.min}
	  	<span>{props.scalarDenomination}</span>
	  	{props.max}
  	</div>
  </div>
);

export interface OutcomeGroupProps {
	outcomes: Array<OutcomeFormatted>;
	expanded?: Boolean;
	marketType: string;
	scalarDenomination?: string;
	min?: number;
	max?: number;
  lastPrice?: number;
}

export const OutcomeGroup = (props: OutcomeGroupProps) => {
  let outcomesShow = props.outcomes.filter(outcome => outcome.isTradable);
  const removedInvalid = outcomesShow.splice(0, 1)[0];
  outcomesShow.splice(2, 0, removedInvalid);

  return (
    <div className={classNames(Styles.OutcomeGroup, {
			[Styles.Categorical]: props.marketType === CATEGORICAL, 
			[Styles.Scalar]: props.marketType === SCALAR, 
			[Styles.YesNo]: props.marketType === YES_NO
		})}>
  		{props.marketType === SCALAR &&
        <>
    			<ScalarOutcome
    				min={props.min}
    				max={props.max}
    				lastPrice={props.lastPricePercent}
    				scalarDenomination={props.scalarDenomination}
    			/>
          <Outcome
            description={removedInvalid.description}
            lastPricePercent={removedInvalid.lastPricePercent}
            invalid={true}
            index={0}
          /> 
        </>
  		}
	  	{props.marketType !== SCALAR && outcomesShow.map((outcome: Outcome, index: number) =>
	  		(!props.expanded && index < 3 || (props.expanded || props.marketType === YES_NO)) && <Outcome
          key={outcome.id}
	  			description={outcome.description}
	  			lastPricePercent={outcome.lastPricePercent}
	  			invalid={outcome.id === 0}
	  			index={index > 2 ? index : index + 1}
	  		/> 
	  	)}
  	</div>
  );
}

export interface LabelValueProps {
  label: string;
  value: number;
  condensed?: Boolean;
}

export const LabelValue = (props: LabelValueProps) => (
  <div className={classNames(Styles.LabelValue, {[Styles.Condensed]: props.condensed})}>
    <span>{props.label}<span>:</span></span>
    <span>{props.value}</span>
  </div>
);

export interface HoverIconProps {
  icon: string;
  hoverText: string;
  label: string;
}

export const HoverIcon = (props: HoverIconProps) => (
  <div 
    className={Styles.HoverIcon}
    data-tip
    data-for={`tooltip-${props.label}`}
   >
    {props.icon}
    <ReactTooltip
      id={`tooltip-${props.label}`}
      className={TooltipStyles.Tooltip}
      effect="solid"
      place="top"
      type="light"
      data-event="mouseover"
      data-event-off="blur scroll"
    >
      {props.hoverText}
    </ReactTooltip>
  </div>
);

export interface ResolvedOutcomesProps {
  outcomes: Array<OutcomeFormatted>;
  expanded?: Boolean;
}

export const ResolvedOutcomes = (props: ResolvedOutcomesProps) => {
  const winnerIndex = props.outcomes.findIndex(outcome => outcome.winner);
  const outcomes = props.outcomes;
  const winner = outcomes.splice(winnerIndex, 1)[0];

  return (
    <div className={Styles.ResolvedOutcomes}>
       <span>Winning Outcome {CheckCircleIcon} </span>
       <span>{winner && winner.description}</span>
       {props.expanded &&
         <div>
           <span>other outcomes</span>
           <div>
             {outcomes.map((outcome, index) => 
               outcome.isTradable && (
                 <span>
                   {outcome.description}
                   {index + 1 !== outcomes.length &&
                    <span>
                      |
                    </span>
                   }
                 </span>
               )
              )}
           </div>
         </div>
       }
    </div>
  );
}