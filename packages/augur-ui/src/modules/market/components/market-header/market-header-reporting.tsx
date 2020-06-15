import React from 'react';
import classNames from 'classnames';
import Styles from 'modules/market/components/market-header/market-header-reporting.styles.less';
import {
  REPORTING_STATE,
  SCALAR,
  INVALID_OUTCOME_LABEL,
  SUBMIT_REPORT,
  SUBMIT_DISPUTE,
  PROCEEDS_TO_CLAIM_TITLE,
  TRANSACTIONS,
  CLAIMMARKETSPROCEEDS,
  FINALIZE,
  MODAL_REPORTING,
  MODAL_CLAIM_MARKETS_PROCEEDS,
  DESIGNATED_REPORTER_SELF,
  ZERO,
} from 'modules/common/constants';
import { ProcessingButton } from 'modules/common/buttons';
import { getOutcomeNameWithOutcome } from 'utils/get-outcome';
import { MarketData } from 'modules/types';
import { Getters } from '@augurproject/sdk';
import ReactTooltip from 'react-tooltip';
import TooltipStyles from 'modules/common/tooltip.styles.less';
import { finalizeMarket } from 'modules/contracts/actions/contractCalls';
import { useAppStatusStore } from 'modules/app/store/app-status';
import { selectMarket } from 'modules/markets/selectors/market';
import { isSameAddress } from 'utils/isSameAddress';
import { createBigNumber } from 'utils/create-big-number';

interface MarketHeaderReportingProps {
  market: MarketData;
  preview: boolean;
  marketId: string;
}

export const MarketHeaderReporting = ({
  market,
  marketId,
  preview,
}: MarketHeaderReportingProps) => {
  const {
    actions: { setModal },
    accountPositions,
    loginAccount: { address },
    universe: { forkingInfo },
    blockchain: { currentAugurTimestamp },
  } = useAppStatusStore();
  let { isLogged } = useAppStatusStore();
  const marketSelected = market || selectMarket(marketId);
  const disputeInfoStakes =
    marketSelected.disputeInfo && marketSelected.disputeInfo.stakes;

  const isForking = !!forkingInfo;
  const isForkingMarket =
    forkingInfo && forkingInfo.forkingMarket === marketSelected.id;
  isLogged = isLogged && !forkingInfo;
  const isLoggedIn = isLogged;

  const {
    disputeInfo,
    reportingState,
    id,
    consensusFormatted,
    designatedReporter,
  } = marketSelected;

  const isDesignatedReporter = preview
    ? designatedReporterType === DESIGNATED_REPORTER_SELF
    : isSameAddress(designatedReporter, address);
  const tentativeWinner =
    (disputeInfoStakes &&
      disputeInfoStakes.find(stake => stake.tentativeWinning)) ||
    {};
  const canClaimProceeds =
    accountPositions[marketId] &&
    accountPositions[marketId].tradingPositionsPerMarket &&
    createBigNumber(
      accountPositions[marketSelected.marketId].tradingPositionsPerMarket
        .unclaimedProceeds
    ).gt(ZERO)
      ? true
      : false;

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
                    ? INVALID_OUTCOME_LABEL
                    : market.marketType === SCALAR
                    ? tentativeWinner.outcome
                    : getOutcomeNameWithOutcome(
                        marketSelected,
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
                market: marketSelected,
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
              market: marketSelected,
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
