import React from "react";

import MarketLink from "modules/market/components/market-link/market-link";
import {
  CountdownProgress,
  MarketProgress,
  formatTime,
} from "modules/common/progress";
import { CancelTextButton } from "modules/common/buttons";
import { DateFormattedObject, MarketData, MarketReportClaimableContracts } from "modules/types";
import { formatDai } from "utils/format-number";
import Styles from "modules/account/components/notification.styles.less";

import {
  NOTIFICATION_TYPES,
  MARKET_STATUS_MESSAGES,
  REPORTING_ENDS,
} from "modules/common/constants";

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
        <MarketLink id={id}>{wrapMarketName(description)}</MarketLink>
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
        counter = (
          <div className={Styles.Countdown}>
            <MarketProgress
              reportingState={reportingState}
              currentTime={props.currentTime}
              endTimeFormatted={endTimeFormatted}
              reportingWindowEndTime={props.market.disputeInfo.disputeWindow.endTime}
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
        disputeInfo.disputeWindow.disputeRound
      } for the market: "${description}" is ending soon.`}
      {...props}
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

// Helper
const wrapMarketName = (marketName: string) => <span>{`"${marketName}"`}</span>;
