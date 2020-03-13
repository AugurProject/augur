import React, { useEffect } from 'react';
import classNames from 'classnames';
import Clipboard from 'clipboard';

import MarketLink from 'modules/market/components/market-link/market-link';
import { FavoritesButton } from 'modules/common/buttons';
import { DotSelection } from 'modules/common/selection';
import { MarketProgress } from 'modules/common/progress';
import SocialMediaButtons from 'modules/market/containers/social-media-buttons';
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
  MARKET_REPORTING,
  COPY_MARKET_ID,
  COPY_AUTHOR,
  REPORTING_STATE,
} from 'modules/common/constants';
import { MARKET_LIST_CARD } from 'services/analytics/helpers';
import { getTheme } from 'modules/app/actions/update-app-status';
import { BigNumber, createBigNumber } from 'utils/create-big-number';
import ReactTooltip from 'react-tooltip';
import TooltipStyles from 'modules/common/tooltip.styles.less';
import {
  CheckCircleIcon,
  CopyAlternateIcon,
  Person,
  Rules,
  DesignatedReporter,
  DisputeStake,
  MarketCreator,
  PositionIcon,
} from 'modules/common/icons';
import { isSameAddress } from 'utils/isSameAddress';
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
import {
  CategoryTagTrail,
  InReportingLabel,
  MarketTypeLabel,
  RedFlag,
  TemplateShield,
} from 'modules/common/labels';
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
  outcomeId: string;
  marketId: string;
}

export const BettingOutcome = ({
  description,
  outcomeId,
  marketId,
}: BettingOutcomeProps) => (
  <MarketLink id={marketId} outcomeId={outcomeId.toString()}>
    <div className={Styles.BettingOutcome}>
      <span>{description}</span>
      <BettingBackLayButton
        type={BETTING_LAY}
        action={() =>
          console.log('Under Construction: setup actions for this button!')
        }
        text="6.2"
        subText="$100.23"
      />
      <BettingBackLayButton
        type={BETTING_BACK}
        action={() =>
          console.log('Under Construction: setup actions for this button!')
        }
        text="6.5"
        subText="$102.35"
      />
    </div>
  </MarketLink>
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
  isTrading: boolean;
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
  isTrading,
}: OutcomeProps) => {
  if (!isTrading) {
    return (
      <BettingOutcome
        marketId={marketId}
        outcomeId={outcomeId}
        description={description}
      />
    );
  }
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
              left: calculatePosition(min, max, lastPrice) + '%',
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

const mockData = [
  {
    title: 'Team A',
    spread: {
      topLabel: '+ 3.5',
      label: '-110',
      action: () => {},
      volume: '$5,000.43',
    },
    moneyLine: {
      topLabel: null,
      label: '+132',
      action: () => {},
      volume: '$6,500.12',
    },
    overUnder: {
      topLabel: 'O 227.5',
      label: '-110',
      action: () => {},
      volume: '$2,542.00',
    },
  },
  {
    title: 'Team B',
    spread: {
      topLabel: '- 3.5',
      label: '-110',
      action: () => {},
      volume: '$6,093.50',
    },
    moneyLine: {
      topLabel: null,
      label: '-156',
      action: () => {},
      volume: '$10,000.54',
    },
    overUnder: {
      topLabel: 'U 227.5',
      label: '-110',
      action: () => {},
      volume: '$5,000.18',
    },
  },
  {
    title: 'NoWinner',
    spread: {
      topLabel: null,
      label: '-110',
      action: () => {},
      volume: '$500.70',
    },
    moneyLine: {
      topLabel: null,
      label: '-157',
      action: () => {},
      volume: '$740.98',
    },
    overUnder: {
      topLabel: null,
      label: '-110',
      action: () => {},
      volume: '$540.50',
    },
  },
];

export interface MultiMarketTable {
  multiMarketTableData: Array<{
    title: string;
    spread: {
      topLabel: string | null;
      label: string;
      action: Function;
      volume: string;
    };
    moneyLine: {
      topLabel: string | null;
      label: string;
      action: Function;
      volume: string;
    };
    overUnder: {
      topLabel: string | null;
      label: string;
      action: Function;
      volume: string;
    };
  }>;
}

export const MultiMarketTable = ({ multiMarketTableData = mockData }) => {
  return (
    <section className={classNames(Styles.MultiMarketTable)}>
      <div>
        <ul>
          <li>Spread</li>
          <li>Moneyline</li>
          <li>Over / Under</li>
        </ul>
      </div>
      <>
        {multiMarketTableData.map(({ title, spread, moneyLine, overUnder }) => (
          <article key={title}>
            <h3>{title}</h3>
            <div>
              <button onClick={() => spread.action()}>
                {spread.topLabel && <span>{spread.topLabel}</span>}
                <span>{spread.label}</span>
              </button>
              <span>{spread.volume}</span>
            </div>
            <div>
              <button onClick={() => moneyLine.action()}>
                {moneyLine.topLabel && <span>{moneyLine.topLabel}</span>}
                <span>{moneyLine.label}</span>
              </button>
              <span>{moneyLine.volume}</span>
            </div>
            <div>
              <button onClick={() => overUnder.action()}>
                {overUnder.topLabel && <span>{overUnder.topLabel}</span>}
                <span>{overUnder.label}</span>
              </button>
              <span>{overUnder.volume}</span>
            </div>
          </article>
        ))}
      </>
    </section>
  );
};

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
  if (theme === THEMES.SPORTS) {
    return <MultiMarketTable />;
  }
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
          {isTrading && (
            <Outcome
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
              isTrading={isTrading}
            />
          )}
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
                isTrading={isTrading}
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

export const LabelValue = ({ label, value, condensed }: LabelValueProps) => (
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

export const HoverIcon = ({ id, icon, hoverText, label }: HoverIconProps) => (
  <div className={Styles.HoverIcon} data-tip data-for={`tooltip-${id}${label}`}>
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

export interface TopRowProps {
  market: MarketData;
  categoriesWithClick: Array<{ label: string; onClick: Function }>;
  marketLinkCopied: Function;
  toggleFavorite: Function;
  currentAugurTimestamp: number;
  isLogged?: boolean;
  isFavorite?: boolean;
}

export const TopRow = ({
  market,
  categoriesWithClick,
  toggleFavorite,
  marketLinkCopied,
  currentAugurTimestamp,
  isLogged,
  isFavorite,
}) => {
  useEffect(() => {
    const clipboardMarketId = new Clipboard('#copy_marketId');
    const clipboardAuthor = new Clipboard('#copy_author');
  }, [market.id, market.author]);
  const {
    settlementFeePercent,
    marketType,
    id,
    description,
    marketStatus,
    author,
    reportingState,
    volumeFormatted,
    disputeInfo,
    endTimeFormatted,
    isTemplate,
    mostLikelyInvalid,
    isWarpSync,
  } = market;
  const isScalar = marketType === SCALAR;

  return (
    <div
      className={classNames(Styles.TopRow, {
        [Styles.scalar]: isScalar,
        [Styles.template]: isTemplate,
        [Styles.invalid]: mostLikelyInvalid,
      })}
    >
      {marketStatus === MARKET_REPORTING && (
        <InReportingLabel
          marketStatus={marketStatus}
          reportingState={reportingState}
          disputeInfo={disputeInfo}
          isWarpSync={market.isWarpSync}
        />
      )}
      {isScalar && !isWarpSync && <MarketTypeLabel marketType={marketType} />}
      <RedFlag market={market} />
      {isTemplate && <TemplateShield market={market} />}
      <CategoryTagTrail categories={categoriesWithClick} />
      {getTheme() !== THEMES.TRADING ? (
        <>
          <span className={Styles.MatchedLine}>
            Matched<b>{` ${volumeFormatted.full}`}</b>
            {` (${settlementFeePercent.full} fee)`}
          </span>
          <button
            className={Styles.RulesButton}
            onClick={() => console.log('pop up a rules modal')}
          >
            {Rules} Rules
          </button>
        </>
      ) : (
        <MarketProgress
          reportingState={reportingState}
          currentTime={currentAugurTimestamp}
          endTimeFormatted={endTimeFormatted}
          reportingWindowEndTime={disputeInfo.disputeWindow.endTime}
        />
      )}
      <FavoritesButton
        action={() => toggleFavorite(id)}
        isFavorite={isFavorite}
        hideText
        disabled={!isLogged}
      />
      <DotSelection>
        <SocialMediaButtons
          listView
          marketDescription={description}
          marketAddress={id}
        />
        <div
          id="copy_marketId"
          data-clipboard-text={id}
          onClick={() => marketLinkCopied(id, MARKET_LIST_CARD)}
        >
          {CopyAlternateIcon} {COPY_MARKET_ID}
        </div>
        <div id="copy_author" data-clipboard-text={author}>
          {Person} {COPY_AUTHOR}
        </div>
      </DotSelection>
    </div>
  );
};

export interface InfoIconsProps {
  market: MarketData;
  address?: string;
  hasPosition?: boolean;
  hasStaked?: boolean;
}

export const InfoIcons = ({
  market,
  address,
  hasPosition,
  hasStaked,
}: InfoIconsProps) => {
  const { id, designatedReporter, author } = market;
  return (
    <>
      {address && isSameAddress(address, author) && (
        <HoverIcon
          id={id}
          label="marketCreator"
          icon={MarketCreator}
          hoverText="Market Creator"
        />
      )}
      {address && isSameAddress(address, designatedReporter) && (
        <HoverIcon
          id={id}
          label="reporter"
          icon={DesignatedReporter}
          hoverText="Designated Reporter"
        />
      )}
      {hasPosition && (
        <HoverIcon
          id={id}
          label="Position"
          icon={PositionIcon}
          hoverText="Position"
        />
      )}
      {hasStaked && (
        <HoverIcon
          id={id}
          label="dispute"
          icon={DisputeStake}
          hoverText="Dispute Stake"
        />
      )}
    </>
  );
};

export interface TradingSideSectionProps {
  address: string;
  currentAugurTimestamp: number;
  market: MarketData;
  condensed: boolean;
  hasPosition: boolean;
  hasStaked: boolean;
}

export const TradingSideSection = ({
  address,
  currentAugurTimestamp,
  market,
  condensed,
  hasPosition,
  hasStaked,
}) => {
  const {
    disputeInfo,
    endTimeFormatted,
    openInterestFormatted,
    reportingState,
    volumeFormatted,
  } = market;
  return (
    <div>
      {reportingState === REPORTING_STATE.PRE_REPORTING && (
        <>
          <LabelValue
            label={condensed ? 'Volume' : 'Total Volume'}
            value={`${volumeFormatted.full}`}
            condensed
          />
          {!condensed && (
            <LabelValue
              label="Open Interest"
              value={`${openInterestFormatted.full}`}
              condensed
            />
          )}
        </>
      )}
      {reportingState !== REPORTING_STATE.PRE_REPORTING && (
        <LabelValue
          condensed
          label="Total Dispute Stake"
          value={formatAttoRep(disputeInfo.stakeCompletedTotal).full}
        />
      )}
      <div className={Styles.hoverIconTray}>
        <InfoIcons
          market={market}
          hasPosition={hasPosition}
          hasStaked={hasStaked}
          address={address}
        />
      </div>
      <MarketProgress
        reportingState={reportingState}
        currentTime={currentAugurTimestamp}
        endTimeFormatted={endTimeFormatted}
        reportingWindowEndTime={disputeInfo.disputeWindow.endTime}
      />
    </div>
  );
};
