import React from 'react';
import classNames from 'classnames';
import Styles from 'modules/market/components/market-header/market-header-reporting.styles.less';
import {
  REPORTING_STATE,
  SCALAR,
  INVALID_OUTCOME_NAME,
  SUBMIT_REPORT,
  SUBMIT_DISPUTE,
  PROCEEDS_TO_CLAIM_TITLE,
  TRANSACTIONS,
  CLAIMMARKETSPROCEEDS,
} from 'modules/common/constants';
import { ProcessingButton } from 'modules/common/buttons';
import { getOutcomeNameWithOutcome } from 'utils/get-outcome';
import { MarketData } from 'modules/types';
import { Getters } from '@augurproject/sdk';

interface MarketHeaderReportingProps {
  market: MarketData;
  tentativeWinner?: Getters.Markets.StakeDetails;
  canClaimProceeds?: boolean;
  isLogged?: boolean;
  isDesignatedReporter?: boolean;
  claimMarketsProceeds: Function;
  showReportingModal: Function;
}

export const MarketHeaderReporting = ({
  market,
  isDesignatedReporter,
  claimMarketsProceeds,
  tentativeWinner,
  isLogged,
  canClaimProceeds,
  showReportingModal,
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
              ? INVALID_OUTCOME_NAME
              : consensusFormatted.outcomeName}
          </span>
        </div>
        {canClaimProceeds && (
          <ProcessingButton
            text={PROCEEDS_TO_CLAIM_TITLE}
            action={() => claimMarketsProceeds([id])}
            disabled={!isLogged || !canClaimProceeds}
            queueName={TRANSACTIONS}
            queueId={CLAIMMARKETSPROCEEDS}
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
                    ? 'Invalid'
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
      <div className={classNames(Styles.Content, Styles.Report)}>
        <ProcessingButton
          text='Report'
          action={() => showReportingModal()}
          disabled={!isLogged}
          queueName={SUBMIT_REPORT}
          queueId={id}
        />
      </div>
    );
  }

  if (!content) {
    return <div className={Styles.EmptyBreak} />;
  }

  return <>{content}</>;
};
