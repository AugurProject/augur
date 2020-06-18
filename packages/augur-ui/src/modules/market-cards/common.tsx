import React, { useEffect, useState, Fragment } from 'react';
import classNames from 'classnames';
import Clipboard from 'clipboard';

import MarketLink from 'modules/market/components/market-link/market-link';
import { FavoritesButton } from 'modules/common/buttons';
import { DotSelection } from 'modules/common/selection';
import { MarketProgress } from 'modules/common/progress';
import SocialMediaButtons from 'modules/market/components/common/social-media-buttons';
import {
  INVALID_OUTCOME_ID,
  SCALAR,
  SCALAR_UP_ID,
  YES_NO,
  ZERO,
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
import { convertToOdds } from 'utils/get-odds';
import { MARKET_LIST_CARD, marketLinkCopied } from 'services/analytics/helpers';
import { useAppStatusStore } from 'modules/app/store/app-status';
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
  WinningMedal,
  ThickChevron,
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
import { useBetslipStore } from 'modules/trading/store/betslip';
import { MARKETS } from 'modules/routes/constants/views';
import makePath from 'modules/routes/helpers/make-path';
import toggleCategory from 'modules/routes/helpers/toggle-category';
import { useMarketsStore } from 'modules/markets/store/markets';
import { hasStakeInMarket } from 'modules/account/helpers/common';

export interface PercentProps {
  percent: number;
}

export const Percent = ({ percent }: PercentProps) => (
  <div className={Styles.Percent}>
    <span style={{ width: percent + '%' }}></span>
  </div>
);

const DAILY_MOCK_DATA = (addBet, marketId, description) => [
  {
    title: 'Team A',
    action: () => addBet(marketId, description, '+132', 'Team A', '0'),
    topLabel: null,
    label: '+132',
    volume: '$100.43',
  },
  {
    title: 'Draw',
    action: () => addBet(marketId, description, '+200', 'Draw', '0'),
    topLabel: null,
    label: '+200',
    volume: '$100.43',
  },
  {
    title: 'Team B',
    action: () => addBet(marketId, description, '+150', 'Team B', '0'),
    topLabel: null,
    label: '+150',
    volume: '$100.43',
  },
  {
    title: 'Game Canceled',
    action: () => addBet(marketId, description, '+200', 'Game Canceled', '0'),
    topLabel: null,
    label: '+200',
    volume: '$100.43',
  },
];

const FUTURES_GRID_MOCK_DATA = (addBet, marketId, description) => [
  {
    title: 'Man City',
    topLabel: null,
    action: () => addBet(marketId, description, '+310', 'Man City', '0'),
    label: '+310',
    volume: '$100.43',
  },
  {
    title: 'Liverpool',
    topLabel: null,
    action: () => addBet(marketId, description, '+530', 'Liverpool', '0'),
    label: '+530',
    volume: '$100.43',
  },
  {
    title: 'Bayern Munich',
    topLabel: null,
    action: () => addBet(marketId, description, '+440', 'Bayern Munich', '0'),
    label: '+440',
    volume: '$100.43',
  },
  {
    title: 'Barcelona',
    topLabel: null,
    action: () => addBet(marketId, description, '+550', 'Barcelona', '0'),
    label: '+550',
    volume: '$100.43',
  },
  {
    title: 'PSG',
    topLabel: null,
    action: () => addBet(marketId, description, '+540', 'PSG', '0'),
    label: '+540',
    volume: '$100.43',
  },
  {
    title: 'Juventus',
    topLabel: null,
    action: () => addBet(marketId, description, '+730', 'Juventus', '0'),
    label: '+730',
    volume: '$100.43',
  },
  {
    title: 'Other',
    topLabel: null,
    action: () => addBet(marketId, description, '+490', 'Other', '0'),
    label: '+490',
    volume: '$100.43',
  },
  {
    title: 'Event Canceled',
    topLabel: null,
    action: () => addBet(marketId, description, '+1000', 'Event Canceled', '0'),
    label: '+1000',
    volume: '$100.43',
  },
];

const SUB_MARKET_MOCK_DATA = (addBet, marketId, description) => [
  {
    title: 'O 230.5',
    action: () => addBet(marketId, description, '-105', 'O 230.5', '0'),
    topLabel: null,
    label: '-105',
    volume: '$100.43',
  },
  {
    title: 'U 230.5',
    action: () => addBet(marketId, description, '-115', 'U 230.5', '0'),
    topLabel: null,
    label: '-115',
    volume: '$100.43',
  },
  {
    title: 'Game Cancelled',
    action: () => addBet(marketId, description, '-128', 'Game Cancelled', '0'),
    topLabel: null,
    label: '-128',
    volume: '$100.43',
  },
];

const COMBO_MOCK_DATA = (marketId, addBet, description) => [
  {
    title: 'Team A',
    spread: {
      topLabel: '+ 3.5',
      label: '-110',
      action: () => addBet(marketId, description, '-110', 'Team A', '0'),
      volume: '$5,000.43',
    },
    moneyLine: {
      topLabel: null,
      label: '+132',
      action: () => addBet(marketId, description, '+132', 'Team A', '0'),
      volume: '$6,500.12',
    },
    overUnder: {
      topLabel: 'O 227.5',
      label: '-110',
      action: () => addBet(marketId, description, '-110', 'Team A', '0'),
      volume: '$2,542.00',
    },
  },
  {
    title: 'Team B',
    spread: {
      topLabel: '- 3.5',
      label: '-110',
      action: () => addBet(marketId, description, '-110', 'Team B', '0'),
      volume: '$6,093.50',
    },
    moneyLine: {
      topLabel: null,
      label: '-156',
      action: () => addBet(marketId, description, '-156', 'Team B', '0'),
      volume: '$10,000.54',
    },
    overUnder: {
      topLabel: 'U 227.5',
      label: '-110',
      action: () => addBet(marketId, description, '-110', 'Team B', '0'),
      volume: '$5,000.18',
    },
  },
  {
    title: 'No Winner',
    spread: {
      topLabel: null,
      label: '-110',
      action: () => addBet(marketId, description, '-110', 'No Winner', '0'),
      volume: '$500.70',
    },
    moneyLine: {
      topLabel: null,
      label: '-157',
      action: () => addBet(marketId, description, '-157', 'No Winner', '0'),
      volume: '$740.98',
    },
    overUnder: {
      topLabel: null,
      label: '-110',
      action: () => addBet(marketId, description, '-110', 'No Winner', '0'),
      volume: '$540.50',
    },
  },
];

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

const processComboMarketData = ({ id, type, markets }, orderBooks, addBet) => {
  const {
    COMBO_MONEY_LINE,
    COMBO_OVER_UNDER,
    COMBO_SPREAD,
  } = SPORTS_GROUP_MARKET_TYPES;
  const moneyLineMarket = markets.find(
    market => market.sportsBook.groupType === COMBO_MONEY_LINE
  );
  const spreadMarket = markets.find(
    market => market.sportsBook.groupType === COMBO_SPREAD
  );
  const overUnderMarket = markets.find(
    market => market.sportsBook.groupType === COMBO_OVER_UNDER
  );
  let data = [];
  if (!moneyLineMarket && !spreadMarket && !overUnderMarket) {
    data = COMBO_MOCK_DATA(markets[0].id, addBet, markets[0].description);
  } else {
    if (moneyLineMarket) {
      moneyLineMarket.outcomesFormatted.forEach(outcome => {
        if (outcome.isInvalid) return;
        const outcomeObject = {
          title: outcome.description,
          spread: {
            topLabel: null,
            label: '-',
            action: () =>
              addBet(
                spreadMarket.id,
                spreadMarket.description,
                '0',
                outcome.description,
                '0'
              ),
            volume: outcome.volumeFormatted.full,
          },
          moneyLine: {
            topLabel: null,
            label: '-',
            action: () =>
              addBet(
                moneyLineMarket.id,
                moneyLineMarket.description,
                '0',
                outcome.description,
                '0'
              ),
            volume: outcome.volumeFormatted.full,
          },
          overUnder: {
            topLabel: null,
            label: '-',
            action: () =>
              addBet(
                overUnderMarket.id,
                overUnderMarket.description,
                '0',
                outcome.description,
                '0'
              ),
            volume: outcome.volumeFormatted.full,
          },
        };
        data.push(outcomeObject);
      });
    } else if (spreadMarket) {
      spreadMarket.outcomesFormatted.forEach(outcome => {
        if (outcome.isInvalid) return;
        const outcomeObject = {
          title: outcome.description,
          spread: {
            topLabel: null,
            label: '-',
            action: () =>
              addBet(
                spreadMarket.id,
                spreadMarket.description,
                '0',
                outcome.description,
                '0'
              ),
            volume: outcome.volumeFormatted.full,
          },
          moneyLine: {
            topLabel: null,
            label: '-',
            action: () =>
              addBet(
                moneyLineMarket.id,
                moneyLineMarket.description,
                '0',
                outcome.description,
                '0'
              ),
            volume: outcome.volumeFormatted.full,
          },
          overUnder: {
            topLabel: null,
            label: '-',
            action: () =>
              addBet(
                overUnderMarket.id,
                overUnderMarket.description,
                '0',
                outcome.description,
                '0'
              ),
            volume: outcome.volumeFormatted.full,
          },
        };
        data.push(outcomeObject);
      });
    } else if (overUnderMarket) => {
      overUnderMarket.outcomesFormatted.forEach(outcome => {
        if (outcome.isInvalid) return;
        const outcomeObject = {
          title: outcome.description,
          spread: {
            topLabel: null,
            label: '-',
            action: () =>
              addBet(
                spreadMarket.id,
                spreadMarket.description,
                '0',
                outcome.description,
                '0'
              ),
            volume: outcome.volumeFormatted.full,
          },
          moneyLine: {
            topLabel: null,
            label: '-',
            action: () =>
              addBet(
                moneyLineMarket.id,
                moneyLineMarket.description,
                '0',
                outcome.description,
                '0'
              ),
            volume: outcome.volumeFormatted.full,
          },
          overUnder: {
            topLabel: null,
            label: '-',
            action: () =>
              addBet(
                overUnderMarket.id,
                overUnderMarket.description,
                '0',
                outcome.description,
                '0'
              ),
            volume: outcome.volumeFormatted.full,
          },
        };
        data.push(outcomeObject);
      });
    }
  }
  return data;
};

const processMultiMarketTableData = (
  orderBook,
  outcomes,
  min,
  max,
  addBet,
  description
) => {
  const marketId = outcomes[0].marketId;
  if (!orderBook || orderBook?.asks) {
    // this might change, shortcut
    return COMBO_MOCK_DATA(marketId, addBet, description);
  }
  let data = [];
  outcomes.forEach(outcome => {
    const outcomeObject = {
      title: 'default',
      spread: {
        topLabel: null,
        label: '-110',
        action: () =>
          addBet(marketId, description, '-110', outcome.description, '0'),
        volume: '$500.70',
      },
      moneyLine: {
        topLabel: null,
        label: '-157',
        action: () =>
          addBet(marketId, description, '-157', outcome.description, '0'),
        volume: '$740.98',
      },
      overUnder: {
        topLabel: null,
        label: '-110',
        action: () =>
          addBet(marketId, description, '-110', outcome.description, '0'),
        volume: '$540.50',
      },
    };
    if (orderBook?.[outcome.id]?.[ASKS]?.[0]) {
      const book = orderBook[outcome.id];
      const { price, amount } = book[ASKS][0];
      const odds = convertToOdds({
        price,
        min,
        max,
        type: ASKS,
      });
      const OddToUse = odds[ODDS_TYPE.AMERICAN];
      outcomeObject.title = outcome.description;
      outcomeObject.spread.label = OddToUse;
      outcomeObject.spread.action = () =>
        addBet(marketId, description, OddToUse, outcome.description, amount);
      outcomeObject.moneyLine.label = OddToUse;
      outcomeObject.moneyLine.action = () =>
        addBet(marketId, description, OddToUse, outcome.description, amount);
      outcomeObject.overUnder.label = OddToUse;
      outcomeObject.overUnder.action = () =>
        addBet(marketId, description, OddToUse, outcome.description, amount);
      data.push(outcomeObject);
    }
  });
  return data;
};

function processDailyMarketData(
  orderBook,
  outcomes,
  min,
  max,
  addBet,
  description
) {
  const marketId = outcomes[0].marketId;
  // console.log(outcomes, orderBook);
  let data = [];
  if (outcomes.length > 0) {
    outcomes.forEach(outcome => {
      // addBet: (marketId, description, odds, outcome, wager = "0")
      if (outcome.isInvalid) return;
      data.push({
        title: outcome.description,
        topLabel: null,
        action: () =>
          addBet(marketId, description, '0', outcome.description, '0'),
        label: '-',
        volume: outcome.volumeFormatted.full,
      });
    });
  } else {
    data = DAILY_MOCK_DATA(addBet, marketId, description);
  }
  return data;
}

function processFuturesGridData(
  orderBook,
  outcomes,
  min,
  max,
  addBet,
  description
) {
  const marketId = outcomes[0].marketId;
  let data = [];
  if (outcomes.length > 0) {
    outcomes.forEach(outcome => {
      // addBet: (marketId, description, odds, outcome, wager = "0")
      if (outcome.isInvalid) return;
      data.push({
        title: outcome.description,
        topLabel: null,
        action: () =>
          addBet(marketId, description, '0', outcome.description, '0'),
        label: '-',
        volume: outcome.volumeFormatted.full,
      });
    });
  } else {
    data = FUTURES_GRID_MOCK_DATA(addBet, marketId, description);
  }
  return data;
}

function processSubMarketCollapsibleData(
  orderBook,
  outcomes,
  min,
  max,
  addBet,
  description
) {
  const marketId = outcomes[0].marketId;
  let data = [];
  if (outcomes.length > 0) {
    outcomes.forEach(outcome => {
      // addBet: (marketId, description, odds, outcome, wager = "0")
      if (outcome.isInvalid) return;
      data.push({
        title: outcome.description,
        topLabel: null,
        action: () =>
          addBet(marketId, description, '0', outcome.description, '0'),
        label: '-',
        volume: outcome.volumeFormatted.full,
      });
    });
  } else {
    data = SUB_MARKET_MOCK_DATA(addBet, marketId, description);
  }
  return data;
}

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

export const MultiOutcomeMarketTable = ({
  marketTitle,
  multiOutcomeMarketTableData,
}) => (
  <section className={Styles.MultiOutcomeMarketTable}>
    <h5>{marketTitle}</h5>
    <ul>
      {multiOutcomeMarketTableData.map(({ ...outcomeData }) => (
        <li key={outcomeData.title}>
          <SportsOutcome {...outcomeData} />
        </li>
      ))}
    </ul>
  </section>
);

export const MultiOutcomeMarketGrid = ({ multiOutcomeMarketGridData }) => (
  <section className={Styles.MultiOutcomeMarketGrid}>
    {multiOutcomeMarketGridData.map(({ title, ...outcomeData }) => (
      <article key={title}>
        <h3>{title}</h3>
        <SportsOutcome {...outcomeData} />
      </article>
    ))}
  </section>
);

export const MultiMarketTable = ({ comboMarketData }) => {
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
        {comboMarketData.map(({ title, spread, moneyLine, overUnder }) => (
          <article key={title}>
            <h3>{title}</h3>
            <SportsOutcome {...spread} />
            <SportsOutcome {...moneyLine} />
            <SportsOutcome {...overUnder} />
          </article>
        ))}
      </>
    </section>
  );
};

export const SubMarketCollapsible = ({
  marketId,
  title,
  SubMarketCollapsibleData,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  // console.log('subMarketcollapsable', SubMarketCollapsibleData, SubMarketCollapsibleData.length);
  return (
    <section
      className={classNames(Styles.SubMarketCollapsible, {
        [Styles.Collapsed]: isCollapsed,
      })}
    >
      <div>
        <h6>{title}</h6>
        <button onClick={() => setIsCollapsed(!isCollapsed)}>
          {ThickChevron}
        </button>
      </div>
      <div>
        {SubMarketCollapsibleData.length <= 3 ? (
          SubMarketCollapsibleData.map(({ title, ...outcomeData }) => (
            <article key={title}>
              <h3>{title}</h3>
              <SportsOutcome {...outcomeData} />
            </article>
          ))
        ) : (
          <MultiOutcomeMarketGrid
            key={marketId}
            multiOutcomeMarketGridData={SubMarketCollapsibleData}
          />
        )}
      </div>
    </section>
  );
};

export interface SportsOutcomeProps {
  action: Function;
  topLabel?: string;
  label?: string;
  volume?: string;
  title?: string;
}

export const SportsOutcome = ({
  action,
  topLabel,
  label,
  volume,
  title,
}: SportsOutcomeProps) => (
  <div className={Styles.SportsOutcome}>
    {title && <h6>{title}</h6>}
    <button onClick={() => action()}>
      {topLabel && <span>{topLabel}</span>}
      <span>{label}</span>
    </button>
    <span>{volume}</span>
  </div>
);

export const prepareSportsGroup = (
  { id, type, markets },
  orderBooks,
  addBet
) => {
  const { FUTURES, DAILY, COMBO } = SPORTS_GROUP_TYPES;
  let marketGroups = [];
  switch (type) {
    case FUTURES: {
      markets.forEach(market => {
        const {
          id,
          outcomesFormatted,
          minPriceBigNumber: min,
          maxPriceBigNumber: max,
          description,
        } = market;
        const orderBook = orderBooks[id]?.orderBook;
        const multiOutcomeMarketGridData = processFuturesGridData(
          orderBook,
          outcomesFormatted,
          min,
          max,
          addBet,
          description
        );
        marketGroups.push(
          <MultiOutcomeMarketGrid
            key={id}
            multiOutcomeMarketGridData={multiOutcomeMarketGridData}
          />
        );
      });
      break;
    }
    case DAILY: {
      // TODO: fix to use a constant for money line
      const mainMarket = markets.find(
        market =>
          market.sportsBook.groupType === SPORTS_GROUP_MARKET_TYPES.MONEY_LINE
      );
      const mainMarketId = mainMarket.id;
      const dailyMarketData = processDailyMarketData(
        orderBooks[mainMarketId]?.orderBook,
        mainMarket.outcomesFormatted,
        mainMarket.minPriceBigNumber,
        mainMarket.maxPriceBigNumber,
        addBet,
        mainMarket.description
      );
      marketGroups.push(
        <MultiOutcomeMarketTable
          key={id}
          marketTitle={mainMarket.sportsBook.title || mainMarket.description}
          multiOutcomeMarketTableData={dailyMarketData}
        />
      );
      markets.forEach(market => {
        if (market.id === mainMarketId) return;
        const {
          id,
          outcomesFormatted,
          minPriceBigNumber: min,
          maxPriceBigNumber: max,
          description,
          sportsBook,
        } = market;
        const orderBook = orderBooks[id]?.orderBook;
        const subMarketData = processSubMarketCollapsibleData(
          orderBook,
          outcomesFormatted,
          min,
          max,
          addBet,
          description
        );
        marketGroups.push(
          <SubMarketCollapsible
            key={id}
            marketId={id}
            title={sportsBook.title || description}
            SubMarketCollapsibleData={subMarketData}
          />
        );
      });
      break;
    }
    case COMBO: {
      const data = processComboMarketData(
        { id, type, markets },
        orderBooks,
        addBet
      );
      marketGroups.push(<MultiMarketTable key={id} comboMarketData={data} />);
      break;
    }
    default:
      break;
  }
  return marketGroups;
};

export interface SportsGroupMarketsProps {
  sportsGroup: {
    markets: Array<MarketData>;
    id: string;
    type: string;
  };
}

export const SportsGroupMarkets = ({ sportsGroup }) => {
  const { orderBooks } = useMarketsStore();
  const {
    actions: { addBet },
  } = useBetslipStore();
  const marketGroups = prepareSportsGroup(sportsGroup, orderBooks, addBet);
  if (marketGroups.length > 0) {
    return <>{marketGroups.map(item => item)}</>;
  }
  return <section />;
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
  const { orderBooks } = useMarketsStore();
  const orderBook = orderBooks[id]?.orderBook;

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
        outcomesShow.map(
          (outcome: OutcomeFormatted, index: number) =>
            ((!expanded && index < showOutcomeNumber) ||
              expanded ||
              marketType === YES_NO) &&
            (inDispute &&
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
            ))
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

export function getCategoriesWithClick(categories) {
  const path = { pathname: makePath(MARKETS) };
  const categoriesLowerCased = categories.map(item => item.toLowerCase());
  const categoriesWithClick = categoriesLowerCased
    .filter(Boolean)
    .map((label, idx) => ({
      label,
      onClick: toggleCategory(
        categoriesLowerCased.slice(0, idx + 1).toString(),
        path,
        history
      ),
    }));
  return categoriesWithClick;
}
