import React, { Component } from 'react';
import classNames from 'classnames';

import {
  CATEGORICAL,
  SCALAR,
  YES_NO,
  REPORTING_STATE
} from 'modules/common/constants';
import { createBigNumber } from 'utils/create-big-number';
import ReactTooltip from "react-tooltip";
import TooltipStyles from "modules/common/tooltip.styles.less";
import { CheckCircleIcon } from "modules/common/icons";
import { OutcomeFormatted, FormattedNumber, MarketData } from "modules/types";
import { formatDai, formatAttoRep } from "utils/format-number";
import { Getters } from "@augurproject/sdk";
import { SecondaryButton } from 'modules/common/buttons';

import Styles from 'modules/market-cards/common.styles.less';
import MarketCard from 'modules/market-cards/market-card';

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
  lastPricePercent?: FormattedNumber;
  invalid?: Boolean;
  index: number;
  min: BigNumber;
  max: BigNumber;
}

export const Outcome = (props: OutcomeProps) => {
  const percent = props.lastPricePercent ? calculatePosition(props.min, props.max, props.lastPricePercent) : 0;
  return (
      <div className={classNames(Styles.Outcome, {[Styles.invalid]: props.invalid, [Styles[`Outcome-${props.index}`]]: !props.invalid})}>
    	<div>
      	<span>{props.description}</span>
      	<span>{formatDai(percent).formatted}%</span>
      </div>
      <Percent percent={percent} />
    </div>
  );
}

export interface DisputeOutcomeProps {
  description: string;
  invalid?: Boolean;
  index: number;
  stake: Getters.Markets.StakeDetails|null;
}

export const DisputeOutcome = (props: DisputeOutcomeProps) => {
  const bondSizeCurrent = props.stake && formatAttoRep(props.stake.bondSizeCurrent);
  const bondSizeTotal = props.stake && formatAttoRep(props.stake.bondSizeTotal);

  return (
    <div className={classNames(Styles.DisputeOutcome, {[Styles.invalid]: props.invalid, [Styles[`Outcome-${props.index}`]]: !props.invalid})}>
      <span>{props.description}</span>
      {props.stake && props.stake.tentativeWinning ? <span>tentative winner</span> : <Percent percent={props.stake ? calculatePosition(createBigNumber(0), createBigNumber(bondSizeTotal.value), bondSizeCurrent) : 0} />}
      <div>
        <div>
          <span>{props.stake && props.stake.tentativeWinning ? "pre-filled stake" : "make tentative winner"}</span>
          <span>{props.stake ? bondSizeCurrent.formatted : 0}<span>/ {props.stake ? bondSizeTotal.formatted : 0} REP</span></span>
        </div>
        <SecondaryButton small text={props.stake && props.stake.tentativeWinning ? "Support Tentative Winner" : "Dispute Tentative Winner"} action={null} />
      </div>
    </div>
  );
}

export interface ScalarOutcomeProps {
  scalarDenomination: string;
  min: BigNumber;
  max: BigNumber;
  lastPrice?: FormattedNumber;
}

export function calculatePosition(min: BigNumber, max: BigNumber, lastPrice: FormattedNumber) {
  const range = max.minus(min);
	const pricePercentage = createBigNumber(lastPrice ? lastPrice.value : 0)
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
  			<span style={{left: calculatePosition(props.min, props.max, props.lastPrice) + '%'}}>{props.lastPrice.formatted}</span>
  		}
  	</div>
  	<div>
	  	{formatDai(props.min).formatted}
	  	<span>{props.scalarDenomination}</span>
	  	{formatDai(props.max).formatted}
  	</div>
  </div>
);

export interface OutcomeGroupProps {
	outcomes: Array<OutcomeFormatted>;
	expanded?: Boolean;
	marketType: string;
	scalarDenomination?: string;
	min?: BigNumber;
	max?: BigNumber;
  reportingState: string;
  stakes: Getters.Markets.StakeDetails[];
}

export const OutcomeGroup = (props: OutcomeGroupProps) => {
  const inDispute = props.reportingState === REPORTING_STATE.CROWDSOURCING_DISPUTE || props.reportingState === REPORTING_STATE.AWAITING_NEXT_WINDOW;
  let outcomesShow = props.outcomes.filter(outcome => inDispute || outcome.isTradable);
  const removedInvalid = outcomesShow.splice(0, 1)[0];
  outcomesShow.splice(2, 0, removedInvalid);
  return (
    <div className={classNames(Styles.OutcomeGroup, {
			[Styles.Categorical]: props.marketType === CATEGORICAL,
			[Styles.Scalar]: props.marketType === SCALAR,
			[Styles.YesNo]: props.marketType === YES_NO,
      [Styles.Dispute]: inDispute
		})}>
  		{props.marketType === SCALAR && !inDispute &&
        <>
    			<ScalarOutcome
    				min={props.min}
    				max={props.max}
    				lastPrice={outcomesShow[0].price ? outcomesShow[0].lastPricePercent : null}
    				scalarDenomination={props.scalarDenomination}
    			/>
          <Outcome
            description={removedInvalid.description}
            lastPricePercent={removedInvalid.price ? removedInvalid.lastPricePercent : null}
            invalid={true}
            index={0}
            min={props.min}
            max={props.max}
          />
        </>
  		}
	  	{(props.marketType !== SCALAR || inDispute) && outcomesShow.map((outcome: OutcomeFormatted, index: number) =>
	  		(!props.expanded && index < 3 || (props.expanded || props.marketType === YES_NO)) && (
          inDispute ? 
             <DisputeOutcome
               key={outcome.id}
               description={outcome.description}
               invalid={outcome.id === 0}
               index={index > 2 ? index : index + 1}
               stake={props.stakes.find(stake => parseFloat(stake.outcome) === outcome.id)}
             />
          : <Outcome
              key={outcome.id}
    	  			description={outcome.description}
    	  			lastPricePercent={outcome.lastPricePercent}
    	  			invalid={outcome.id === 0}
    	  			index={index > 2 ? index : index + 1}
              min={props.min}
              max={props.max}
    	  		/>
        )
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

export const LoadingMarketCard = () =>
  <MarketCard
    loading={true}
    market={{} as MarketData}
    history={{}}
    location={{}}
    toggleFavorite={() => {}}
    currentAugurTimestamp={0}
    reportingWindowStatsEndTime={0}
    address=""
  />
