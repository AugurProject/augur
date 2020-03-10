import React from 'react';
import classNames from 'classnames';

import MarketLink from 'modules/market/components/market-link/market-link';
import {
  INVALID_OUTCOME_ID,
  SCALAR,
  SCALAR_UP_ID,
  YES_NO,
  ZERO,
  INVALID_OUTCOME_NAME,
  SUBMIT_DISPUTE,
  SCALAR_DOWN_ID,
  THEMES,
  BETTING_BACK,
  BETTING_LAY,
} from 'modules/common/constants';
import { getTheme } from 'modules/app/actions/update-app-status';
import { BigNumber, createBigNumber } from 'utils/create-big-number';
import ReactTooltip from 'react-tooltip';
import TooltipStyles from 'modules/common/tooltip.styles.less';
import { CheckCircleIcon } from 'modules/common/icons';
import {
  FormattedNumber,
  MarketData,
  OutcomeFormatted,
  ConsensusFormatted,
} from 'modules/types';
import { formatAttoRep, formatDai, formatNumber } from 'utils/format-number';
import { Getters } from '@augurproject/sdk';
import InvalidLabel from 'modules/common/containers/labels';
import { ProcessingButton, BettingBackLayButton } from 'modules/common/buttons';

import Styles from 'modules/market-cards/common.styles.less';
import { MarketCard } from 'modules/market-cards/market-card';
import { selectSortedDisputingOutcomes } from 'modules/markets/selectors/market';
import { calculatePosition } from 'modules/market/components/market-scalar-outcome-display/market-scalar-outcome-display';
import { getOutcomeNameWithOutcome } from 'utils/get-outcome';
import { SmallSubheadersTooltip } from 'modules/create-market/components/common';

export interface PercentProps {
  percent: number;
}

export const Percent = (props: PercentProps) => (
  <div className={Styles.Percent}>
    <span style={{ width: props.percent + '%' }}></span>
  </div>
);

export interface BettingOutcomeProps {
  description: string;
  index: number;
}

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
  theme: string;
}

export const Outcome = ({
  description,
  lastPricePercent,
  invalid,
  index,
  min,
  max,
  isScalar,
  marketId,
  outcomeId,
}: OutcomeProps) => {
  const percent = lastPricePercent
    ? calculatePosition(min, max, lastPricePercent)
    : 0;
  return (
    <MarketLink id={marketId} outcomeId={outcomeId.toString()}>
      <div
        className={classNames(Styles.Outcome, {
          [Styles.invalid]: invalid,
          [Styles[`Outcome-${index + 1}`]]: !invalid,
        })}
      >
        <div>
          {invalid ? (
            <InvalidLabel
              text={description}
              keyId={`${marketId}_${description}`}
            />
          ) : (
            <span>{description}</span>
          )}
          <span className={classNames({ [Styles.Zero]: percent === 0 })}>
            {percent === 0
              ? `0.00${isScalar ? '' : '%'}`
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
}

// TODO: needs a refactor. repeated Logic, overwrapped HTML.
export const DisputeOutcome = ({
  description,
  invalid,
  index,
  stake,
  dispute,
  id,
  canDispute,
  canSupport,
  marketId,
  isWarpSync,
}: DisputeOutcomeProps) => {
  const stakeCurrent = stake && formatAttoRep(stake.stakeCurrent);
  const bondSizeCurrent = stake && formatAttoRep(stake.bondSizeCurrent);

  const showButton =
    !stake.tentativeWinning || (canSupport && stake.tentativeWinning);

  return (
    <div
      className={classNames(Styles.DisputeOutcome, {
        [Styles.invalid]: invalid,
        [Styles[`Outcome-${index}`]]: !invalid,
      })}
    >
      <span>{isWarpSync && !invalid ? stake.warpSyncHash : description}</span>
      {stake && stake.tentativeWinning ? (
        <span>tentative winner</span>
      ) : (
        <Percent
          percent={
            stake
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
            {stake && stake.tentativeWinning ? (
              <SmallSubheadersTooltip
                header="pre-filled stake"
                subheader={``}
                text="Users can add extra support for a Tentative Winning Outcome"
              />
            ) : (
              'make tentative winner'
            )}
          </span>
          {stake && stake.tentativeWinning ? (
            <span>
              {stake ? stakeCurrent.formatted : 0}
              <span> REP</span>
            </span>
          ) : (
            <span>
              {stake ? stakeCurrent.formatted : 0}
              <span>/ {stake ? bondSizeCurrent.formatted : 0} REP</span>
            </span>
          )}
        </div>
        {showButton && (
          <ProcessingButton
            small
            queueName={SUBMIT_DISPUTE}
            queueId={marketId}
            matchingId={id}
            secondaryButton
            disabled={!canDispute}
            text={
              stake && stake.tentativeWinning
                ? 'Support Tentative Winner'
                : 'Dispute Tentative Winner'
            }
            action={() => dispute(id.toString())}
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
  marketId: string;
}

export const ScalarBlankDisputeOutcome = ({
  denomination,
  dispute,
  canDispute,
  marketId,
}: ScalarBlankDisputeOutcomeProps) => (
  <div className={classNames(Styles.DisputeOutcome, Styles[`Outcome-1`])}>
    <span>{`Dispute current Tentative Winner with new ${denomination} value`}</span>
    <div className={Styles.blank}>
      <div></div>
      <ProcessingButton
        secondaryButton
        queueName={SUBMIT_DISPUTE}
        queueId={marketId}
        small
        disabled={!canDispute}
        text={'Dispute Tentative Winner'}
        action={() => dispute(null)}
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

export const ScalarOutcome = ({
  scalarDenomination,
  min,
  max,
  lastPrice,
  marketId,
  outcomeId,
}: ScalarOutcomeProps) => (
  <MarketLink id={marketId} outcomeId={outcomeId}>
    <div className={Styles.ScalarOutcome}>
      <div>
        {lastPrice !== null && (
          <span
            style={{
              left:
                calculatePosition(min, max, lastPrice) + '%',
            }}
          >
            {lastPrice.formatted}
          </span>
        )}
      </div>
      <div>
        {formatDai(min).formatted}
        <span>{scalarDenomination}</span>
        {formatDai(max).formatted}
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
  stakes: Getters.Markets.StakeDetails[];
  dispute?: Function;
  inDispute?: boolean;
  showOutcomeNumber: number;
  canDispute: boolean;
  canSupport: boolean;
  marketId: string;
  isWarpSync?: boolean;
  theme: string;
}

export const OutcomeGroup = ({
  outcomes,
  expanded,
  marketType,
  scalarDenomination,
  min,
  max,
  stakes,
  dispute,
  inDispute,
  showOutcomeNumber,
  canDispute,
  canSupport,
  marketId,
  isWarpSync,
  theme = getTheme(),
}: OutcomeGroupProps) => {
  const sortedStakeOutcomes = selectSortedDisputingOutcomes(
    marketType,
    outcomes,
    stakes,
    isWarpSync
  );
  const isScalar = marketType === SCALAR;
  const isTrading = theme === THEMES.TRADING;
  let disputingOutcomes = sortedStakeOutcomes;
  let outcomesCopy = outcomes.slice(0);
  const removedInvalid = outcomesCopy.splice(0, 1)[0];

  if (inDispute) {
    if (isWarpSync) {
      disputingOutcomes = disputingOutcomes.filter(
        o => o.id !== SCALAR_DOWN_ID
      );
    } else if (!expanded) {
      disputingOutcomes.splice(showOutcomeNumber, showOutcomeNumber + 1);
    }
  } else {
    if (!expanded && outcomes.length > showOutcomeNumber) {
      outcomesCopy.splice(showOutcomeNumber - 1, 0);
    } else if (marketType === YES_NO) {
      outcomesCopy.reverse().splice(outcomesCopy.length, 0);
    } else {
      outcomesCopy.splice(outcomesCopy.length, 0);
    }
  }
  if (isTrading) {
    outcomesCopy.splice(outcomesCopy.length, 0, removedInvalid);
  }
  const outcomesShow = inDispute ? disputingOutcomes : outcomesCopy;

  return (
    <div
      className={classNames(Styles.OutcomeGroup, {
        [Styles.Dispute]: inDispute,
        [Styles.Scalar]: isScalar && !inDispute,
      })}
    >
      {isScalar && !inDispute && (
        <>
          <ScalarOutcome
            min={min}
            max={max}
            lastPrice={
              outcomes[SCALAR_UP_ID].price
                ? formatNumber(outcomes[SCALAR_UP_ID].price)
                : null
            }
            scalarDenomination={scalarDenomination}
            marketId={marketId}
            outcomeId={String(SCALAR_UP_ID)}
          />
          {isTrading && <Outcome
            description={removedInvalid.description}
            lastPricePercent={
              removedInvalid.price ? removedInvalid.lastPricePercent : null
            }
            invalid
            index={0}
            min={min}
            max={max}
            isScalar={isScalar}
            marketId={marketId}
            outcomeId={String(INVALID_OUTCOME_ID)}
          />}
        </>
      )}
      {(!isScalar || inDispute) &&
        outcomesShow.map(
          (outcome: OutcomeFormatted, index: number) =>
            ((!expanded && index < showOutcomeNumber) ||
              (expanded || marketType === YES_NO)) &&
            (inDispute &&
            !!stakes.find(stake => parseFloat(stake.outcome) === outcome.id) ? (
              <>
                <DisputeOutcome
                  key={outcome.id}
                  marketId={marketId}
                  description={outcome.description}
                  invalid={outcome.id === 0}
                  index={index > 2 ? index : index + 1}
                  stake={stakes.find(
                    stake => parseFloat(stake.outcome) === outcome.id
                  )}
                  dispute={dispute}
                  id={outcome.id}
                  canDispute={canDispute}
                  canSupport={canSupport}
                  isWarpSync={isWarpSync}
                />
              </>
            ) : (
              <Outcome
                key={outcome.id}
                description={outcome.description}
                lastPricePercent={outcome.lastPricePercent}
                invalid={outcome.id === 0}
                index={index > 2 ? index : index + 1}
                min={min}
                max={max}
                isScalar={isScalar}
                marketId={marketId}
                outcomeId={String(outcome.id)}
              />
            ))
        )}
      {isScalar && inDispute && !expanded && (
        <ScalarBlankDisputeOutcome
          denomination={scalarDenomination}
          dispute={dispute}
          canDispute={canDispute}
          marketId={marketId}
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

export const LabelValue = ({
  label,
  value,
  condensed,
}: LabelValueProps) => (
  <div
    className={classNames(Styles.LabelValue, {
      [Styles.Condensed]: condensed,
    })}
  >
    <span>
      {label}
      <span>:</span>
    </span>
    <span>{value}</span>
  </div>
);

export interface HoverIconProps {
  id: string;
  icon: JSX.Element;
  hoverText: string;
  label: string;
}

export const HoverIcon = ({
  id,
  icon,
  hoverText,
  label,
}: HoverIconProps) => (
  <div
    className={Styles.HoverIcon}
    data-tip
    data-for={`tooltip-${id}${label}`}
  >
    {icon}
    <ReactTooltip
      id={`tooltip-${id}${label}`}
      className={TooltipStyles.Tooltip}
      effect="solid"
      place="top"
      type="light"
      data-event="mouseover"
      data-event-off="blur scroll"
    >
      {hoverText}
    </ReactTooltip>
  </div>
);

export interface ResolvedOutcomesProps {
  consensusFormatted: ConsensusFormatted;
  outcomes: OutcomeFormatted[];
  expanded?: Boolean;
}

export const ResolvedOutcomes = ({
  outcomes,
  consensusFormatted,
  expanded,
}: ResolvedOutcomesProps) => {
  const outcomesFiltered = outcomes.filter(
    outcome => String(outcome.id) !== consensusFormatted.outcome
  );

  return (
    <div className={Styles.ResolvedOutcomes}>
      <span>Winning Outcome {CheckCircleIcon} </span>
      <span>
        {consensusFormatted.invalid
          ? INVALID_OUTCOME_NAME
          : consensusFormatted.outcomeName}
      </span>
      {expanded && (
        <div>
          <span>other outcomes</span>
          <div>
            {outcomesFiltered.map((outcome, index) => (
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
}

export const TentativeWinner = ({
  tentativeWinner,
  market,
  dispute,
  canDispute,
}: TentativeWinnerProps) => {
  return (
    <div
      className={classNames(Styles.ResolvedOutcomes, Styles.TentativeWinner)}
    >
      <span>Tentative Winner</span>
      <span>
        {tentativeWinner.isInvalidOutcome
          ? INVALID_OUTCOME_NAME
          : getOutcomeNameWithOutcome(
              market,
              tentativeWinner.outcome,
              tentativeWinner.isInvalidOutcome,
              true
            )}
      </span>
      <ProcessingButton
        small
        queueName={SUBMIT_DISPUTE}
        queueId={market.id}
        secondaryButton
        disabled={!canDispute}
        text={'SUPPORT OR DISPUTE OUTCOME'}
        action={() => dispute()}
      />
    </div>
  );
};

export const LoadingMarketCard = () => (
  <MarketCard loading={true} market={{} as MarketData} />
);
