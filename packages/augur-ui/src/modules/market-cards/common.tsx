import React, { useEffect, useState, Fragment } from 'react';
import { useLocation } from 'react-router';
import ReactTooltip from 'react-tooltip';
import { MarketReportingState } from '@augurproject/sdk-lite';
import classNames from 'classnames';
import Clipboard from 'clipboard';

import MarketLink from 'modules/market/components/market-link/market-link';
import { FavoritesButton } from 'modules/common/buttons';
import { DotSelection } from 'modules/common/selection';
import { MarketProgress } from 'modules/common/progress';
import SocialMediaButtons from 'modules/market/components/common/social-media-buttons';
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
  BUY,
  INVALID_OUTCOME_LABEL,
  SUBMIT_DISPUTE,
  SCALAR_DOWN_ID,
  THEMES,
  BETTING_BACK,
  BETTING_LAY,
  MARKET_REPORTING,
  COPY_MARKET_ID,
  COPY_AUTHOR,
  REPORTING_STATE,
  ASKS,
  ODDS_TYPE,
  SCALAR_INVALID_BEST_BID_ALERT_VALUE as INVALID_ALERT_PERCENTAGE,
  MODAL_REPORTING,
  SPORTS_GROUP_TYPES,
  SPORTS_GROUP_MARKET_TYPES,
} from 'modules/common/constants';
import { convertToOdds, convertToNormalizedPrice } from 'utils/get-odds';
import { MARKET_LIST_CARD, marketLinkCopied } from 'services/analytics/helpers';
import { useAppStatusStore } from 'modules/app/store/app-status';
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
  WinningMedal,
  ThickChevron,
  FingersCrossed,
  QuestionIcon,
} from 'modules/common/icons';
import { isSameAddress } from 'utils/isSameAddress';
import {
  ConsensusFormatted,
  FormattedNumber,
  MarketData,
  OutcomeFormatted,
  MarketInfos,
} from 'modules/types';
import { calculateTotalOrderValue } from 'modules/trades/helpers/calc-order-profit-loss-percents';
import { BigNumber, createBigNumber } from 'utils/create-big-number';
import { formatAttoRep, formatDai, formatNumber } from 'utils/format-number';
import { Getters } from '@augurproject/sdk';
import { ProcessingButton, BettingBackLayButton } from 'modules/common/buttons';
import {
  CategoryTagTrail,
  InReportingLabel,
  MarketTypeLabel,
  RedFlag,
  TemplateShield,
  InvalidLabel,
} from 'modules/common/labels';
import Styles from 'modules/market-cards/common.styles.less';
import { MarketCard } from 'modules/market-cards/market-card';
import { selectSortedDisputingOutcomes } from 'modules/markets/selectors/market';
import { calculatePosition } from 'modules/market/components/market-scalar-outcome-display/market-scalar-outcome-display';
import { getOutcomeNameWithOutcome } from 'utils/get-outcome';
import { SmallSubheadersTooltip } from 'modules/create-market/components/common';
import { Betslip } from 'modules/trading/store/betslip';
import { MARKETS } from 'modules/routes/constants/views';
import makePath from 'modules/routes/helpers/make-path';
import toggleCategory from 'modules/routes/helpers/toggle-category';
import { useMarketsStore } from 'modules/markets/store/markets';
import { hasStakeInMarket } from 'modules/account/helpers/common';
import { CountdownProgress } from 'modules/common/progress';
import { isMarketView } from 'modules/market/components/market-view/betting-market-view';

export interface PercentProps {
  percent: number;
}

export const Percent = ({ percent }: PercentProps) => (
  <div className={Styles.Percent}>
    <span style={{ width: percent + '%' }}></span>
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
          <span
            className={classNames({
              [Styles.Zero]: percent === 0,
              [Styles.InvalidPrice]:
                invalid && percent >= INVALID_ALERT_PERCENTAGE.toNumber(),
            })}
          >
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
  id: number;
  canDispute: boolean;
  canSupport: boolean;
  marketId: string;
  isWarpSync?: boolean;
  forkingMarket?: boolean;
}
// TODO: needs a refactor. repeated Logic, overwrapped HTML.
export const DisputeOutcome = ({
  description,
  invalid,
  forkingMarket,
  index,
  stake,
  id,
  canDispute,
  canSupport,
  marketId,
  isWarpSync,
}: DisputeOutcomeProps) => {
  const {
    actions: { setModal },
  } = useAppStatusStore();
  const stakeCurrent = stake && formatAttoRep(stake.stakeCurrent);
  const bondSizeCurrent = stake && formatAttoRep(stake.bondSizeCurrent);

  const showButton =
    !stake.tentativeWinning || (canSupport && stake.tentativeWinning);

  let buttonText = stake?.tentativeWinning
    ? 'Support Tentative Winner'
    : 'Dispute Tentative Winner';

  if (forkingMarket) {
    buttonText = "Migrate Rep to this Outcome's Universe";
  }

  return (
    <div
      className={classNames(Styles.DisputeOutcome, {
        [Styles.invalid]: invalid,
        [Styles.forking]: forkingMarket,
        [Styles[`Outcome-${index}`]]: !invalid,
      })}
    >
      <span>{isWarpSync && !invalid ? stake.warpSyncHash : description}</span>
      {!forkingMarket && (
        <>
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
                {stake?.tentativeWinning ? (
                  <SmallSubheadersTooltip
                    header="pre-filled stake"
                    text="Users can add extra support for a Tentative Winning Outcome"
                  />
                ) : (
                  'make tentative winner'
                )}
              </span>
              {stake?.tentativeWinning ? (
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
                text={buttonText}
                action={() =>
                  setModal({
                    type: MODAL_REPORTING,
                    marketId: marketId,
                    selectedOutcome: id.toString(),
                    isInvalid: invalid,
                  })
                }
              />
            )}
          </div>
        </>
      )}
      {forkingMarket && (
        <ProcessingButton
          small
          queueName={SUBMIT_DISPUTE}
          queueId={marketId}
          matchingId={id}
          secondaryButton
          disabled={!canDispute}
          text={buttonText}
          action={() =>
            setModal({
              type: MODAL_REPORTING,
              marketId: marketId,
              selectedOutcome: id.toString(),
              isInvalid: invalid,
            })
          }
        />
      )}
    </div>
  );
};

interface ScalarBlankDisputeOutcomeProps {
  denomination: string;
  canDispute: boolean;
  market: MarketData;
  otherOutcomes: string[];
}

export const ScalarBlankDisputeOutcome = ({
  denomination,
  canDispute,
  market,
  otherOutcomes,
}: ScalarBlankDisputeOutcomeProps) => {
  const {
    actions: { setModal },
  } = useAppStatusStore();
  return (
    <div className={classNames(Styles.DisputeOutcome, Styles[`Outcome-1`])}>
      <span>{`Dispute current Tentative Winner with new ${denomination} value`}</span>
      <div className={Styles.blank}>
        <div />
        <ProcessingButton
          secondaryButton
          queueName={SUBMIT_DISPUTE}
          queueId={market.id}
          nonMatchingIds={otherOutcomes}
          small
          disabled={!canDispute}
          text={'Dispute Tentative Winner'}
          action={() =>
            setModal({
              type: MODAL_REPORTING,
              market,
              selectedOutcome: null,
              isInvalid: false,
            })
          }
        />
      </div>
    </div>
  );
};
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

const determineTopLabel = ({ groupType, marketLine }, outcomeNumber, title) => {
  const {
    OVER_UNDER,
    COMBO_OVER_UNDER,
    SPREAD,
    COMBO_SPREAD,
  } = SPORTS_GROUP_MARKET_TYPES;
  if (outcomeNumber > 2 || outcomeNumber === 0) {
    return null;
  }
  switch (groupType) {
    case OVER_UNDER:
    case COMBO_OVER_UNDER: {
      if (title && title.replace) {
        return title.replace('Over', 'O').replace('Under', 'U');
      }
      // use fall back that is usually right.
      return outcomeNumber === 1 ? `O ${marketLine}.5` : `U ${marketLine}.5`;
    }
    case SPREAD:
    case COMBO_SPREAD: {
      return title.indexOf('-') > -1
        ? title.substring(title.indexOf('-'))
        : title.substring(title.indexOf('+'));
    }
    default:
      return null;
  }
};

interface SportsOutcomeProps {
  title?: string;
  volume: string;
  outcomeId: number;
  outcomeLabel: string;
  market: MarketInfos | MarketData;
}

export const SportsOutcome = ({
  title = undefined,
  outcomeId,
  outcomeLabel,
  market = {},
}: SportsOutcomeProps) => {
  const { liquidityPools } = useMarketsStore();
  const { addBet } = Betslip.actions;
  const {
    sportsBook,
    minPriceBigNumber,
    maxPriceBigNumber,
    marketType,
    id,
    description,
    minPrice,
    maxPrice,
    consensusFormatted,
  } = market;
  const isWinningOutcome =
    consensusFormatted?.winningOutcome === String(outcomeId);
  const poolId = sportsBook?.liquidityPool;
  const bestAsk =
    poolId && liquidityPools[poolId] && liquidityPools[poolId][outcomeId];
  let topLabel = null;
  let disabled = true;
  let label = '-';
  let subLabel = '';
  let action = () => {};
  if (isWinningOutcome && sportsBook) {
    topLabel = determineTopLabel(sportsBook, outcomeId, outcomeLabel);
    label = 'Winner';
    disabled = false;
  } else if (bestAsk && sportsBook) {
    const { shares, price } = bestAsk;
    subLabel = formatDai(
      calculateTotalOrderValue(
        shares,
        price,
        BUY,
        minPriceBigNumber,
        maxPriceBigNumber,
        marketType
      )
    ).full;
    const normalizedPrice = convertToNormalizedPrice({
      price,
      min: minPriceBigNumber,
      max: maxPriceBigNumber,
    });
    const OddToUse = convertToOdds(normalizedPrice);
    topLabel = determineTopLabel(sportsBook, outcomeId, outcomeLabel);
    label = OddToUse.full;
    disabled = false;
    action = () => {
      addBet(
        id,
        description,
        maxPrice,
        minPrice,
        normalizedPrice,
        outcomeLabel,
        shares,
        outcomeId,
        price
      );
    };
  }
  return (
    <div
      className={classNames(Styles.SportsOutcome, {
        [Styles.Winner]: isWinningOutcome,
      })}
    >
      {title && <h6>{title}</h6>}
      <button
        title={
          disabled ? 'No available bets at the moment' : 'add bet to betslip'
        }
        onClick={action}
        disabled={disabled}
      >
        {isWinningOutcome ? (
          <>
            {WinningMedal}
            <span>
              {topLabel && <span>{topLabel}</span>}
              <span>{label}</span>
            </span>
          </>
        ) : (
          <>
            {topLabel && <span>{topLabel}</span>}
            <span>{label}</span>
          </>
        )}
      </button>
      <span>{subLabel}</span>
    </div>
  );
};

export const OutcomeGroupFooter = ({
  market: { id, outcomesFormatted, volumeFormatted },
  showLeader = false,
}) => {
  const location = useLocation();
  const { isGroupPage } = isMarketView(location);
  let content;
  // if ShowLeader passed, info on leading outcome and total volume put in footer.
  if (showLeader || isGroupPage) {
    let leadingOutcome = outcomesFormatted[0];
    outcomesFormatted.forEach(outcome => {
      if (outcome.lastPrice.value > leadingOutcome.lastPrice.value) {
        leadingOutcome = outcome;
      }
    });
    // if no volume, there can't be a leading outcome.
    content =
      volumeFormatted.value > 0 ? (
        <p>
          {FingersCrossed}
          <b>{leadingOutcome.description}</b>
          {`is the favorite with ${volumeFormatted.full} wagered on this market`}
        </p>
      ) : null;
  } else {
    content = (
      <MarketLink id={id}>{ThickChevron} View Market Details</MarketLink>
    );
  }
  return (
    <div
      className={classNames(Styles.OutcomeGroupFooter, {
        [Styles.NoLeader]: content === null,
      })}
    >
      {content}
    </div>
  );
};

const createOutcomesData = market => {
  if (!market) return [];
  let data = [];
  market.outcomesFormatted.forEach(
    ({
      isInvalid,
      description: title,
      volumeFormatted,
      id: outcomeId,
      description: outcomeLabel,
    }) => {
      if (isInvalid) return;
      const newOutcomeData = {
        title,
        volume: volumeFormatted.full,
        outcomeId,
        outcomeLabel,
        market,
      };
      data.push(newOutcomeData);
    }
  );
  return data;
};

export const reduceToUniquePools = (acc, market) => {
  if (
    !acc.find(
      curMarkets =>
        curMarkets.sportsBook.liquidityPool === market.sportsBook.liquidityPool
    )
  ) {
    acc.push(market);
  }
  return acc;
};

export const sortByLiquidityRank = (
  { sportsBook: { liquidityRank: rankA } },
  { sportsBook: { liquidityRank: rankB } }
) => Number(rankA) - Number(rankB);

const sortByPriorityGroupType = (markets, groupType) =>
  markets.sort(
    (
      { sportsBook: { groupType: typeA, liquidityRank: rankA } },
      { sportsBook: { groupType: typeB, liquidityRank: rankB } }
    ) => {
      // for now we only care about sorting moneyline to the top
      if (typeA === groupType && typeB !== groupType) {
        return -1;
      } else if (typeB === groupType && typeA !== groupType) {
        return +1;
      } else {
        if (typeB === typeA) {
          return rankA - rankB;
        }
        return 0;
      }
    }
  );

const filterSortByGroupType = (markets, groupType) =>
  markets
    .filter(market => market.sportsBook.groupType === groupType)
    .reduce(reduceToUniquePools, [])
    .sort(sortByLiquidityRank);

const prepareCombo = sportsGroup => {
  const {
    COMBO_MONEY_LINE,
    COMBO_OVER_UNDER,
    COMBO_SPREAD,
    SPREAD,
    MONEY_LINE,
    OVER_UNDER,
  } = SPORTS_GROUP_MARKET_TYPES;
  const moneyLineMarkets = filterSortByGroupType(
    sportsGroup.markets,
    COMBO_MONEY_LINE
  );
  const spreadMarkets = filterSortByGroupType(
    sportsGroup.markets,
    COMBO_SPREAD
  );
  const overUnderMarkets = filterSortByGroupType(
    sportsGroup.markets,
    COMBO_OVER_UNDER
  );
  const topComboMarkets = {
    [SPREAD]: createOutcomesData(spreadMarkets[0]),
    [MONEY_LINE]: createOutcomesData(moneyLineMarkets[0]),
    [OVER_UNDER]: createOutcomesData(overUnderMarkets[0]),
  };
  const moneyLineMarketsExtra = moneyLineMarkets.splice(1);
  const spreadMarketsExtra = spreadMarkets.splice(1);
  const overUnderMarketsExtra = overUnderMarkets.splice(1);
  const additionalMarkets = moneyLineMarketsExtra
    .concat(spreadMarketsExtra)
    .concat(overUnderMarketsExtra)
    .map(market => createOutcomesData(market));
  const numMarkets =
    topComboMarkets[SPREAD].length +
    topComboMarkets[MONEY_LINE].length +
    topComboMarkets[OVER_UNDER].length;
  return {
    topComboMarkets,
    additionalMarkets,
    numMarkets,
  };
};

interface ReportedOutcomeProps {
  isTentative?: boolean;
  label?: string;
  value?: string;
}

export const ReportedOutcome = ({
  isTentative = false,
  value,
}: ReportedOutcomeProps) => {
  return (
    <div
      className={classNames(Styles.ReportedOutcome, {
        [Styles.Tenatative]: isTentative,
      })}
    >
      <div>
        {WinningMedal}
        <div>
          <span>{value}</span>
          <span>Winner</span>
        </div>
      </div>
      {isTentative && <span>Tenative Winner</span>}
    </div>
  );
};

export const MultiOutcomeMarketRow = ({ data }) => (
  <section
    className={classNames(Styles.MultiOutcomeMarketRow, {
      [Styles.FourOutcomes]: data.length === 4,
    })}
  >
    {data.map(outcomeData => (
      <article key={outcomeData.title}>
        <SportsOutcome {...outcomeData} />
      </article>
    ))}
  </section>
);

export const MultiOutcomeMarketGrid = ({ data }) => (
  <section className={Styles.MultiOutcomeMarketGrid}>
    {data.map(({ title, ...outcomeData }) => (
      <article key={title}>
        <h3>{title}</h3>
        <SportsOutcome {...outcomeData} />
      </article>
    ))}
  </section>
);

export interface ComboMarketContainerProps {
  data: {
    SPREAD: Array<any>;
    MONEY_LINE: Array<any>;
    OVER_UNDER: Array<any>;
  };
  sportsGroup: any;
  isGroupPage: boolean;
}

export const ComboMarketContainer = ({
  data,
  sportsGroup,
  isGroupPage = false,
}: ComboMarketContainerProps) => {
  const { SPREAD, MONEY_LINE, OVER_UNDER } = SPORTS_GROUP_MARKET_TYPES;
  const {
    sportsBook: { placeholderOutcomes },
  } = sportsGroup.markets.find(
    market => !!market?.sportsBook?.placeholderOutcomes
  );
  if (!placeholderOutcomes)
    return (
      <section>
        Something went wrong with loading this combo market container...
      </section>
    );

  return (
    <section
      className={classNames(
        Styles.ComboContainer,
        Styles.SportsMarketContainer,
        {
          [Styles.GroupPage]: isGroupPage,
        }
      )}
    >
      <header>
        <ul>
          <li></li>
          <li>Spread</li>
          <li>Moneyline</li>
          <li>Over/Under</li>
        </ul>
      </header>
      <div>
        {placeholderOutcomes.map((outcomeLabel, index) => (
          <ul key={outcomeLabel}>
            <li>{outcomeLabel}</li>
            <li>
              <SportsOutcome {...data[SPREAD][index]} title={undefined} />
            </li>
            <li>
              <SportsOutcome {...data[MONEY_LINE][index]} title={undefined} />
            </li>
            <li>
              <SportsOutcome {...data[OVER_UNDER][index]} title={undefined} />
            </li>
          </ul>
        ))}
      </div>
    </section>
  );
};

export interface SportsMarketContainerProps {
  marketId: string;
  sportsGroup: any;
  data: any;
  market: any;
  title?: string;
  startOpen?: boolean;
}

export const SportsMarketContainer = ({
  marketId,
  sportsGroup,
  data,
  market,
  title = '',
  startOpen = false,
  noHeader = false,
}) => {
  const { FUTURES } = SPORTS_GROUP_TYPES;
  const { isLogged, accountPositions } = useAppStatusStore();
  const [isCollapsed, setIsCollapsed] = useState(!startOpen);
  const location = useLocation();
  const { isGroupPage, marketId: queryId } = isMarketView(location);
  const isFutures = sportsGroup.type === FUTURES;
  const forceCollapse = isFutures && isGroupPage && marketId !== queryId;
  const marketAmount = sportsGroup.markets.length;
  useEffect(() => {
    if (isFutures) {
      const clipboardMarketId = new Clipboard('#copy_marketId');
      const clipboardAuthor = new Clipboard('#copy_author');
    }
  }, [market.id, market.author]);
  let innerContent = null;
  let headingContent = <h6>{title}</h6>;
  const isGrid = data.length > 4;
  if (isGrid) {
    innerContent = <MultiOutcomeMarketGrid key={marketId} data={data} />;
  } else {
    innerContent = <MultiOutcomeMarketRow key={marketId} data={data} />;
  }
  if (isFutures) {
    // futures
    console.log('is futures', market.endTimeFormatted);
    const { tradingPositionsPerMarket = null } =
      accountPositions[marketId] || {};
    // {tradingPositionsPerMarket && tradingPositionsPerMarket.current !== "0" && PositionIcon}
    headingContent = (
      <Fragment key={`${marketId}-heading`}>
        <CountdownProgress
          label="Event Expiration Date"
          time={market.endTimeFormatted}
          reportingState={market.reportingState}
          forceLongDate
        />
        {PositionIcon}
        <span className={Styles.MatchedLine}>
          Matched<b>{market.volumeFormatted.full}</b>
        </span>
        <DotSelection>
          <SocialMediaButtons
            listView
            marketDescription={market.description}
            marketAddress={marketId}
          />
          <div
            id="copy_marketId"
            data-clipboard-text={marketId}
            onClick={() => marketLinkCopied(marketId, MARKET_LIST_CARD)}
          >
            {CopyAlternateIcon} {COPY_MARKET_ID}
          </div>
          <div id="copy_author" data-clipboard-text={market.author}>
            {Person} {COPY_AUTHOR}
          </div>
        </DotSelection>
        <FavoritesButton marketId={marketId} hideText disabled={!isLogged} />
      </Fragment>
    );
  }

  return (
    <section
      className={classNames(Styles.SportsMarketContainer, {
        [Styles.Collapsed]:
          forceCollapse || (isCollapsed && queryId !== marketId),
        [Styles.NoHeader]: noHeader,
      })}
    >
      <header>
        {headingContent}
        {isFutures && isGroupPage ? (
          <MarketLink id={marketId}>{ThickChevron}</MarketLink>
        ) : isFutures && !isGroupPage && marketAmount < 2 ? null : (
          <button
            onClick={e => {
              e.preventDefault();
              setIsCollapsed(!isCollapsed);
            }}
          >
            {ThickChevron}
          </button>
        )}
      </header>
      <div>{innerContent}</div>
      {isGrid && <OutcomeGroupFooter market={market} />}
    </section>
  );
};

export interface SportsGroupMarketsProps {
  sportsGroup: {
    markets: Array<MarketData>;
    id: string;
    type: string;
  };
}

export const SportsGroupMarkets = ({ sportsGroup }) => {
  const location = useLocation();
  const { isGroupPage, marketId } = isMarketView(location);
  const marketGroups = prepareSportsGroup(sportsGroup, isGroupPage, marketId);
  if (marketGroups.length > 0) {
    return <>{marketGroups.map(item => item)}</>;
  }
  return <section />;
};

export const prepareSportsGroup = (
  sportsGroup,
  isGroupPage = false,
  marketId = null
) => {
  const { markets } = sportsGroup;
  const { COMBO, FUTURES } = SPORTS_GROUP_TYPES;
  const { MONEY_LINE } = SPORTS_GROUP_MARKET_TYPES;
  const { additionalMarkets, topComboMarkets, numMarkets } = prepareCombo(
    sportsGroup
  );
  let marketGroups = [];
  let sortedMarkets = sortByPriorityGroupType(markets, MONEY_LINE).reduce(
    reduceToUniquePools,
    []
  );
  if (marketId) {
    const index = sortedMarkets.findIndex(m => m.id === marketId);
    if (index >= 0) {
      const leadMarket = sortedMarkets[index];
      sortedMarkets.splice(index, 1);
      sortedMarkets.splice(0, 0, leadMarket);
    }
  }
  if (numMarkets > 0) {
    sortedMarkets = sortedMarkets.filter(
      market => !market.sportsBook.groupType.includes(COMBO)
    );
    marketGroups.push(
      <ComboMarketContainer
        data={topComboMarkets}
        sportsGroup={sportsGroup}
        key={sportsGroup.id}
        isGroupPage={isGroupPage}
      />
    );
  }
  additionalMarkets.forEach(data => {
    const { market } = data[0];
    const startOpen = marketGroups.length === 0;
    if (isGroupPage && marketGroups.length === 1) {
      marketGroups.push(
        <section
          key="relatedMarketsDivider"
          className={Styles.RelatedMarketsDivider}
        >
          <h6>Related Markets</h6>
        </section>
      );
    }
    marketGroups.push(
      <SportsMarketContainer
        key={market.id}
        data={data}
        marketId={market.id}
        market={market}
        sportsGroup={sportsGroup}
        startOpen={startOpen}
        noHeader={isGroupPage && startOpen}
        title={market.sportsBook.title}
      />
    );
  });
  sortedMarkets.forEach((market, index, array) => {
    const data = createOutcomesData(market);
    const startOpen = marketGroups.length === 0;
    if (index === 1 && sportsGroup.type === FUTURES && !isGroupPage) {
      const extraMarkets = array.length - marketGroups.length;
      marketGroups.push(
        <div
          className={Styles.FuturesDivider}
          key={`futuresDivider-${sportsGroup.id}`}
        >
          {`There are ${extraMarkets} more market${
            extraMarkets > 1 ? 's' : ''
          } related to this future event with different expiration date:`}
          {QuestionIcon}
        </div>
      );
    } else if (isGroupPage && index === 1) {
      marketGroups.push(
        <section
          key="relatedMarketsDivider"
          className={Styles.RelatedMarketsDivider}
        >
          <h6>Related Markets</h6>
        </section>
      );
    }
    marketGroups.push(
      <SportsMarketContainer
        key={market.id}
        data={data}
        marketId={market.id}
        market={market}
        sportsGroup={sportsGroup}
        startOpen={startOpen}
        noHeader={isGroupPage && startOpen}
        title={market.sportsBook.title}
      />
    );
  });
  return marketGroups;
};

export interface OutcomeGroupProps {
  market: MarketData;
  expanded?: Boolean;
  showOutcomeNumber: number;
  canDispute: boolean;
  canSupport: boolean;
  forkingMarket?: boolean;
}

export const OutcomeGroup = ({
  expanded,
  showOutcomeNumber,
  canDispute,
  canSupport,
  market,
  forkingMarket,
}: OutcomeGroupProps) => {
  const {
    description,
    outcomesFormatted,
    marketType,
    scalarDenomination,
    minPriceBigNumber,
    maxPriceBigNumber,
    disputeInfo,
    id,
    reportingState,
    creationTimeFormatted,
    isWarpSync,
  } = market;

  const inDispute =
    reportingState === REPORTING_STATE.CROWDSOURCING_DISPUTE ||
    reportingState === REPORTING_STATE.AWAITING_NEXT_WINDOW;
  const stakes = disputeInfo?.stakes;
  const { theme } = useAppStatusStore();

  const sortedStakeOutcomes = selectSortedDisputingOutcomes(
    marketType,
    outcomesFormatted,
    stakes,
    isWarpSync
  );
  const isScalar = marketType === SCALAR;
  const isTrading = theme === THEMES.TRADING;
  let disputingOutcomes = sortedStakeOutcomes;
  let outcomesCopy = outcomesFormatted.slice(0);
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
    if (!expanded && outcomesFormatted.length > showOutcomeNumber) {
      outcomesCopy.splice(showOutcomeNumber - 1);
    } else if (marketType === YES_NO) {
      outcomesCopy.reverse().splice(outcomesCopy.length);
    } else {
      outcomesCopy.splice(outcomesCopy.length);
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
            min={minPriceBigNumber}
            max={maxPriceBigNumber}
            lastPrice={
              outcomesFormatted[SCALAR_UP_ID].price
                ? formatNumber(outcomesFormatted[SCALAR_UP_ID].price)
                : null
            }
            scalarDenomination={scalarDenomination}
            marketId={id}
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
              min={minPriceBigNumber}
              max={maxPriceBigNumber}
              isScalar={isScalar}
              marketId={id}
              outcomeId={String(INVALID_OUTCOME_ID)}
              isTrading={isTrading}
            />
          )}
        </>
      )}
      {(!isScalar || inDispute) &&
        reportingState !== MarketReportingState.Unknown &&
        outcomesShow.map((outcome: OutcomeFormatted, index: number) =>
          ((!expanded && index < showOutcomeNumber) ||
            expanded ||
            marketType === YES_NO) &&
          inDispute &&
          !!stakes.find(stake => parseFloat(stake.outcome) === outcome.id) ? (
            <Fragment key={id + outcome.id + index}>
              {marketType === SCALAR && index === 1 && expanded && (
                <ScalarBlankDisputeOutcome
                  denomination={scalarDenomination}
                  canDispute={canDispute}
                  market={market}
                  otherOutcomes={outcomesShow.map(o => String(o.id))}
                />
              )}
              <DisputeOutcome
                key={outcome.id}
                marketId={id}
                description={outcome.description}
                invalid={outcome.isInvalid}
                index={index > 2 ? index : index + 1}
                stake={stakes.find(
                  stake =>
                    parseFloat(stake.outcome) === outcome.id &&
                    stake.isInvalidOutcome === outcome.isInvalid
                )}
                id={outcome.id}
                canDispute={canDispute}
                canSupport={canSupport}
                isWarpSync={isWarpSync}
                forkingMarket={forkingMarket}
              />
            </Fragment>
          ) : (
            <Outcome
              key={outcome.id}
              description={outcome.description}
              lastPricePercent={outcome.lastPricePercent}
              invalid={outcome.isInvalid}
              index={index > 2 ? index : index + 1}
              min={minPriceBigNumber}
              max={maxPriceBigNumber}
              isScalar={isScalar}
              marketId={id}
              outcomeId={String(outcome.id)}
              isTrading={isTrading}
            />
          )
        )}
      {isScalar && inDispute && !expanded && (
        <ScalarBlankDisputeOutcome
          denomination={scalarDenomination}
          canDispute={canDispute}
          market={market}
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
  <div
    className={Styles.HoverIcon}
    data-tip
    data-for={`tooltip-${id}${label}`}
    data-iscapture={true}
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
  if (!consensusFormatted) return null;
  const outcomesFiltered = outcomes.filter(
    outcome => String(outcome.id) !== consensusFormatted.outcome
  );

  return (
    <div className={Styles.ResolvedOutcomes}>
      <span>Winning Outcome {CheckCircleIcon} </span>
      <span>
        {consensusFormatted.invalid
          ? INVALID_OUTCOME_LABEL
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
  market: MarketData;
  canDispute: boolean;
  isForkingMarket?: boolean;
}

export const TentativeWinner = ({
  market,
  canDispute,
  isForkingMarket,
}: TentativeWinnerProps) => {
  const {
    actions: { setModal },
  } = useAppStatusStore();
  const tentativeWinner = market.disputeInfo.stakes.find(
    stake => stake.tentativeWinning
  );
  return (
    <div
      className={classNames(Styles.ResolvedOutcomes, Styles.TentativeWinner, {
        [Styles.forking]: isForkingMarket,
      })}
    >
      {!isForkingMarket && (
        <>
          <span>Tentative Winner</span>
          <span>
            {tentativeWinner.isInvalidOutcome
              ? INVALID_OUTCOME_LABEL
              : getOutcomeNameWithOutcome(
                  market,
                  tentativeWinner.outcome,
                  tentativeWinner.isInvalidOutcome,
                  true
                )}
          </span>
        </>
      )}
      <ProcessingButton
        small
        queueName={SUBMIT_DISPUTE}
        queueId={market.id}
        secondaryButton
        disabled={!canDispute}
        text={
          isForkingMarket
            ? "Migrate Rep to an Outcome's Universe"
            : 'SUPPORT OR DISPUTE OUTCOME'
        }
        action={() =>
          setModal({
            type: MODAL_REPORTING,
            market,
            selectedOutcome: undefined,
            isInvalid: undefined,
          })
        }
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
}

export const TopRow = ({ market, categoriesWithClick }) => {
  useEffect(() => {
    const clipboardMarketId = new Clipboard('#copy_marketId');
    const clipboardAuthor = new Clipboard('#copy_author');
  }, [market.id, market.author]);
  const { theme, isLogged } = useAppStatusStore();
  const {
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
    sportsBook: { groupType },
  } = market;
  const isScalar = marketType === SCALAR;
  const isFutures = groupType === SPORTS_GROUP_TYPES.FUTURES;
  return (
    <div
      className={classNames(Styles.TopRow, {
        [Styles.scalar]: isScalar,
        [Styles.template]: isTemplate,
        [Styles.invalid]: mostLikelyInvalid,
        [Styles.futures]: isFutures,
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
      {theme !== THEMES.TRADING ? (
        <>
          <span className={Styles.MatchedLine}>
            Matched<b>{` ${volumeFormatted.full}`}</b>
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
          endTimeFormatted={endTimeFormatted}
          reportingWindowEndTime={disputeInfo.disputeWindow.endTime}
        />
      )}
      <FavoritesButton marketId={id} hideText disabled={!isLogged} />
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
}

export const InfoIcons = ({ market }: InfoIconsProps) => {
  const {
    loginAccount: { address },
    accountPositions,
  } = useAppStatusStore();
  const { id, designatedReporter, author } = market;
  const hasPosition = !!accountPositions[id];
  const hasStaked = hasStakeInMarket(id);
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
  market: MarketData;
  condensed: boolean;
}

export const TradingSideSection = ({
  market,
  condensed,
}: TradingSideSectionProps) => {
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
        <InfoIcons market={market} />
      </div>
      <MarketProgress
        reportingState={reportingState}
        endTimeFormatted={endTimeFormatted}
        reportingWindowEndTime={disputeInfo.disputeWindow.endTime}
      />
    </div>
  );
};

export function getCategoriesWithClick(categories, history) {
  const path = { pathname: makePath(MARKETS) };
  const categoriesLowerCased =
    categories && categories.map(item => item.toLowerCase());
  const categoriesWithClick =
    categoriesLowerCased &&
    categoriesLowerCased.filter(Boolean).map((label, idx) => ({
      label,
      onClick: toggleCategory(
        categoriesLowerCased.slice(0, idx + 1).toString(),
        path,
        history
      ),
    }));
  return categoriesWithClick;
}
