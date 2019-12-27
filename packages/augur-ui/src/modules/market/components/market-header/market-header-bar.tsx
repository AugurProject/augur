import React from 'react';
import Styles from 'modules/market/components/market-header/market-header-bar.styles.less';
import { InReportingLabel } from 'modules/common/labels';
import { MarketProgress } from 'modules/common/progress';
import { REPORTING_STATE } from 'modules/common/constants';
import { DateFormattedObject } from 'modules/types';
import { Getters } from '@augurproject/sdk';

export interface MarketHeaderBarProps {
  reportingState: string;
  disputeInfo: Getters.Markets.DisputeInfo;
  endTimeFormatted: DateFormattedObject;
  currentAugurTimestamp: number;
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
  reportingState,
  disputeInfo,
  endTimeFormatted,
  currentAugurTimestamp,
}: MarketHeaderBarProps) => (
  <section className={Styles.HeaderBar}>
    <InReportingLabel
      reportingState={reportingState || PRE_REPORTING}
      disputeInfo={disputeInfo}
    />
    {showProgress(reportingState) && (
      <MarketProgress
        reportingState={reportingState}
        currentTime={currentAugurTimestamp}
        endTimeFormatted={endTimeFormatted}
        reportingWindowEndTime={disputeInfo.disputeWindow.endTime}
      />
    )}
  </section>
);
