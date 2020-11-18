import type { Getters } from '@augurproject/sdk';
import classNames from 'classnames';
import { ProcessingButton } from 'modules/common/buttons';
import {
  CLAIMMARKETSPROCEEDS,
  FINALIZE,
  INVALID_OUTCOME_NAME,
  INVALID_OUTCOME_LABEL,
  PROCEEDS_TO_CLAIM_TITLE,
  REPORTING_STATE,
  SCALAR,
  SUBMIT_DISPUTE,
  SUBMIT_REPORT,
  TRANSACTIONS,
} from 'modules/common/constants';
import TooltipStyles from 'modules/common/tooltip.styles.less';
import { finalizeMarket } from 'modules/contracts/actions/contractCalls';
import Styles
  from 'modules/market/components/market-header/market-header-reporting.styles.less';
import { MarketData } from 'modules/types';
import React from 'react';
import ReactTooltip from 'react-tooltip';
import { getOutcomeNameWithOutcome } from 'utils/get-outcome';
import InvalidLabel from 'modules/common/containers/labels';

interface MarketHeaderReportingProps {
  market: MarketData;
  tentativeWinner?: Getters.Markets.StakeDetails;
  canClaimProceeds?: boolean;
  isLogged?: boolean;
  isDesignatedReporter?: boolean;
  claimMarketsProceeds: Function;
  showReportingModal: Function;
  isForking?: boolean;
  isForkingMarket?: boolean;
  isLoggedIn?: boolean;
}

export const MarketHeaderReporting = ({
  market,
  isDesignatedReporter,
  claimMarketsProceeds,
  tentativeWinner,
  isLogged,
  canClaimProceeds,
  showReportingModal,
  isForking,
  isForkingMarket,
  isLoggedIn
}: MarketHeaderReportingProps) => {
  const { reportingState, id, consensusFormatted } = market;
  let content = null;
  const slowDisputing =
    market.disputeInfo && market.disputeInfo.disputePacingOn;

  if (consensusFormatted && (consensusFormatted.winningOutcome || consensusFormatted.invalid)) {
    content = (
      <div className={classNames(Styles.Content, Styles.Set)}>
        <div>
          <span>Winning Outcome</span>
          <span>
            {consensusFormatted.invalid
              ? INVALID_OUTCOME_LABEL
              : consensusFormatted.outcomeName}
          </span>
        </div>
        {canClaimProceeds && (
          <ProcessingButton
            text={PROCEEDS_TO_CLAIM_TITLE}
            action={() => claimMarketsProceeds([id])}
            disabled={!isLogged || !canClaimProceeds}
            queueName={CLAIMMARKETSPROCEEDS}
            queueId={id}
          />
        )}
        {reportingState === REPORTING_STATE.AWAITING_FINALIZATION && isForkingMarket && (
          <ProcessingButton
            queueName={TRANSACTIONS}
            queueId={FINALIZE}
            small
            disabled={!isLoggedIn}
            text={'Finalize Market'}
            action={() => finalizeMarket(id)}
          />
        )}
      </div>
    );
  } else if (
    reportingState === REPORTING_STATE.CROWDSOURCING_DISPUTE ||
    reportingState === REPORTING_STATE.AWAITING_FORK_MIGRATION ||
    reportingState === REPORTING_STATE.AWAITING_NEXT_WINDOW
  ) {
    content = (
      <div className={classNames(Styles.Content, Styles.Dispute)}>
        <div>
          <span>Tentative Winner</span>
          {tentativeWinner &&
            (tentativeWinner.outcome || tentativeWinner.isInvalidOutcome) && (
              <span>
                {tentativeWinner &&
                  (tentativeWinner.isInvalidOutcome
                    ? <InvalidLabel text={'invalid'} keyId={'invalid'} marketId={market.marketId} />
                    : market.marketType === SCALAR
                    ? tentativeWinner.outcome
                    : getOutcomeNameWithOutcome(
                        market,
                        tentativeWinner.outcome,
                        tentativeWinner.isInvalidOutcome
                      ))}
              </span>
            )}
        </div>
        {reportingState === REPORTING_STATE.CROWDSOURCING_DISPUTE && (
          <ProcessingButton
            queueName={SUBMIT_DISPUTE}
            queueId={id}
            small
            disabled={!isLogged}
            text={
              slowDisputing ? 'Dispute Outcome' : 'Support or Dispute Outcome'
            }
            action={() => showReportingModal()}
          />
        )}
      </div>
    );
  } else if (
    (reportingState === REPORTING_STATE.DESIGNATED_REPORTING &&
      isDesignatedReporter) ||
    reportingState === REPORTING_STATE.OPEN_REPORTING
  ) {
    content = (
      <div
        className={classNames(
          Styles.Content,
          Styles.Report
        )}
        data-tip
        data-for={'tooltip--reporting' + id}
        data-iscapture={true}
      >
        <ProcessingButton
          text='Report'
          action={() => showReportingModal()}
          disabled={!isLogged}
          queueName={SUBMIT_REPORT}
          queueId={id}
        />
         {(isForking) && (
          <ReactTooltip
            id={'tooltip--reporting' + id}
            className={TooltipStyles.Tooltip}
            effect="solid"
            place="top"
            type="light"
            event="mouseover mouseenter"
            eventOff="mouseleave mouseout scroll mousewheel blur"
          >
            <p>{'Market cannot be reported on while universe is forking'} </p>
          </ReactTooltip>
        )}
      </div>
    );
  }

  if (!content) {
    return <div className={Styles.EmptyBreak} />;
  }

  return <>{content}</>;
};
