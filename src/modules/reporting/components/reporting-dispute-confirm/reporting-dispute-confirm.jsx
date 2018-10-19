import React from "react";
import PropTypes from "prop-types";

import ConfirmStyles from "modules/common/less/confirm-table";

const ReportingDisputeConfirm = ({
  isMarketInValid,
  selectedOutcome,
  gasEstimate,
  stakeInfo
}) => (
  <article>
    <div className={ConfirmStyles.Confirm}>
      <h2 className={ConfirmStyles.Confirm__heading}>Confirm Dispute</h2>
      <div className={ConfirmStyles["Confirm__wrapper--wide"]}>
        <div className={ConfirmStyles.Confirm__creation}>
          <ul className={ConfirmStyles["Confirm__list--left-align"]}>
            <li>
              <span>Proposed Outcome</span>
              <span>{!isMarketInValid ? selectedOutcome : "Invalid"}</span>
            </li>
            {stakeInfo &&
              stakeInfo.displayValue && (
                <li>
                  <span>Stake</span>
                  <span>{stakeInfo.displayValue} REP</span>
                </li>
              )}
            <li>
              <span>Gas</span>
              <span>{gasEstimate} ETH</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </article>
);

ReportingDisputeConfirm.propTypes = {
  selectedOutcome: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
  stakeInfo: PropTypes.object.isRequired,
  gasEstimate: PropTypes.string.isRequired,
  isMarketInValid: PropTypes.bool.isRequired
};

export default ReportingDisputeConfirm;
