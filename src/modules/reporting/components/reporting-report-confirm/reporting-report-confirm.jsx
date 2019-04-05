import React from "react";
import PropTypes from "prop-types";

import ConfirmStyles from "modules/common/less/confirm-table";

const ReportingReportConfirm = ({
  selectedOutcome,
  stake,
  stakeLabel,
  gasEstimate,
  isMarketInValid,
  isDesignatedReporter,
  designatedReportNoShowReputationBond
}) => (
  <article className={ConfirmStyles.Confirm}>
    <h2 className={ConfirmStyles.Confirm__heading}>Confirm Report</h2>
    <div className={ConfirmStyles["Confirm__wrapper--wide"]}>
      <div className={ConfirmStyles.Confirm__creation}>
        <ul className={ConfirmStyles["Confirm__list--left-align"]}>
          <li>
            <span>Outcome</span>
            <span>
              {isMarketInValid ? "Market is Invalid" : selectedOutcome}
            </span>
          </li>
          <li>
            <span>{stakeLabel}</span>
            <span>{stake} REP</span>
          </li>
          <li>
            <span>Gas</span>
            <span>{gasEstimate} ETH</span>
          </li>
        </ul>
      </div>
    </div>
    {!isDesignatedReporter &&
      designatedReportNoShowReputationBond && (
        <div className={ConfirmStyles.Confirm__note_text}>
          If your report is accepted as the winning outcome, you will receive at
          least {designatedReportNoShowReputationBond.formatted} REP
        </div>
      )}
  </article>
);

ReportingReportConfirm.propTypes = {
  selectedOutcome: PropTypes.string.isRequired,
  stake: PropTypes.string.isRequired,
  stakeLabel: PropTypes.string.isRequired,
  gasEstimate: PropTypes.string.isRequired,
  isMarketInValid: PropTypes.bool.isRequired,
  isDesignatedReporter: PropTypes.bool.isRequired,
  designatedReportNoShowReputationBond: PropTypes.object
};

ReportingReportConfirm.defaultProps = {
  designatedReportNoShowReputationBond: null
};

export default ReportingReportConfirm;
