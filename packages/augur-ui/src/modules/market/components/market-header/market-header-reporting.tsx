import React, { Component } from 'react';
import classNames from 'classnames';

import PropTypes from 'prop-types';
import Styles from 'modules/market/components/market-header/market-header-reporting.styles.less';
import {
  TYPE_DISPUTE,
  TYPE_REPORT,
  REPORTING_STATE,
  SCALAR,
} from 'modules/common/constants';
import { PrimaryButton } from 'modules/common/buttons';
import { getOutcomeNameWithOutcome } from 'utils/get-outcome';

export default class MarketHeaderReporting extends Component {
  static propTypes = {
    market: PropTypes.object.isRequired,
    isDesignatedReporter: PropTypes.bool,
    claimMarketsProceeds: PropTypes.func.isRequired,
    tentativeWinner: PropTypes.object,
    isLogged: PropTypes.bool,
    location: PropTypes.object.isRequired,
    canClaimProceeds: PropTypes.bool,
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
      canClaimProceeds,
      showReportingModal,
    } = this.props;
    const { reportingState, id, consensusFormatted: consensus } = market;
    let content = null;
    const winningOutcomeName =
      market.marketType === SCALAR
        ? market.consensus.outcome
        : getOutcomeNameWithOutcome(
            market,
            tentativeWinner && tentativeWinner.outcome,
            tentativeWinner && tentativeWinner.isInvalid
          );

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
                    : winningOutcomeName)}
              </span>
            ) : (
              <div style={{ minHeight: '20px' }} />
            )}
          </div>
          {reportingState === REPORTING_STATE.CROWDSOURCING_DISPUTE && (
            <PrimaryButton
              id="button"
              text="Support or Dispute Outcome"
              action={() => {}}
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
