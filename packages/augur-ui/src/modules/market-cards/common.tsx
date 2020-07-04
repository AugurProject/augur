import type { Getters } from '@augurproject/sdk';
import { MarketReportingState } from '@augurproject/sdk-lite';
import classNames from 'classnames';
import { ProcessingButton } from 'modules/common/buttons';
import {
  INVALID_OUTCOME_ID,
  INVALID_OUTCOME_LABEL,
  SCALAR,
  SCALAR_DOWN_ID,
  SCALAR_INVALID_BEST_BID_ALERT_VALUE as INVALID_ALERT_PERCENTAGE,
  SCALAR_UP_ID,
  SUBMIT_DISPUTE,
  YES_NO,
  ZERO,
} from 'modules/common/constants';
import InvalidLabel from 'modules/common/containers/labels';
import { CheckCircleIcon } from 'modules/common/icons';
import TooltipStyles from 'modules/common/tooltip.styles.less';
import { SmallSubheadersTooltip } from 'modules/create-market/components/common';

import Styles from 'modules/market-cards/common.styles.less';
import MarketCard from 'modules/market-cards/market-card';

import MarketLink from 'modules/market/components/market-link/market-link';
import { calculatePosition } from 'modules/market/components/market-scalar-outcome-display/market-scalar-outcome-display';
import { selectSortedDisputingOutcomes } from 'modules/markets/selectors/market';
import {
  ConsensusFormatted,
  FormattedNumber,
  MarketData,
  OutcomeFormatted,
} from 'modules/types';
import React, { Fragment } from 'react';
import ReactTooltip from 'react-tooltip';
import { BigNumber, createBigNumber } from 'utils/create-big-number';
import { formatAttoRep, formatDai, formatNumber } from 'utils/format-number';
import { getOutcomeNameWithOutcome } from 'utils/get-outcome';

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
          [Styles[`Outcome-${props.index + 1}`]]: !props.invalid,
        })}
      >
        <div>
          {props.invalid ? (
            <InvalidLabel
              text={props.description}
              keyId={`${props.marketId}_${props.description}`}
            />
          ) : (
            <span>{props.description}</span>
          )}
          <span className={classNames({ [Styles.Zero]: percent === 0,
          [Styles.InvalidPrice]: props.invalid
            && percent >= INVALID_ALERT_PERCENTAGE.toNumber()})}>
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
  marketId: string;
  isWarpSync?: boolean;
  forkingMarket?: boolean;
}

export const DisputeOutcome = (props: DisputeOutcomeProps) => {
  const stakeCurrent = props.stake && formatAttoRep(props.stake.stakeCurrent);
  const bondSizeCurrent =
    props.stake && formatAttoRep(props.stake.bondSizeCurrent);

  const showButton =
    !props.stake.tentativeWinning ||
    (props.canSupport && props.stake.tentativeWinning);

  let buttonText =
    props.stake && props.stake.tentativeWinning
      ? 'Support Tentative Winner'
      : 'Dispute Tentative Winner';

  if (props.forkingMarket) {
    buttonText = "Migrate Rep to this Outcome's Universe";
  }

  return (
    <div
      className={classNames(Styles.DisputeOutcome, {
        [Styles.invalid]: props.invalid,
        [Styles.forking]: props.forkingMarket,
        [Styles[`Outcome-${props.index}`]]: !props.invalid,
      })}
    >
      <span>
        {props.isWarpSync && !props.invalid
          ? props.stake.warpSyncHash
          : props.invalid ? INVALID_OUTCOME_LABEL : props.description}
      </span>
      {!props.forkingMarket && (
        <>
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
                {props.stake && props.stake.tentativeWinning ? (
                  <SmallSubheadersTooltip
                    header="pre-filled stake"
                    subheader={``}
                    text="Users can add extra support for a Tentative Winning Outcome"
                  />
                ) : (
                  'make tentative winner'
                )}
              </span>
              {props.stake && props.stake.tentativeWinning ? (
                <span>
                  {props.stake ? stakeCurrent.formatted : 0}
                  <span> REP</span>
                </span>
              ) : (
                <span>
                  {props.stake ? stakeCurrent.formatted : 0}
                  <span>
                    / {props.stake ? bondSizeCurrent.formatted : 0} REP
                  </span>
                </span>
              )}
            </div>
            {showButton && (
              <ProcessingButton
                small
                queueName={SUBMIT_DISPUTE}
                queueId={props.marketId}
                matchingId={props.id}
                secondaryButton
                disabled={!props.canDispute}
                text={buttonText}
                action={() => props.dispute(props.id.toString(), props.invalid)}
              />
            )}
          </div>
        </>
      )}
      {props.forkingMarket && (
        <ProcessingButton
          small
          queueName={SUBMIT_DISPUTE}
          queueId={props.marketId}
          matchingId={props.id}
          secondaryButton
          disabled={!props.canDispute}
          text={buttonText}
          action={() => props.dispute(props.id.toString(), props.invalid)}
        />
      )}
    </div>
  );
};

interface ScalarBlankDisputeOutcomeProps {
  denomination: string;
  dispute: Function;
  canDispute: boolean;
  marketId: string;
  otherOutcomes: string[];
}

export const ScalarBlankDisputeOutcome = (
  props: ScalarBlankDisputeOutcomeProps
) => (
  <div className={classNames(Styles.DisputeOutcome, Styles[`Outcome-1`])}>
    <span>{`Dispute current Tentative Winner with new ${props.denomination} value`}</span>
    <div className={Styles.blank}>
      <div></div>
      <ProcessingButton
        secondaryButton
        queueName={SUBMIT_DISPUTE}
        queueId={props.marketId}
        nonMatchingIds={props.otherOutcomes}
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
  isWarpSync?: boolean;
  forkingMarket?: boolean;
}

export const OutcomeGroup = (props: OutcomeGroupProps) => {
  const sortedStakeOutcomes = selectSortedDisputingOutcomes(
    props.marketType,
    props.outcomes,
    props.stakes,
    props.isWarpSync
  );

  const { inDispute, showOutcomeNumber, isWarpSync } = props;
  let disputingOutcomes = sortedStakeOutcomes;
  let outcomesCopy = props.outcomes.slice(0);
  const removedInvalid = outcomesCopy.splice(0, 1)[0];

  if (inDispute) {
    if (isWarpSync) {
      disputingOutcomes = disputingOutcomes.filter(
        o => o.id !== SCALAR_DOWN_ID
      );
    } else if (!props.expanded) {
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
            outcomeId={String(SCALAR_UP_ID)}
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
            outcomeId={String(INVALID_OUTCOME_ID)}
          />
        </>
      )}
      {((props.marketType !== SCALAR || inDispute) && props.reportingState !== MarketReportingState.Unknown) &&
        outcomesShow.map(
          (outcome: OutcomeFormatted, index: number) =>
            ((!props.expanded && index < showOutcomeNumber) ||
              (props.expanded || props.marketType === YES_NO)) &&
            (inDispute &&
            !!props.stakes.find(
              stake => parseFloat(stake.outcome) === outcome.id
            ) ? (
              <Fragment key={props.marketId + outcome.id + index}>
                {props.marketType === SCALAR &&
                  index === 1 &&
                  props.expanded && (
                    <ScalarBlankDisputeOutcome
                      denomination={props.scalarDenomination}
                      dispute={props.dispute}
                      canDispute={props.canDispute}
                      marketId={props.marketId}
                      otherOutcomes={outcomesShow.map(o => String(o.id))}
                    />
                  )}
                <DisputeOutcome
                  key={outcome.id}
                  marketId={props.marketId}
                  description={outcome.description}
                  invalid={outcome.isInvalid}
                  index={index > 2 ? index : index + 1}
                  stake={props.stakes.find(
                    stake => parseFloat(stake.outcome) === outcome.id && stake.isInvalidOutcome === outcome.isInvalid
                  )}
                  dispute={props.dispute}
                  id={outcome.id}
                  canDispute={props.canDispute}
                  canSupport={props.canSupport}
                  isWarpSync={isWarpSync}
                  forkingMarket={props.forkingMarket}
                />
              </Fragment>
            ) : (
              <Outcome
                key={outcome.id}
                description={outcome.description}
                lastPricePercent={outcome.lastPricePercent}
                invalid={outcome.isInvalid}
                index={index > 2 ? index : index + 1}
                min={props.min}
                max={props.max}
                isScalar={props.marketType === SCALAR}
                marketId={props.marketId}
                outcomeId={String(outcome.id)}
              />
            ))
        )}
      {props.marketType === SCALAR && inDispute && !props.expanded && (
        <ScalarBlankDisputeOutcome
          denomination={props.scalarDenomination}
          dispute={props.dispute}
          canDispute={props.canDispute}
          marketId={props.marketId}
          otherOutcomes={outcomesShow.map(o => String(o.id))}
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
  id: string;
  icon: JSX.Element;
  hoverText: string;
  label: string;
}

export const HoverIcon = (props: HoverIconProps) => (
  <div
    className={Styles.HoverIcon}
    data-tip
    data-for={`tooltip-${props.id}${props.label}`}
    data-iscapture={true}
  >
    {props.icon}
    <ReactTooltip
      id={`tooltip-${props.id}${props.label}`}
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
  consensusFormatted: ConsensusFormatted;
  outcomes: OutcomeFormatted[];
  expanded?: Boolean;
}

export const ResolvedOutcomes = (props: ResolvedOutcomesProps) => {
  if (!props.consensusFormatted) return null;
  const outcomes = props.outcomes.filter(
    outcome => String(outcome.id) !== props.consensusFormatted.outcome
  );

  return (
    <div className={Styles.ResolvedOutcomes}>
      <span>Winning Outcome {CheckCircleIcon} </span>
      <span>
        {props.consensusFormatted.invalid
          ? INVALID_OUTCOME_LABEL
          : props.consensusFormatted.outcomeName}
      </span>
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

export interface TentativeWinnerProps {
  tentativeWinner: Getters.Markets.StakeDetails;
  market: MarketData;
  dispute: Function;
  canDispute: boolean;
  isForkingMarket?: boolean;
}

export const TentativeWinner = (props: TentativeWinnerProps) => {
  return (
    <div
      className={classNames(Styles.ResolvedOutcomes, Styles.TentativeWinner, {[Styles.forking]: props.isForkingMarket})}
    >
      {!props.isForkingMarket && (
        <>
          <span>Tentative Winner</span>
          <span>
            {props.tentativeWinner.isInvalidOutcome
              ? INVALID_OUTCOME_LABEL
              : getOutcomeNameWithOutcome(
                  props.market,
                  props.tentativeWinner.outcome,
                  props.tentativeWinner.isInvalidOutcome,
                  true
                )}
          </span>
        </>
      )}
      <ProcessingButton
        small
        queueName={SUBMIT_DISPUTE}
        queueId={props.market.id}
        secondaryButton
        disabled={!props.canDispute}
        text={
          props.isForkingMarket
            ? "Migrate Rep to an Outcome's Universe"
            : 'SUPPORT OR DISPUTE OUTCOME'
        }
        action={() => props.dispute()}
      />
    </div>
  );
};

export const LoadingMarketCard = () => (
  <MarketCard loading={true} market={{} as MarketData} />
);
