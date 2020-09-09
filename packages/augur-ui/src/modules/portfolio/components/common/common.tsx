import React from 'react';
import { useHistory } from 'react-router';
import {
  TemplateShield,
  InReportingLabel,
  LinearPropertyLabel,
  RedFlag,
} from 'modules/common/labels';
import { CategoryTagTrail } from 'modules/common/labels';
import { getCategoriesWithClick } from 'modules/market-cards/common';
import { MarketProgress, CountdownProgress } from 'modules/common/progress';
import { convertUnixToFormattedDate } from 'utils/format-date';
import { MyBetsRow } from 'modules/common/table-rows';

import Styles from 'modules/portfolio/components/common/common.styles.less';
import { SPORTS_GROUP_TYPES, TABLET_MAX, ZERO } from 'modules/common/constants';
import Media from 'react-media';
import { CashoutButton, PrimaryButton } from 'modules/common/buttons';
import MarketLink from 'modules/market/components/market-link/market-link';
import { convertToOdds } from 'utils/get-odds';
import { formatDai } from 'utils/format-number';
import { useBetslipStore } from 'modules/trading/store/betslip';
import { useAppStatusStore } from 'modules/app/store/app-status';
import { createBigNumber } from 'utils/create-big-number';
import { startClaimingMarketsProceeds } from 'modules/positions/actions/claim-markets-proceeds';
import { FilterNotice } from 'modules/common/filter-notice';
import { BET_STATUS } from 'modules/trading/store/constants';

export const BetsHeader = () => (
  <ul className={Styles.BetsHeader}>
    <li>Outcome</li>
    <li>Wager</li>
    <li>Odds</li>
    <li>To win</li>
    <li>Bet date</li>
  </ul>
);

export const ClaimWinnings = () => {
  const { matched } = useBetslipStore();
  const {
    accountPositions: positions,
    loginAccount: { address: account },
  } = useAppStatusStore();

  let totalProceeds = ZERO;
  let claimableMarkets = [];

  Object.keys(matched.items).map(marketId => {
    let marketIsClaimable = false;
    const market = matched.items[marketId];
    const bet = market.orders[0];
    if (positions[bet.marketId]) {
      const marketPosition = positions[bet.marketId];
      const unclaimedProceeds = createBigNumber(
        marketPosition.tradingPositionsPerMarket.unclaimedProceeds
      );
      if (unclaimedProceeds.gt(ZERO)) {
        totalProceeds = totalProceeds.plus(unclaimedProceeds);
        marketIsClaimable = true;
      }
    }
    if (marketIsClaimable) claimableMarkets.push(marketId);
  });

  if (totalProceeds.lte(ZERO)) return <div />;

  return (
    <FilterNotice
      showDismissButton={false}
      show
      color="active"
      content={
        <div className={Styles.ClaimWinnings}>
          <span>
            You have <b>{formatDai(totalProceeds).full}</b> in winnings to
            claim.
          </span>
          <PrimaryButton
            text="Claim Bets"
            action={() =>
              startClaimingMarketsProceeds(claimableMarkets, account, () => {})
            }
          />
        </div>
      }
    />
  );
};

export interface GameProps {
  row: Object;
  type: string;
}
export const Game = ({ row, type }: GameProps) => {
  const history = useHistory();
  const isDaily = type !== SPORTS_GROUP_TYPES.FUTURES;
  return (
    <div className={Styles.Game}>
      <div>
        <TemplateShield market={row} />
        <InReportingLabel
          reportingState={row.reportingState}
          disputeInfo={null}
        />
        <CategoryTagTrail
          categories={getCategoriesWithClick(row.categories, history)}
        />
        {isDaily ? (
          <CountdownProgress
            alignRight
            label="Estimated Event Start Time"
            value={convertUnixToFormattedDate(row.startTime).formattedUtc}
          />
        ) : (
          <CountdownProgress
            alignRight
            label="Event Expiration Time"
            value={convertUnixToFormattedDate(row.endTime).formattedUtc}
          />
        )}
        <MarketLink id={row.id}>
          <span>{row.description}</span>
        </MarketLink>
      </div>
      <div>
        <BetsHeader />
        {Object.values(row.orders)
          .sort((a, b) => b.timestamp - a.timestamp)
          .map((order, index) => (
            <BetRow
              key={`${order.outcomeId}_${index}`}
              outcome={order}
              showExtraRow={isDaily}
            />
          ))}
      </div>
    </div>
  );
};
export interface OutcomesProps {
  rows: Object[];
}

export const Outcomes = ({ rows }: OutcomesProps) => (
  <div className={Styles.Outcomes}>
    <BetsHeader />
    {rows
      .sort((a, b) => b.timestamp - a.timestamp)
      .map(row => (
        <BetRow key={row.outcome} outcome={row} showExtraRow isEvent />
      ))}
  </div>
);

export interface BetRowProps {
  outcome: Object;
  showExtraRow?: Boolean;
  isEvent?: Boolean;
}

export const BetRow = ({ outcome, showExtraRow, isEvent }: BetRowProps) => (
  <Media query={TABLET_MAX}>
    {matches =>
      matches ? (
        <div className={Styles.BetRowMobile}>
          <div>
            <span>{outcome.outcome}</span>
            <span>{convertToOdds(outcome.normalizedPrice).full}</span>
            {showExtraRow && (
              <span>
                {isEvent && <TemplateShield market={outcome} />}
                {outcome.highRisk && (
                  <RedFlag market={{ mostLikelyInvalid: true, id: 0 }} />
                )}
                <span>
                  {isEvent ? outcome.description : outcome.sportsBook?.title}
                </span>
              </span>
            )}
          </div>
          <LinearPropertyLabel
            highlight
            key="wager"
            label="Wager"
            value={outcome.wager}
            useFull={true}
          />
          <LinearPropertyLabel
            highlight
            key="toWin"
            label="To win"
            value={outcome.toWin}
            useFull={true}
          />
          <LinearPropertyLabel
            highlight
            key="date"
            label="Date"
            value={convertUnixToFormattedDate(outcome.dateUpdated).formattedUtc}
            useFull={true}
          />
          <CashoutButton bet={outcome} />
        </div>
      ) : (
        <MyBetsRow
          outcome={outcome}
          showExtraRow={showExtraRow}
          isEvent={isEvent}
        />
      )
    }
  </Media>
);
