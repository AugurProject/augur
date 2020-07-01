import React from 'react';
import {
  TemplateShield,
  InReportingLabel,
  LinearPropertyLabel,
  RedFlag,
} from 'modules/common/labels';
import { CategoryTagTrail } from 'modules/common/labels';
import { getCategoriesWithClick } from 'modules/market-cards/common';
import { MarketProgress } from 'modules/common/progress';
import { convertUnixToFormattedDate } from 'utils/format-date';
import { MyBetsRow } from 'modules/common/table-rows';

import Styles from 'modules/portfolio/components/common/common.styles.less';
import { FUTURES, TABLET_MAX } from 'modules/common/constants';
import Media from 'react-media';
import { CashoutButton } from 'modules/common/buttons';

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
      <MarketProgress
        alignRight
        customLabel="Estimated Event Start Time"
        endTimeFormatted={convertUnixToFormattedDate(row.startTime)}
      />
      <span>{row.description}</span>
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
            <span>{outcome.odds}</span>
            {showExtraRow && (
              <span>
                {isEvent && <TemplateShield market={outcome} />}
                {outcome.highRisk && (
                  <RedFlag market={{ mostLikelyInvalid: true, id: 0 }} />
                )}
                <span>{isEvent ? outcome.description : outcome.betType}</span>
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
            value={outcome.updatedDate.formattedLocalShortDate}
            useFull={true}
          />
          <CashoutButton action={null} outcome={outcome} />
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
