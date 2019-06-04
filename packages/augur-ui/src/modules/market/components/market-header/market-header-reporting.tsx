import React, { Component } from "react";
import classNames from "classnames";

import PropTypes from "prop-types";
import Styles from "modules/market/components/market-header/market-header-reporting.styles";
import MarketLink from "modules/market/components/market-link/market-link";
import {
  CATEGORICAL,
  TYPE_DISPUTE,
  TYPE_REPORT,
  MARKET_STATUS_MESSAGES,
  REPORTING_STATE,
  CONTRACT_INTERVAL,
} from "modules/common-elements/constants";
import {
  CountdownProgress,
  formatTime
} from "modules/common-elements/progress";
import { createBigNumber } from "utils/create-big-number";
import { PrimaryButton } from "modules/common-elements/buttons";

import canClaimProceeds from "utils/can-claim-proceeds";

export default class MarketHeaderReporting extends Component {
  static propTypes = {
    currentTimestamp: PropTypes.number.isRequired,
    market: PropTypes.object.isRequired,
    isDesignatedReporter: PropTypes.bool,
    finalizeMarket: PropTypes.func.isRequired,
    claimTradingProceeds: PropTypes.func.isRequired,
    tentativeWinner: PropTypes.object,
    isLogged: PropTypes.bool,
    location: PropTypes.object.isRequired
  };

  static defaultProps = {
    isDesignatedReporter: false,
    tentativeWinner: {},
    isLogged: false
  };

  constructor(props) {
    super(props);
    this.state = {
      disableFinalize: false
    };
  }

  render() {
    const {
      market,
      isDesignatedReporter,
      finalizeMarket,
      claimTradingProceeds,
      tentativeWinner,
      isLogged,
      currentTimestamp,
      location
    } = this.props;
    const {
      reportingState,
      id,
      consensus,
      outstandingReturns,
      finalizationTime
    } = market;

    const canClaim = canClaimProceeds(
      finalizationTime,
      outstandingReturns,
      currentTimestamp
    );

    let content = null;
    if (consensus && (consensus.winningOutcome || consensus.isInvalid)) {
      content = (
        <div
          className={classNames(
            Styles.Content,
            Styles.Set
          )}
        >
          <div>
            <span>
              Winning Outcome
            </span>
            <span>
              {consensus.isInvalid
                ? "Invalid"
                : consensus.outcomeName || consensus.winningOutcome}
            </span>
          </div>
          {reportingState ===
            REPORTING_STATE.AWAITING_FINALIZATION && (
            <PrimaryButton
              id="button"
              action={() => {
                this.setState({ disableFinalize: true });
                finalizeMarket(id, err => {
                  if (err) {
                    this.setState({ disableFinalize: false });
                  }
                });
              }}
              text="Finalize"
              disabled={this.state.disableFinalize || !isLogged}
            />
          )}
          {outstandingReturns &&
            reportingState === REPORTING_STATE.FINALIZED && (
              <PrimaryButton
                id="button"
                action={() => {
                  claimTradingProceeds(id);
                }}
                text="Claim Proceeds"
                disabled={!isLogged || !canClaim}
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
            <span>
              Tentative Winning Outcome
            </span>
            {tentativeWinner &&
            (tentativeWinner.name || tentativeWinner.isInvalid) ? (
              <span>
                {tentativeWinner &&
                  (tentativeWinner.isInvalid
                    ? "Invalid"
                    : tentativeWinner.name)}
              </span>
            ) : (
              <div style={{ minHeight: "20px" }} />
            )}
          </div>
          {reportingState === REPORTING_STATE.CROWDSOURCING_DISPUTE && (
            <MarketLink
              id={id}
              linkType={TYPE_DISPUTE}
              location={location}
              disabled={!isLogged}
            >
              <PrimaryButton
                id="button"
                text="Dispute"
                action={() => {}}
                disabled={!isLogged}
              />
            </MarketLink>
          )}
        </div>
      );
    } else if (reportingState === REPORTING_STATE.OPEN_REPORTING) {
      content = (
        <div className={classNames(Styles.Content, Styles.Report)}>
          <div>
            <span>
              Tentative Winning Outcome
            </span>
            <span>
              Designated Reporter Failed to show. Please submit a report.
            </span>
          </div>
          <MarketLink
            id={id}
            location={location}
            disabled={!isLogged}
            linkType={TYPE_REPORT}
          >
            <PrimaryButton
              id="button"
              text="Submit Report"
              action={() => {}}
              disabled={!isLogged}
            />
          </MarketLink>
        </div>
      );
    } else if (
      reportingState === REPORTING_STATE.DESIGNATED_REPORTING
    ) {
      content = (
        <div className={classNames(Styles.Content, Styles.Report)}>
          <div>
            <span>
              Reporting has started
            </span>
            <span>
              {isDesignatedReporter
                ? "Please Submit a report"
                : "Awaiting the Market’s Designated Reporter"}
            </span>
          </div>
          {isLogged && isDesignatedReporter ? (
            <MarketLink
              id={id}
              location={location}
              disabled={!isLogged}
              linkType={TYPE_REPORT}
            >
              <PrimaryButton
                id="button"
                action={() => {}}
                text="Report"
              />
            </MarketLink>
          ) : null}
        </div>
      );
    }

    if (!content) {
      return <div className={Styles.Break} />;
    }

    let finalizationTimeWithHold = null;
    if (finalizationTime) {
      finalizationTimeWithHold = createBigNumber(finalizationTime)
        .plus(
          createBigNumber(CONTRACT_INTERVAL.CLAIM_PROCEEDS_WAIT_TIME)
        )
        .toNumber();
    }

    return (
      <>
        {reportingState === REPORTING_STATE.AWAITING_FINALIZATION && (
          <div className={Styles.Finalization}>
            <div>Awaiting market finalization</div>
            {!isLogged && (
              <div>
                Please Login to Finalize the market and start the three day
                waiting period in order to claim your proceeds.
              </div>
            )}
            {isLogged && (
              <div>
                Finalize the market to start the three day waiting period in
                order to claim your proceeds.
              </div>
            )}
          </div>
        )}
        {outstandingReturns &&
          !canClaim && (
            <div className={Styles.ClaimHold}>
              <div>
                <div>3 day waiting period in progress</div>
                <div>
                  Your proceeds will be available to claim once the 3 day period
                  has ended.
                </div>
              </div>
              <div>
                <CountdownProgress
                  label={MARKET_STATUS_MESSAGES.WAITING_PERIOD_ENDS}
                  time={formatTime(finalizationTimeWithHold)}
                  currentTime={formatTime(currentTimestamp)}
                />
              </div>
            </div>
          )}
        {content}
      </>
    );
  }
}
