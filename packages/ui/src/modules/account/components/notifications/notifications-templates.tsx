import React from "react";

import MarketLink from "modules/market/components/market-link/market-link";
import {
  CountdownProgress,
  MarketProgress,
  formatTime
} from "modules/common-elements/progress";
import { SubmitTextButton } from "modules/common-elements/buttons";

import * as constants from "modules/common-elements/constants";

import Styles from "modules/account/components/notifications/notification-card.styles";

const { NOTIFICATION_TYPES } = constants;

export interface DisputeInfo {
  disputeRound: number;
}

export interface MyPositionsSummary {
  currentValue: any;
  numCompleteSets: any;
  totalPercent: any;
  totalReturns: any;
}

export interface Market {
  id: string;
  description: string;
  reportingState: string;
  endTime: number;
  marketStatus: string;
  disputeInfo?: DisputeInfo;
  myPositionsSummary?: MyPositionsSummary;
  outstandingReturns?: string;
  finalizationTimeWithHold?: number;
  orphanOrdersPerMarket?: number;
}

export interface TemplateProps {
  type: string;
  message: string;
  market: Market;
  isDisabled: boolean;
  buttonAction: Function;
  buttonLabel: string;
  markets?: Array<string>;
  currentTime?: Date;
  reportingWindowStatsEndTime?: number;
  claimReportingFees?: any;
  totalProceeds?: number;
}

export interface TemplateBodyProps {
  market?: Market;
  message: string;
}

export interface CounterProps {
  type: string;
  market?: Market;
  currentTime?: Date;
  reportingWindowStatsEndTime?: number;
}

const TemplateBody = (props: TemplateBodyProps) => {
  if (!props.market) {
    return <span>{props.message}</span>;
  }

  const { description, id } = props.market;
  const parts: Array<string> = props.message.split(`"${description}"`);

  if (parts.length > 1) {
    return (
      <span>
        {parts[0]}
        <MarketLink id={id}>{wrapMarketName(description)}</MarketLink>
        {parts[1]}
      </span>
    );
  }

  return <span>{props.message}</span>;
};

const Counter = (props: CounterProps) => {
  let counter = null;
  const notificationsWithCountdown = [
    NOTIFICATION_TYPES.marketsInDispute,
    NOTIFICATION_TYPES.reportOnMarkets,
    NOTIFICATION_TYPES.proceedsToClaimOnHold
  ];

  if (props.market && notificationsWithCountdown.includes(props.type)) {
    const { endTime, reportingState, finalizationTimeWithHold } = props.market;

    if (props.type === NOTIFICATION_TYPES.proceedsToClaimOnHold) {
      counter = (
        <div className={Styles.NotificationCard__countdown}>
          <CountdownProgress
            label={constants.MARKET_STATUS_MESSAGES.WAITING_PERIOD_ENDS}
            time={formatTime(finalizationTimeWithHold)}
            currentTime={formatTime(props.currentTime)}
          />
        </div>
      );
    } else {
      counter = (
        <div className={Styles.NotificationCard__countdown}>
          <MarketProgress
            reportingState={reportingState}
            currentTime={props.currentTime}
            endTime={endTime}
            reportingWindowEndtime={props.reportingWindowStatsEndTime}
            customLabel={constants.REPORTING_ENDS}
          />
        </div>
      );
    }
  }
  return counter;
};

const Template = (props: TemplateProps) => (
  <React.Fragment>
    <TemplateBody market={props.market} message={props.message} />
    <div className={Styles.NotificationCard_bottomRow}>
      <Counter
        type={props.type}
        market={props.market || null}
        reportingWindowStatsEndTime={props.reportingWindowStatsEndTime}
        currentTime={props.currentTime}
      />

      <SubmitTextButton
        text={props.buttonLabel}
        action={() => props.buttonAction()}
        disabled={props.isDisabled}
      />
    </div>
  </React.Fragment>
);

// Notifications Tempalates
export const OpenOrdersResolvedMarketsTemplate = (props: TemplateProps) => {
  const { description } = props.market;

  return (
    <Template
      message={`You have open orders in this resolved market: "${description}"`}
      {...props}
    />
  );
};

export const FinalizeTemplate = (props: TemplateProps) => {
  const { description } = props.market;

  return (
    <Template
      message={`The market: "${description}" is resolved and is ready to be finalized.`}
      {...props}
    />
  );
};

export const UnsignedOrdersTemplate = (props: TemplateProps) => {
  const { description } = props.market;

  return (
    <Template
      message={`You have unsigned orders pending for the following markets initial liquidity: "${description}"`}
      {...props}
    />
  );
};

export const OrphanOrdersTemplate = (props: TemplateProps) => {
  const { description } = props.market;

  return (
    <Template
      message={`You have orphaned orders in this market: "${description}"`}
      {...props}
    />
  );
};

export const ReportEndingSoonTemplate = (props: TemplateProps) => {
  const { description } = props.market;

  return (
    <Template
      message={`Reporting ends soon for: "${description}"`}
      {...props}
    />
  );
};

export const DisputeTemplate = (props: TemplateProps) => {
  const { description, disputeInfo } = props.market;

  if (!disputeInfo) {
    return null;
  }

  return (
    <Template
      message={`Dispute round ${
        disputeInfo.disputeRound
      } for the market: "${description}" is ending soon.`}
      {...props}
    />
  );
};

export const SellCompleteSetTemplate = (props: TemplateProps) => {
  const { description, myPositionsSummary } = props.market;

  if (!myPositionsSummary) {
    return null;
  }

  const { numCompleteSets } = myPositionsSummary;

  return (
    <Template
      message={`You currently have ${
        numCompleteSets.full
      } of all outcomes in: "${description}"`}
      {...props}
    />
  );
};

export const ClaimReportingFeesTemplate = (props: TemplateProps) => {
  const { claimReportingFees } = props;
  const unclaimedREP = claimReportingFees.unclaimedRep.formattedValue || 0;
  const unclaimedETH = claimReportingFees.unclaimedEth.formattedValue || 0;

  return (
    <Template
      message={`You have ${unclaimedREP} REP available to be claimed from your reporting stake and ${unclaimedETH} ETH of reporting fees to collect.`}
      {...props}
    />
  );
};

export const ProceedsToClaimTemplate = (props: TemplateProps) => {
  const { totalProceeds } = props;

  return (
    <Template
      message={`You have ${totalProceeds} ETH available to be claimed from multiple markets.`}
      {...props}
    />
  );
};

export const ProceedsToClaimOnHoldTemplate = (props: TemplateProps) => {
  const { market } = props;
  const { outstandingReturns, description } = market;

  return (
    <React.Fragment>
      <Template
        message={`You have ${outstandingReturns} ETH available to claim when the waiting period ends for: "${description}"`}
        {...props}
      />
    </React.Fragment>
  );
};

// Helper
const wrapMarketName = (marketName: string) => <span>{`"${marketName}"`}</span>;
