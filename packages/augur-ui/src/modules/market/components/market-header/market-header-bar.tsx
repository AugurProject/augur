import type { Getters } from '@augurproject/sdk';
import { REPORTING_STATE } from 'modules/common/constants';
import { Archived, InReportingLabel } from 'modules/common/labels';
import { MarketProgress } from 'modules/common/progress';
import Styles
  from 'modules/market/components/market-header/market-header-bar.styles.less';
import { DateFormattedObject, MarketData } from 'modules/types';
import React from 'react';

export interface MarketHeaderBarProps {
  market: MarketData;
}

const {
  PRE_REPORTING,
  DESIGNATED_REPORTING,
  CROWDSOURCING_DISPUTE,
  AWAITING_NEXT_WINDOW,
  AWAITING_FINALIZATION,
  FINALIZED,
} = REPORTING_STATE;
const statesToShowProgress = [
  DESIGNATED_REPORTING,
  CROWDSOURCING_DISPUTE,
  AWAITING_NEXT_WINDOW,
  AWAITING_FINALIZATION,
  FINALIZED,
];
const showProgress = (state: string) =>
  statesToShowProgress.includes(state);

export const MarketHeaderBar = ({
  market
}: MarketHeaderBarProps) => {
  const { disputeInfo, reportingState, endTimeFormatted } = market;
  return (
    <section className={Styles.HeaderBar}>
      <Archived market={market} />
      <InReportingLabel
        reportingState={reportingState || PRE_REPORTING}
        disputeInfo={disputeInfo}
      />
      {showProgress(reportingState) && (
        <MarketProgress
          reportingState={reportingState}
          endTimeFormatted={endTimeFormatted}
          reportingWindowEndTime={disputeInfo?.disputeWindow?.endTime}
        />
      )}
    </section>
  );
};
