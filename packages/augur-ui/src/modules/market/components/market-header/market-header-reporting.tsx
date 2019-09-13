import React, { Component } from "react";
import classNames from "classnames";

import PropTypes from "prop-types";
import Styles from "modules/market/components/market-header/market-header-reporting.styles.less";
import MarketLink from "modules/market/components/market-link/market-link";
import {
  TYPE_DISPUTE,
  TYPE_REPORT,
  REPORTING_STATE,
} from "modules/common/constants";
import { PrimaryButton } from "modules/common/buttons";
import { createBigNumber } from "utils/create-big-number";
import { ZERO } from 'modules/common/constants';

export default class MarketHeaderReporting extends Component {
  static propTypes = {
    market: PropTypes.object.isRequired,
    isDesignatedReporter: PropTypes.bool,
    claimMarketsProceeds: PropTypes.func.isRequired,
    tentativeWinner: PropTypes.object,
    isLogged: PropTypes.bool,
    location: PropTypes.object.isRequired,
    accountPositions: PropTypes.object.isRequired,
  };

  static defaultProps = {
    isDesignatedReporter: false,
    tentativeWinner: {},
    isLogged: false,
  };

  constructor(props) {
    super(props);
    this.state = {
      disableFinalize: false,
    };
  }

  render() {
    const {
      market,
      isDesignatedReporter,
      claimMarketsProceeds,
      tentativeWinner,
      isLogged,
      location,
      accountPositions
    } = this.props;
    const {
      reportingState,
      id,
      consensus,
      finalizationTime,
    } = market;

    let canClaim = false;
    if (
      accountPositions[id] &&
      accountPositions[id].tradingPositionsPerMarket &&
      createBigNumber(
        accountPositions[id].tradingPositionsPerMarket.totalUnclaimedProceeds
      ).gt(ZERO)
    ) {
      canClaim = true;
    }

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
                : consensus.outcomeName || consensus.winningOutcome}}
            </span>
          </div>
          {canClaim && (
              <PrimaryButton
                id="button"
                action={() => {
                  claimMarketsProceeds([id]);
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
      return <div className={Styles.EmptyBreak} />;
    }

    return (
      <>
      {content}
      </>
    );
  }
}
