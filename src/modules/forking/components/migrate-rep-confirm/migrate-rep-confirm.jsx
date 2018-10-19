import React from "react";
import PropTypes from "prop-types";

import ConfirmStyles from "modules/common/less/confirm-table";

const MigrateRepConfirm = ({ selectedOutcomeName, repAmount, gasEstimate }) => (
  <article className={ConfirmStyles.Confirm}>
    <h2 className={ConfirmStyles.Confirm__heading}>Confirm Migration</h2>
    <div className={ConfirmStyles["Confirm__wrapper--wide"]}>
      <div className={ConfirmStyles.Confirm__creation}>
        <ul className={ConfirmStyles["Confirm__list--left-align"]}>
          <li>
            <span>Outcome</span>
            <span>
              {selectedOutcomeName === "Indeterminate"
                ? "Invalid"
                : selectedOutcomeName}
            </span>
          </li>
          <li>
            <span>Migrating</span>
            <span>{repAmount} REP</span>
          </li>
          <li>
            <span>Gas</span>
            <span>{gasEstimate} ETH</span>
          </li>
        </ul>
      </div>
    </div>
    <div className={ConfirmStyles.Confirm__note_text}>
      After migrating your REP, select which universe to view on the Account:
      Universe page.
    </div>
  </article>
);

MigrateRepConfirm.propTypes = {
  selectedOutcomeName: PropTypes.string.isRequired,
  repAmount: PropTypes.string.isRequired,
  gasEstimate: PropTypes.string.isRequired
};

export default MigrateRepConfirm;
