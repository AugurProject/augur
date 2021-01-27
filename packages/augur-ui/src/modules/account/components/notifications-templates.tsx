import { MarketReportingState } from '@augurproject/sdk-lite';
import classNames from 'classnames';
import Styles from 'modules/account/components/notification.styles.less';
import { CancelTextButton, ProcessingButton } from 'modules/common/buttons';
import {
  DISPUTE_ENDS,
  MARKET_IN_DISPUTE,
  MARKET_STATUS_MESSAGES,
  NOTIFICATION_TYPES,
  REPORTING_ENDS,
} from 'modules/common/constants';
import {
  CountdownProgress,
  formatTime,
  MarketProgress,
} from 'modules/common/progress';
import { getWarpSyncRepReward } from 'modules/contracts/actions/contractCalls';
import MarketTitle from 'modules/market/containers/market-title';
import {
  DateFormattedObject,
  MarketData,
  MarketReportClaimableContracts,
} from 'modules/types';
import React, { useEffect, useState } from 'react';
import { formatDaiPrice, formatDai } from 'utils/format-number';

interface BaseProps {
  market: MarketData;
  type: string;
  currentTime?: DateFormattedObject;
  disputingWindowEndTime?: DateFormattedObject;
  isDisabled: boolean;
  buttonAction: Function;
  buttonLabel: string;
  queueName?: string;
  queueId?: string;
  hideCheckbox?: boolean;
  checkCheckbox?: Function;
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

interface MostLikelyInvalidMarketsTemplateProps extends BaseProps {
  market: MarketData;
}

interface TemplateProps extends BaseProps {
  message: string;
}

const notificationsWithCountdown = [
  NOTIFICATION_TYPES.marketsInDispute,
  NOTIFICATION_TYPES.reportOnMarkets,
  NOTIFICATION_TYPES.proceedsToClaim,
];

const Template = ({
  market,
  type,
  message,
  buttonAction,
  isDisabled,
  buttonLabel,
  queueName,
  queueId,
  hideCheckbox,
}: TemplateProps) => {
  const showCounter = market && notificationsWithCountdown.includes(type);
  return (
    <>
      <TemplateBody market={market} message={message} />
      <div
        className={classNames(Styles.BottomRow, {[Styles.HasCheckbox]: hideCheckbox})}
      >
        {showCounter && (
          <Counter type={type} market={market} />
        )}
        {queueName && (queueId || (market && market.id)) ?
          <ProcessingButton
            text={buttonLabel}
            action={() => buttonAction()}
            queueName={queueName}
            queueId={queueId || market.id }
            cancelButton
          />
        :
          <CancelTextButton
            text={buttonLabel}
            action={() => buttonAction()}
            disabled={isDisabled}
          />
        }
      </div>
    </>
  );
};

export interface TemplateBodyProps {
  market: MarketData;
  message: string;
}

const TemplateBody = (props: TemplateBodyProps) => {
  if (!props.market) {
    return <span>{props.message}</span>;
  }

  const { description, id } = props.market;
  const parts: Array<string> = props.message
    ? props.message.split(`"${description}"`)
    : [];

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
  disputingWindowEndTime?: DateFormattedObject;
}

const Counter = ({ market, type }: CounterProps) => {
  let counter: any = null;
  const { endTime, reportingState, finalizationTime, disputeInfo } = market;
  const endTimeFormatted = formatTime(endTime);
  const finalizationTimeFormatted = formatTime(finalizationTime);
  if (
    type === NOTIFICATION_TYPES.proceedsToClaim &&
    finalizationTimeFormatted
  ) {
    counter = (
      <div className={Styles.Countdown}>
        <CountdownProgress
          label={MARKET_STATUS_MESSAGES.WAITING_PERIOD_ENDS}
          time={finalizationTimeFormatted}
        />
      </div>
    );
  } else {
      const label =
        type === NOTIFICATION_TYPES[MARKET_IN_DISPUTE]
          ? DISPUTE_ENDS
          : REPORTING_ENDS;
      counter = (
        <div className={Styles.Countdown}>
          <MarketProgress
            reportingState={reportingState}
            endTimeFormatted={endTimeFormatted}
            reportingWindowEndTime={disputeInfo.disputeWindow.endTime}
            reportingWindowStartTime={disputeInfo.disputeWindow.startTime}
            customLabel={label}
          />
        </div>
      );
  }
  return counter;
};

export const OpenOrdersResolvedMarketsTemplate = (
  props: OpenOrdersResolvedMarketsTemplateProps
) => {
  const { description } = props.market;

  return (
    <Template
      message={`You have open orders in this resolved market: "${description}"`}
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

export const ReportEndingSoonTemplate = (
  props: ReportEndingSoonTemplateProps
) => {
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

  const disputeHasEnded =
    reportingState !== MarketReportingState.CrowdsourcingDispute;

  return (
    <Template
      message={`Dispute round ${disputeInfo.disputeWindow.disputeRound} for the market: "${description}" is ending soon.`}
      {...props}
      isDisabled={props.isDisabled || disputeHasEnded}
    />
  );
};

export const ClaimReportingFeesTemplate = (
  props: ClaimReportingFeesTemplateTemplateProps
) => {
  const { claimReportingFees } = props;
  const unclaimedREP = claimReportingFees.totalUnclaimedRepFormatted.formattedValue;
  const unclaimedDai = claimReportingFees.totalUnclaimedDaiFormatted.formattedValue;

  return (
    <Template
      message={`You have ${unclaimedREP} REPv2 available to be claimed from your reporting stake and $${unclaimedDai} of reporting fees to collect.`}
      {...props}
    />
  );
};

export const ProceedsToClaimTemplate = (
  props: ProceedsToClaimTemplateProps
) => {
  const { markets, totalProceeds } = props;
  const formattedProceeds = formatDai(totalProceeds).formatted;

  let messageText = `You have $${formattedProceeds} available to be claimed from one market.`;
  if (markets.length > 1) {
    messageText = `You have $${formattedProceeds} available to be claimed from multiple markets.`;
  }
  return <Template message={messageText} {...props} />;
};

export const MostLikelyInvalidMarketsTemplate = (
  props: MostLikelyInvalidMarketsTemplateProps
) => {
  const { description } = props.market;

  return (
    <Template
      message={`A market you have a position in has a high chance of resolving invalid: "${description}"`}
      {...props}
    />
  );
};

export const FinalizeWarpSyncMarketTemplate = (
  props: MostLikelyInvalidMarketsTemplateProps
) => {
  const [reward, setReward] = useState('-');
  useEffect(() => {
    getWarpSyncRepReward(props.market.id).then(reward =>
      setReward(reward)
    );
  }, []);
  const { description } = props.market;

  return (
    <Template
      message={`Get ${reward} REPv2 Reward, please finalize warp sync market: "${description}"`}
      {...props}
    />
  );
};

