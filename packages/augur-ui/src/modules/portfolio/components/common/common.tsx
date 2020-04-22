import React from 'react';
import { TemplateShield, InReportingLabel } from 'modules/common/labels';
import { CategoryTagTrail } from 'modules/common/labels';
import { getCategoriesWithClick } from 'modules/market-cards/common';
import { MarketProgress } from 'modules/common/progress';
import { convertUnixToFormattedDate } from 'utils/format-date';
import MyBetsRow from 'modules/portfolio/containers/my-bets-row';

import Styles from 'modules/portfolio/components/common/common.styles.less';
import { FUTURES } from 'modules/common/constants';

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
      <ul>
        <li>Outcome</li>
        <li>Wager</li>
        <li>Odds</li>
        <li>To win</li>
        <li>Bet date</li>
      </ul>
      {Object.values(row.outcomes).map(outcome => (
        <MyBetsRow outcome={outcome} showExtraRow={type !== FUTURES}/>
      ))}
    </div>
  </div>
);
