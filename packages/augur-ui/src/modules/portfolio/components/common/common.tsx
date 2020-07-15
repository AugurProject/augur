import React from 'react';
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
import { FUTURES, TABLET_MAX } from 'modules/common/constants';
import Media from 'react-media';
import { CashoutButton } from 'modules/common/buttons';
import MarketLink from 'modules/market/components/market-link/market-link';
import { convertToOdds } from 'utils/get-odds';
import { formatNumber } from 'utils/format-number';

export const BetsHeader = () => (
  <ul className={Styles.BetsHeader}>
    <li>Outcome</li>
    <li>Wager</li>
    <li>Odds</li>
    <li>To win</li>
    <li>Bet date</li>
  </ul>
);

export interface GameProps {
  row: Object;
  type: string;
}
export const Game = ({ row, type }: GameProps) => (
  <div className={Styles.Game}>
    <div>
      <TemplateShield market={row} />
      <InReportingLabel
        reportingState={row.reportingState}
        disputeInfo={null}
      />
      <CategoryTagTrail categories={getCategoriesWithClick(row.categories)} />
      {row.startTime ? 
        <CountdownProgress
          alignRight
          label="Estimated Event Start Time"
          value={row.startTime}
        />
      : <span/>}
      <MarketLink id={row.id}>
        <span>{row.description}</span>
      </MarketLink>
    </div>
    <div>
      <BetsHeader />
      {Object.values(row.orders).map(order => (
        <BetRow
          key={order.outcomeId}
          outcome={order}
          showExtraRow={type !== FUTURES}
        />
      ))}
    </div>
  </div>
);

export interface OutcomesProps {
  rows: Object[];
}

export const Outcomes = ({ rows }: OutcomesProps) => (
  <div className={Styles.Outcomes}>
    <BetsHeader />
    {rows.map(row => (
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
            <span>{convertToOdds(outcome.normalizedPrice).fullPrecision}</span>
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
            value={outcome.dateUpdated.formattedLocalShortWithUtcOffsetWithoutSeconds}
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
