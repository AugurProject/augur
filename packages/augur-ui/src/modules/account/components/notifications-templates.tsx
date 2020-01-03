import React from "react";

import { CountdownProgress, formatTime, MarketProgress, } from "modules/common/progress";
import { CancelTextButton } from "modules/common/buttons";
import { DateFormattedObject, MarketData, MarketReportClaimableContracts } from "modules/types";
import { formatDai } from "utils/format-number";
import Styles from "modules/account/components/notification.styles.less";

import {
  DISPUTE_ENDS,
  MARKET_IN_DISPUTE,
  MARKET_STATUS_MESSAGES,
  NOTIFICATION_TYPES,
  REPORTING_ENDS,
} from "modules/common/constants";
import MarketTitle from "modules/market/containers/market-title";
import { MarketReportingState } from '@augurproject/sdk/build';

interface BaseProps {
  market: MarketData;
  type: string;
  currentTime?: DateFormattedObject;
  disputingWindowEndTime?: DateFormattedObject;
  isDisabled: boolean;
  buttonAction: Function;
  buttonLabel: string;
}

interface OpenOrdersResolvedMarketsTemplateProps extends BaseProps {
  market: MarketData;
}

interface FinalizeTemplateProps extends BaseProps {
  market: MarketData;
}

interface UnsignedOrdersTemplateProps extends BaseProps {
  market: MarketData;
}

interface ReportEndingSoonTemplateProps extends BaseProps {
  market: MarketData;
}


interface DisputeTemplateProps extends BaseProps {
  market: MarketData;
}

interface ClaimReportingFeesTemplateTemplateProps extends BaseProps {
  market: MarketData;
  claimReportingFees: MarketReportClaimableContracts;
}

interface ProceedsToClaimTemplateProps extends BaseProps {
  market: MarketData;
  markets: string[];
  totalProceeds: number | undefined;
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
        disputingWindowEndTime={props.disputingWindowEndTime}
        currentTime={props.currentTime}
      />

      <CancelTextButton
        text={props.buttonLabel}
        action={() => props.buttonAction()}
        disabled={props.isDisabled}
      />
    </div>
  </>
);

export interface TemplateBodyProps {
  market: MarketData;
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
        <MarketTitle id={id} isWrapped />
        {parts[1]}
      </span>
    );
  }

  return <span>{props.message}</span>;
};

interface CounterProps {
  type: string;
  market: MarketData;
  currentTime?: DateFormattedObject;
  disputingWindowEndTime?: DateFormattedObject;
}

const Counter = (props: CounterProps) => {
  let counter: any = null;
  const notificationsWithCountdown = [
    NOTIFICATION_TYPES.marketsInDispute,
    NOTIFICATION_TYPES.reportOnMarkets,
    NOTIFICATION_TYPES.proceedsToClaim,
  ];

  if (props.market && notificationsWithCountdown.includes(props.type)) {
    const { endTime, reportingState, finalizationTime } = props.market;
    const endTimeFormatted = formatTime(endTime);
    const finalizationTimeFormatted = formatTime(finalizationTime);

    if (props.type === NOTIFICATION_TYPES.proceedsToClaim && finalizationTimeFormatted && props.currentTime) {
      counter = (
        <div className={Styles.Countdown}>
          <CountdownProgress
            label={MARKET_STATUS_MESSAGES.WAITING_PERIOD_ENDS}
            time={finalizationTimeFormatted}
            currentTime={formatTime(props.currentTime)}
          />
        </div>
      );
    } else {
      if (props.currentTime && props.market.disputeInfo.disputeWindow.endTime) {
        const label = props.type === NOTIFICATION_TYPES[MARKET_IN_DISPUTE] ? DISPUTE_ENDS : REPORTING_ENDS;
        counter = (
          <div className={Styles.Countdown}>
            <MarketProgress
              reportingState={reportingState}
              currentTime={props.currentTime}
              endTimeFormatted={endTimeFormatted}
              reportingWindowEndTime={props.market.disputeInfo.disputeWindow.endTime}
              customLabel={label}
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
  const { description, disputeInfo, reportingState } = props.market;

  if (!disputeInfo) {
    return null;
  }

  const disputeHasEnded = reportingState !== MarketReportingState.CrowdsourcingDispute;

  return (
    <Template
      message={`Dispute round ${
        disputeInfo.disputeWindow.disputeRound
      } for the market: "${description}" is ending soon.`}
      {...props}
      isDisabled={props.isDisabled || disputeHasEnded}
    />
  );
};

export const ClaimReportingFeesTemplate = (props: ClaimReportingFeesTemplateTemplateProps) => {
  const { claimReportingFees } = props;
  const unclaimedREP = claimReportingFees.totalUnclaimedRepFormatted.formatted;
  const unclaimedDai = claimReportingFees.totalUnclaimedDaiFormatted.formatted;

  return (
    <Template
      message={`You have ${unclaimedREP} REP available to be claimed from your reporting stake and ${unclaimedDai} DAI of reporting fees to collect.`}
      {...props}
    />
  );
};

export const ProceedsToClaimTemplate = (props: ProceedsToClaimTemplateProps) => {
  const { markets, totalProceeds } = props;
  const formattedProceeds = formatDai(totalProceeds).formatted;

  let messageText = `You have $${formattedProceeds} available to be claimed from one market.`;
  if (markets.length > 1) {
    messageText = `You have $${formattedProceeds} available to be claimed from multiple markets.`;
  }
  return (
    <Template
      message={messageText}
      {...props}
    />
  );
};
