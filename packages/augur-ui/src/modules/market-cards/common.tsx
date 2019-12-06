import React from 'react';
import classNames from 'classnames';

import MarketLink from 'modules/market/components/market-link/market-link';
import {
  CATEGORICAL,
  SCALAR,
  YES_NO,
  REPORTING_STATE,
  ZERO,
  SCALAR_UP_ID,
  INVALID_OUTCOME_ID
} from 'modules/common/constants';
import { createBigNumber, BigNumber } from 'utils/create-big-number';
import ReactTooltip from 'react-tooltip';
import TooltipStyles from 'modules/common/tooltip.styles.less';
import { CheckCircleIcon } from 'modules/common/icons';
import { OutcomeFormatted, FormattedNumber, MarketData } from 'modules/types';
import { formatDai, formatAttoRep, formatNumber } from 'utils/format-number';
import { Getters } from '@augurproject/sdk';
import { InvalidLabel } from 'modules/common/labels';
import { SecondaryButton } from 'modules/common/buttons';

import Styles from 'modules/market-cards/common.styles.less';
import MarketCard from 'modules/market-cards/market-card';
import { selectSortedDisputingOutcomes } from 'modules/markets/selectors/market';
import { calculatePosition } from 'modules/market/components/market-scalar-outcome-display/market-scalar-outcome-display';

export interface PercentProps {
  percent: number;
}

export const Percent = (props: PercentProps) => (
  <div className={Styles.Percent}>
    <span style={{ width: props.percent + '%' }}></span>
  </div>
);

export interface OutcomeProps {
  description: string;
  lastPricePercent?: FormattedNumber;
  invalid?: boolean;
  index: number;
  min: BigNumber;
  max: BigNumber;
  isScalar: boolean;
  marketId: string;
  outcomeId: string;
}

export const Outcome = (props: OutcomeProps) => {
  const percent = props.lastPricePercent
    ? calculatePosition(props.min, props.max, props.lastPricePercent)
    : 0;
  return (
    <MarketLink id={props.marketId} outcomeId={props.outcomeId.toString()}>
      <div
        className={classNames(Styles.Outcome, {
          [Styles.invalid]: props.invalid,
          [Styles[`Outcome-${props.index}`]]: !props.invalid,
        })}
      >
        <div>
          {props.invalid ? <InvalidLabel text={props.description} keyid={`${props.marketId}_${props.description}`} /> : <span>{props.description}</span>}
          <span className={classNames({[Styles.Zero]: percent === 0})}>
            {percent === 0
              ? `0.00${props.isScalar ? '' : '%'}`
              : `${formatDai(percent).formatted}%`}
          </span>
        </div>
        <Percent percent={percent} />
      </div>
    </MarketLink>
  );
};

export interface DisputeOutcomeProps {
  description: string;
  invalid?: Boolean;
  index: number;
  stake: Getters.Markets.StakeDetails | null;
  dispute: Function;
  id: number;
  canDispute: boolean;
  canSupport: boolean;
}

export const DisputeOutcome = (props: DisputeOutcomeProps) => {
  const stakeCurrent = props.stake && formatAttoRep(props.stake.stakeCurrent);
  const bondSizeCurrent =
    props.stake && formatAttoRep(props.stake.bondSizeCurrent);

  const showButton =
    !props.stake.tentativeWinning ||
    (props.canSupport && props.stake.tentativeWinning);

  return (
    <div
      className={classNames(Styles.DisputeOutcome, {
        [Styles.invalid]: props.invalid,
        [Styles[`Outcome-${props.index}`]]: !props.invalid,
      })}
    >
      <span>{props.description}</span>
      {props.stake && props.stake.tentativeWinning ? (
        <span>tentative winner</span>
      ) : (
        <Percent
          percent={
            props.stake
              ? calculatePosition(
                  ZERO,
                  createBigNumber(bondSizeCurrent.value),
                  stakeCurrent
                )
              : 0
          }
        />
      )}
      <div>
        <div>
          <span>
            {props.stake && props.stake.tentativeWinning
              ? 'pre-filled stake'
              : 'make tentative winner'}
          </span>
          {props.stake && props.stake.tentativeWinning ? (
            <span>
              {props.stake ? stakeCurrent.formatted : 0}
              <span> REP</span>
            </span>
          ) : (
            <span>
              {props.stake ? stakeCurrent.formatted : 0}
              <span>/ {props.stake ? bondSizeCurrent.formatted : 0} REP</span>
            </span>
          )}
        </div>
        {showButton && (
          <SecondaryButton
            small
            disabled={!props.canDispute}
            text={
              props.stake && props.stake.tentativeWinning
                ? 'Support Tentative Winner'
                : 'Dispute Tentative Winner'
            }
            action={() => props.dispute(props.id.toString())}
          />
        )}
      </div>
    </div>
  );
};

interface ScalarBlankDisputeOutcomeProps {
  denomination: string;
  dispute: Function;
  canDispute: boolean;
}

export const ScalarBlankDisputeOutcome = (
  props: ScalarBlankDisputeOutcomeProps
) => (
  <div className={classNames(Styles.DisputeOutcome, Styles[`Outcome-1`])}>
    <span>{`Dispute current Tentative Winner with new ${props.denomination} value`}</span>
    <div className={Styles.blank}>
      <div></div>
      <SecondaryButton
        small
        disabled={!props.canDispute}
        text={'Dispute Tentative Winner'}
        action={() => props.dispute(null)}
      />
    </div>
  </div>
);

export interface ScalarOutcomeProps {
  scalarDenomination: string;
  min: BigNumber;
  max: BigNumber;
  lastPrice?: FormattedNumber;
  marketId: string;
  outcomeId: string;
}

export const ScalarOutcome = (props: ScalarOutcomeProps) => (
  <MarketLink id={props.marketId} outcomeId={props.outcomeId}>
    <div className={Styles.ScalarOutcome}>
      <div>
        {props.lastPrice !== null && (
          <span
            style={{
              left:
                calculatePosition(props.min, props.max, props.lastPrice) + '%',
            }}
          >
            {props.lastPrice.formatted}
          </span>
        )}
      </div>
      <div>
        {formatDai(props.min).formatted}
        <span>{props.scalarDenomination}</span>
        {formatDai(props.max).formatted}
      </div>
    </div>
  </MarketLink>
);

export interface OutcomeGroupProps {
  outcomes: OutcomeFormatted[];
  expanded?: Boolean;
  marketType: string;
  scalarDenomination?: string;
  min?: BigNumber;
  max?: BigNumber;
  reportingState: string;
  stakes: Getters.Markets.StakeDetails[];
  dispute?: Function;
  inDispute?: boolean;
  showOutcomeNumber: number;
  canDispute: boolean;
  canSupport: boolean;
  marketId: string;
}

export const OutcomeGroup = (props: OutcomeGroupProps) => {
  const sortedStakeOutcomes = selectSortedDisputingOutcomes(
    props.marketType,
    props.outcomes,
    props.stakes
  );

  const { inDispute, showOutcomeNumber } = props;
  let disputingOutcomes = sortedStakeOutcomes;
  let outcomesCopy = props.outcomes.slice(0);
  const removedInvalid = outcomesCopy.splice(0, 1)[0];

  if (inDispute) {
    if (!props.expanded) {
      disputingOutcomes.splice(showOutcomeNumber, showOutcomeNumber + 1);
    }
  } else {
    if (!props.expanded && props.outcomes.length > showOutcomeNumber) {
      outcomesCopy.splice(showOutcomeNumber - 1, 0, removedInvalid);
    } else if (props.marketType === YES_NO) {
      outcomesCopy.reverse().splice(outcomesCopy.length, 0, removedInvalid);
    } else {
      outcomesCopy.splice(outcomesCopy.length, 0, removedInvalid);
    }
  }

  const outcomesShow = inDispute ? disputingOutcomes : outcomesCopy;

  return (
    <div
      className={classNames(Styles.OutcomeGroup, {
        [Styles.Dispute]: inDispute,
        [Styles.Scalar]: props.marketType === SCALAR && !inDispute,
      })}
    >
      {props.marketType === SCALAR && !inDispute && (
        <>
          <ScalarOutcome
            min={props.min}
            max={props.max}
            lastPrice={
              props.outcomes[SCALAR_UP_ID].price
                ? formatNumber(props.outcomes[SCALAR_UP_ID].price)
                : null
            }
            scalarDenomination={props.scalarDenomination}
            marketId={props.marketId}
            outcomeId={SCALAR_UP_ID}
          />
          <Outcome
            description={removedInvalid.description}
            lastPricePercent={
              removedInvalid.price ? removedInvalid.lastPricePercent : null
            }
            invalid={true}
            index={0}
            min={props.min}
            max={props.max}
            isScalar={props.marketType === SCALAR}
            marketId={props.marketId}
            outcomeId={INVALID_OUTCOME_ID}
          />
        </>
      )}
      {(props.marketType !== SCALAR || inDispute) &&
        outcomesShow.map(
          (outcome: OutcomeFormatted, index: number) =>
            ((!props.expanded && index < showOutcomeNumber) ||
              (props.expanded || props.marketType === YES_NO)) &&
            (inDispute ? (
              <DisputeOutcome
                key={outcome.id}
                description={outcome.description}
                invalid={outcome.id === 0}
                index={index > 2 ? index : index + 1}
                stake={props.stakes.find(
                  stake => parseFloat(stake.outcome) === outcome.id
                )}
                dispute={props.dispute}
                id={outcome.id}
                canDispute={props.canDispute}
                canSupport={props.canSupport}
              />
            ) : (
              <Outcome
                key={outcome.id}
                description={outcome.description}
                lastPricePercent={outcome.lastPricePercent}
                invalid={outcome.id === 0}
                index={index > 2 ? index : index + 1}
                min={props.min}
                max={props.max}
                isScalar={props.marketType === SCALAR}
                marketId={props.marketId}
                outcomeId={outcome.id}
              />
            ))
        )}
      {props.marketType === SCALAR && inDispute && (
        <ScalarBlankDisputeOutcome
          denomination={props.scalarDenomination}
          dispute={props.dispute}
          canDispute={props.canDispute}
        />
      )}
    </div>
  );
};

export interface LabelValueProps {
  label: string;
  value: number | string;
  condensed?: boolean;
}

export const LabelValue = (props: LabelValueProps) => (
  <div
    className={classNames(Styles.LabelValue, {
      [Styles.Condensed]: props.condensed,
    })}
  >
    <span>
      {props.label}
      <span>:</span>
    </span>
    <span>{props.value}</span>
  </div>
);

export interface HoverIconProps {
  icon: JSX.Element;
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
      {props.expanded && (
        <div>
          <span>other outcomes</span>
          <div>
            {outcomes.map((outcome, index) => (
              <span>
                {outcome.description}
                {index + 1 !== outcomes.length && <span>|</span>}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export const LoadingMarketCard = () => (
  <MarketCard loading={true} market={{} as MarketData} />
);
