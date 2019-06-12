import React from "react";

import ConfirmStyles from "modules/common/confirm-table.less";

interface MigrateRepConfirmProps {
  selectedOutcomeName: string;
  repAmount: string;
  gasEstimate: string;
}

const MigrateRepConfirm = ({ selectedOutcomeName, repAmount, gasEstimate }: MigrateRepConfirmProps) => (
  <article className={ConfirmStyles.Confirm}>
    <h2 className={ConfirmStyles.Confirm__heading}>Confirm Migration</h2>
    <div className={ConfirmStyles["Confirm__wrapper--wide"]}>
      <div>
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

export default MigrateRepConfirm;
