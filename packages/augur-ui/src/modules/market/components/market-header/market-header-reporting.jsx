import React, { Component } from "react";
import classNames from "classnames";

import PropTypes from "prop-types";
import Styles from "modules/market/components/market-header/market-header-reporting.styles";
import { constants } from "services/constants";
import MarketLink from "modules/market/components/market-link/market-link";
import {
  CATEGORICAL,
  TYPE_DISPUTE,
  TYPE_REPORT,
  MARKET_STATUS_MESSAGES
} from "modules/common-elements/constants";
import {
  CountdownProgress,
  formatTime
} from "modules/common-elements/progress";
import { createBigNumber } from "utils/create-big-number";

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

    let CatWinnerColorIndex = null;
    const canClaim = canClaimProceeds(
      finalizationTime,
      outstandingReturns,
      currentTimestamp
    );

    if (market.marketType === CATEGORICAL) {
      if (tentativeWinner && tentativeWinner.id) {
        CatWinnerColorIndex = (parseInt(tentativeWinner.id, 10) + 1).toString();
      }
      if (consensus && consensus.winningOutcome) {
        CatWinnerColorIndex = parseInt(consensus.winningOutcome, 10).toString();
      }
    }
    let content = null;
    if (consensus && (consensus.winningOutcome || consensus.isInvalid)) {
      content = (
        <div
          className={classNames(
            Styles.MarketHeaderReporting__winner__container,
            Styles.MarketHeaderReporting__winner__container__set,
            Styles[
              `MarketHeaderReporting__winner__container__color__${CatWinnerColorIndex}`
            ]
          )}
        >
          <div className={Styles.MarketHeaderReporting__outcomeContainer}>
            <span className={Styles.MarketHeader__winning}>
              Winning Outcome
            </span>
            <span className={Styles.MarketHeaderReporting__winner__row}>
              <div className={Styles.MarketHeaderReporting__winner}>
                {consensus.isInvalid
                  ? "Invalid"
                  : consensus.outcomeName || consensus.winningOutcome}
              </div>
            </span>
          </div>
          {reportingState ===
            constants.REPORTING_STATE.AWAITING_FINALIZATION && (
            <div className={Styles.MarketHeaderReporting__buttonContainer}>
              <button
                className={Styles.MarketHeaderReporting__button}
                onClick={() => {
                  this.setState({ disableFinalize: true });
                  finalizeMarket(id, err => {
                    if (err) {
                      this.setState({ disableFinalize: false });
                    }
                  });
                }}
                disabled={this.state.disableFinalize || !isLogged}
              >
                Finalize
              </button>
            </div>
          )}
          {outstandingReturns &&
            reportingState === constants.REPORTING_STATE.FINALIZED && (
              <div className={Styles.MarketHeaderReporting__buttonContainer}>
                <button
                  className={Styles.MarketHeaderReporting__button}
                  onClick={() => {
                    claimTradingProceeds(id);
                  }}
                  disabled={!isLogged || !canClaim}
                >
                  Claim Proceeds
                </button>
              </div>
            )}
        </div>
      );
    } else if (
      reportingState === constants.REPORTING_STATE.CROWDSOURCING_DISPUTE ||
      reportingState === constants.REPORTING_STATE.AWAITING_FORK_MIGRATION ||
      reportingState === constants.REPORTING_STATE.AWAITING_NEXT_WINDOW
    ) {
      content = (
        <div className={Styles.MarketHeaderReporting__winner__container}>
          <div>
            <span className={Styles.MarketHeader__tentative}>
              Tentative Winning Outcome
            </span>
            <span className={Styles.MarketHeaderReporting__winner__row}>
              {tentativeWinner &&
              (tentativeWinner.name || tentativeWinner.isInvalid) ? (
                <div className={Styles.MarketHeaderReporting__winner}>
                  {tentativeWinner &&
                    (tentativeWinner.isInvalid
                      ? "Invalid"
                      : tentativeWinner.name)}
                </div>
              ) : (
                <div style={{ minHeight: "20px" }} />
              )}
            </span>
          </div>
          {reportingState === constants.REPORTING_STATE.CROWDSOURCING_DISPUTE &&
            isLogged && (
              <div
                className={classNames(
                  Styles.MarketHeaderReporting__winner,
                  Styles.MarketHeaderReporting__buttonContainer
                )}
              >
                <MarketLink
                  className={Styles.MarketHeaderReporting__button}
                  id={id}
                  linkType={TYPE_DISPUTE}
                  location={location}
                >
                  Dispute
                </MarketLink>
              </div>
            )}
          {reportingState === constants.REPORTING_STATE.CROWDSOURCING_DISPUTE &&
            !isLogged && (
              <div className={Styles.MarketHeaderReporting__buttonContainer}>
                <button
                  className={Styles.MarketHeaderReporting__button}
                  disabled={!isLogged}
                >
                  Dispute
                </button>
              </div>
            )}
        </div>
      );
    } else if (reportingState === constants.REPORTING_STATE.OPEN_REPORTING) {
      content = (
        <div className={Styles.MarketHeaderReporting__winner__container}>
          <div className={Styles.MarketHeaderReporting__info}>
            <span className={Styles.MarketHeader__reporting}>
              Tentative Winning Outcome
            </span>
            <span className={Styles.MarketHeaderReporting__reporting__row}>
              Designated Reporter Failed to show. Please submit a report.
            </span>
          </div>
          <div className={Styles.MarketHeaderReporting__buttonContainer}>
            {isLogged ? (
              <MarketLink
                className={Styles.MarketHeaderReporting__buttonNoMargin}
                id={id}
                location={location}
                disabled={!isLogged}
                linkType={TYPE_REPORT}
              >
                Submit Report
              </MarketLink>
            ) : (
              <button
                className={Styles.MarketHeaderReporting__buttonNoMargin}
                disabled={!isLogged}
              >
                Report
              </button>
            )}
          </div>
        </div>
      );
    } else if (
      reportingState === constants.REPORTING_STATE.DESIGNATED_REPORTING
    ) {
      content = (
        <div className={Styles.MarketHeaderReporting__winner__container}>
          <div className={Styles.MarketHeaderReporting__info}>
            <span className={Styles.MarketHeader__reporting}>
              Reporting has started
            </span>
            <span className={Styles.MarketHeaderReporting__reporting__row}>
              {isDesignatedReporter
                ? "Please Submit a report"
                : "Awaiting the Market’s Designated Reporter"}
            </span>
          </div>
          <div className={Styles.MarketHeaderReporting__buttonContainer}>
            {isLogged && isDesignatedReporter ? (
              <MarketLink
                className={Styles.MarketHeaderReporting__buttonNoMargin}
                id={id}
                location={location}
                disabled={!isLogged}
                linkType={TYPE_REPORT}
              >
                Submit Report
              </MarketLink>
            ) : null}
          </div>
        </div>
      );
    }

    if (!content) {
      return <div className={Styles.MarketHeaderReporting__break} />;
    }

    let finalizationTimeWithHold = null;
    if (finalizationTime) {
      finalizationTimeWithHold = createBigNumber(finalizationTime)
        .plus(
          createBigNumber(constants.CONTRACT_INTERVAL.CLAIM_PROCEEDS_WAIT_TIME)
        )
        .toNumber();
    }

    return (
      <>
        {reportingState === constants.REPORTING_STATE.AWAITING_FINALIZATION && (
          <div className={Styles.MarketHeaderReporting__finalization}>
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
            <div className={Styles.MarketHeaderReporting__claimOnHold}>
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
        <div className={Styles.MarketHeaderReporting__container}>{content}</div>
      </>
    );
  }
}
