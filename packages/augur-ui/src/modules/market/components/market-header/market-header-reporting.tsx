import React, { Component } from 'react';
import classNames from 'classnames';
import Styles from 'modules/market/components/market-header/market-header-reporting.styles.less';
import {
  TYPE_DISPUTE,
  TYPE_REPORT,
  REPORTING_STATE,
  SCALAR,
} from 'modules/common/constants';
import { PrimaryButton } from 'modules/common/buttons';
import { getOutcomeNameWithOutcome } from 'utils/get-outcome';
import { MarketData } from 'modules/types';
import { Getters } from '@augurproject/sdk';

interface MarketHeaderReportingProps {
  market: MarketData;
  isDesignatedReporter?: boolean;
  claimMarketsProceeds: Function;
  tentativeWinner?: Getters.Markets.StakeDetails;
  isLogged?: boolean;
  canClaimProceeds?: boolean;
}

interface MarketHeaderReportingState {
  disableFinalize: boolean;
}

export default class MarketHeaderReporting extends Component<MarketHeaderReportingProps, MarketHeaderReportingState> {
  static defaultProps = {
    isDesignatedReporter: false,
    tentativeWinner: {},
    isLogged: false,
  };

  state = {
    disableFinalize: false,
  };

  render() {
    const {
      market,
      isDesignatedReporter,
      claimMarketsProceeds,
      tentativeWinner,
      isLogged,
      canClaimProceeds,
      showReportingModal,
    } = this.props;
    const { reportingState, id, consensusFormatted: consensus } = market;
    let content = null;
    const slowDisputing = market.disputeInfo && market.disputeInfo.disputePacingOn;
    if (consensus && (consensus.winningOutcome || consensus.isInvalid)) {
      content = (
        <div className={classNames(Styles.Content, Styles.Set)}>
          <div>
            <span>Winning Outcome</span>
            <span>
              {consensus.isInvalid
                ? 'Invalid'
                : consensus.outcomeName || consensus.winningOutcome}
            </span>
          </div>
          {canClaimProceeds && (
            <PrimaryButton
              id="button"
              action={() => {
                claimMarketsProceeds([id]);
              }}
              text="Claim Proceeds"
              disabled={!isLogged || !canClaimProceeds}
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
              (tentativeWinner.outcome || tentativeWinner.isInvalidOutcome) ? (
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
              ) : (
                <div style={{ minHeight: '20px' }} />
              )}
          </div>
          {reportingState === REPORTING_STATE.CROWDSOURCING_DISPUTE && (
            <PrimaryButton
              id="button"
              text={slowDisputing ? "Dispute Outcome" : "Support or Dispute Outcome"}
              action={() => showReportingModal()}
              disabled={!isLogged}
            />
          )}
        </div>
      );
    } else if (reportingState === REPORTING_STATE.OPEN_REPORTING) {
      content = (
        <div className={classNames(Styles.Content, Styles.Report)}>
          <div></div>
          <PrimaryButton
            id="button"
            text="Report"
            disabled={!isLogged}
            action={() => showReportingModal()}
            disabled={!isLogged}
          />
        </div>
      );
    } else if (reportingState === REPORTING_STATE.DESIGNATED_REPORTING) {
      content = (
        <div className={classNames(Styles.Content, Styles.Report)}>
          <div></div>
          {isLogged && isDesignatedReporter ? (
            <PrimaryButton
              id="button"
              disabled={!isLogged}
              action={() => showReportingModal()}
              text="Report"
            />
          ) : null}
        </div>
      );
    }

    if (!content) {
      return <div className={Styles.EmptyBreak} />;
    }

    return <>{content}</>;
  }
}
