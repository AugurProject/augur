import React from "react";

import MarketLink from "modules/market/components/market-link/market-link";
import {
  CountdownProgress,
  MarketProgress,
  formatTime,
} from "modules/common/progress";
import { SubmitTextButton } from "modules/common/buttons";
import { DateFormattedObject } from "modules/types";

import Styles from "modules/account/components/notification.styles.less";

import {
  NOTIFICATION_TYPES,
  MARKET_STATUS_MESSAGES,
  REPORTING_ENDS,
} from "modules/common/constants";
import { Market } from "modules/types";

interface BaseProps {
  market: Market;
  type: string;
  currentTime?: DateFormattedObject;
  reportingWindowStatsEndTime?: DateFormattedObject;
  isDisabled: boolean;
  buttonAction: Function;
  buttonLabel: string;
}

interface OpenOrdersResolvedMarketsTemplateProps extends BaseProps {
  market: Market;
}

interface FinalizeTemplateProps extends BaseProps {
  market: Market;
}

interface UnsignedOrdersTemplateProps extends BaseProps {
  market: Market;
}

interface ReportEndingSoonTemplateProps extends BaseProps {
  market: Market;
}


interface DisputeTemplateProps extends BaseProps {
  market: Market;
}

interface SellCompleteSetTemplateProps extends BaseProps {
  market: Market;
}

interface ClaimReportingFeesTemplateTemplateProps extends BaseProps {
  market: Market;
  claimReportingFees: any;
}

interface ProceedsToClaimTemplateProps extends BaseProps {
  market: Market;
  totalProceeds: number | undefined;
}

interface ProceedsToClaimOnHoldTemplateProps extends BaseProps {
  market: Market;
}

interface TemplateProps extends BaseProps {
  message: string;
}

const Template = (props: TemplateProps) => (
  <>
    <TemplateBody market={props.market} message={props.message} />
    <div className={Styles.BottomRow}>
      <Counter
        type={props.type}
        market={props.market}
        reportingWindowStatsEndTime={props.reportingWindowStatsEndTime}
        currentTime={props.currentTime}
      />

      <SubmitTextButton
        text={props.buttonLabel}
        action={() => props.buttonAction()}
        disabled={props.isDisabled}
      />
    </div>
  </>
);

export interface TemplateBodyProps {
  market: Market;
  message: string;
}

const TemplateBody = (props: TemplateBodyProps) => {
  if (!props.market) {
    return <span>{props.message}</span>;
  }

  const { description, id } = props.market;
  const parts: Array<string> = props.message ? props.message.split(`"${description}"`) : [];

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

interface CounterProps {
  type: string;
  market: Market;
  currentTime?: DateFormattedObject;
  reportingWindowStatsEndTime?: DateFormattedObject;
}

const Counter = (props: CounterProps) => {
  let counter: any = null;
  const notificationsWithCountdown = [
    NOTIFICATION_TYPES.marketsInDispute,
    NOTIFICATION_TYPES.reportOnMarkets,
    NOTIFICATION_TYPES.proceedsToClaimOnHold,
  ];

  if (props.market && notificationsWithCountdown.includes(props.type)) {
    const { endTime, reportingState, finalizationTimeWithHold } = props.market;

    if (props.type === NOTIFICATION_TYPES.proceedsToClaimOnHold && finalizationTimeWithHold && props.currentTime) {
      counter = (
        <div className={Styles.Countdown}>
          <CountdownProgress
            label={MARKET_STATUS_MESSAGES.WAITING_PERIOD_ENDS}
            time={formatTime(finalizationTimeWithHold)}
            currentTime={formatTime(props.currentTime)}
          />
        </div>
      );
    } else {
      if (props.currentTime && props.reportingWindowStatsEndTime) {
        counter = (
          <div className={Styles.Countdown}>
            <MarketProgress
              reportingState={reportingState}
              currentTime={props.currentTime}
              endTime={endTime}
              reportingWindowEndtime={props.reportingWindowStatsEndTime}
              customLabel={REPORTING_ENDS}
            />
          </div>
        );
      }
    }
  }
  return counter;
};

export const OpenOrdersResolvedMarketsTemplate = (props: OpenOrdersResolvedMarketsTemplateProps) => {
  const { description } = props.market;

  return (
    <Template
      message={`You have open orders in this resolved market: "${description}"`}
      {...props}
    />
  );
};

export const FinalizeTemplate = (props: FinalizeTemplateProps) => {
  const { description } = props.market;

  return (
    <Template
      message={`The market: "${description}" is resolved and is ready to be finalized.`}
      {...props}
    />
  );
};

export const UnsignedOrdersTemplate = (props: UnsignedOrdersTemplateProps) => {
  const { description } = props.market;

  return (
    <Template
      message={`You have unsigned orders pending for the following markets initial liquidity: "${description}"`}
      {...props}
    />
  );
};

export const ReportEndingSoonTemplate = (props: ReportEndingSoonTemplateProps) => {
  const { description } = props.market;

  return (
    <Template
      message={`Reporting ends soon for: "${description}"`}
      {...props}
    />
  );
};

export const DisputeTemplate = (props: DisputeTemplateProps) => {
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

export const SellCompleteSetTemplate = (props: SellCompleteSetTemplateProps) => {
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

export const ClaimReportingFeesTemplate = (props: ClaimReportingFeesTemplateTemplateProps) => {
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

export const ProceedsToClaimTemplate = (props: ProceedsToClaimTemplateProps) => {
  const { totalProceeds } = props;

  return (
    <Template
      message={`You have ${totalProceeds} ETH available to be claimed from multiple markets.`}
      {...props}
    />
  );
};

export const ProceedsToClaimOnHoldTemplate = (props: ProceedsToClaimOnHoldTemplateProps) => {
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
