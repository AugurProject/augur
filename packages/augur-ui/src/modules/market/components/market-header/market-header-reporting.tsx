import React from 'react';
import ReactTooltip from 'react-tooltip';
import classNames from 'classnames';
import { ProcessingButton } from 'modules/common/buttons';
import {
  CLAIMMARKETSPROCEEDS,
  FINALIZE,
  INVALID_OUTCOME_LABEL,
  PROCEEDS_TO_CLAIM_TITLE,
  REPORTING_STATE,
  SCALAR,
  SUBMIT_DISPUTE,
  SUBMIT_REPORT,
  TRANSACTIONS,
  CLAIMMARKETSPROCEEDS,
  FINALIZE,
  MODAL_REPORTING,
  MODAL_CLAIM_MARKETS_PROCEEDS,
  DESIGNATED_REPORTER_SELF,
  ZERO,
} from 'modules/common/constants';
import TooltipStyles from 'modules/common/tooltip.styles.less';
import { finalizeMarket } from 'modules/contracts/actions/contractCalls';
import { useAppStatusStore } from 'modules/app/store/app-status';
import { isSameAddress } from 'utils/isSameAddress';
import { createBigNumber } from 'utils/create-big-number';
import Styles
  from 'modules/market/components/market-header/market-header-reporting.styles.less';
import { MarketData } from 'modules/types';

import { getOutcomeNameWithOutcome } from 'utils/get-outcome';

interface MarketHeaderReportingProps {
  market: MarketData;
  preview: boolean;
}

export const MarketHeaderReporting = ({
  market,
  preview,
}: MarketHeaderReportingProps) => {
  const {
    actions: { setModal },
    accountPositions,
    loginAccount: { address },
    universe: { forkingInfo },
  } = useAppStatusStore();
  const { isLogged } = useAppStatusStore();
  const {
    disputeInfo,
    reportingState,
    id,
    consensusFormatted,
    designatedReporter,
    designatedReporterType,
    marketType
  } = market;
  const disputeInfoStakes = disputeInfo?.stakes;

  const isForking = !!forkingInfo;
  const isForkingMarket = forkingInfo?.forkingMarket === id;
  const isLoggedIn = isLogged && !forkingInfo;

  

  const isDesignatedReporter = preview
    ? designatedReporterType === DESIGNATED_REPORTER_SELF
    : isSameAddress(designatedReporter, address);
  const tentativeWinner =
    (disputeInfoStakes &&
      disputeInfoStakes.find(stake => stake.tentativeWinning)) ||
    {};
  const canClaimProceeds =
    !!(accountPositions[id]?.tradingPositionsPerMarket &&
    createBigNumber(
      accountPositions[id].tradingPositionsPerMarket
        .unclaimedProceeds
    ).gt(ZERO));

  let content = null;
  const slowDisputing = disputeInfo?.disputePacingOn;

  if (
    consensusFormatted &&
    (consensusFormatted.winningOutcome || consensusFormatted.invalid)
  ) {
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
            action={() =>
              setModal({
                type: MODAL_CLAIM_MARKETS_PROCEEDS,
                marketIds: [id],
              })
            }
            disabled={!isLogged || !canClaimProceeds}
            queueName={CLAIMMARKETSPROCEEDS}
            queueId={id}
          />
        )}
        {reportingState === REPORTING_STATE.AWAITING_FINALIZATION &&
          isForkingMarket && (
            <ProcessingButton
              queueName={TRANSACTIONS}
              queueId={FINALIZE}
              small
              disabled={!isLoggedIn}
              text='Finalize Market'
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
                    ? INVALID_OUTCOME_LABEL
                    : marketType === SCALAR
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
            action={() =>
              setModal({
                type: MODAL_REPORTING,
                market,
              })
            }
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
        className={classNames(Styles.Content, Styles.Report)}
        data-tip
        data-for={'tooltip--reporting' + id}
        data-iscapture={true}
      >
        <ProcessingButton
          text="Report"
          action={() =>
            setModal({
              type: MODAL_REPORTING,
              market,
            })
          }
          disabled={!isLogged}
          queueName={SUBMIT_REPORT}
          queueId={id}
        />
        {isForking && (
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
