import React from 'react'
import PropTypes from 'prop-types'

import FormStyles from 'modules/common/less/form'
import ConfirmStyles from 'modules/common/less/confirm-table'

const ReportingDisputeConfirm = p => (
  <article className={FormStyles.Form__fields}>
    <div className={ConfirmStyles.Confirm}>
      <h2 className={ConfirmStyles.Confirm__heading}>Confirm Dispute</h2>
      <div className={ConfirmStyles['Confirm__wrapper--wide']}>
        <div className={ConfirmStyles.Confirm__creation}>
          <ul className={ConfirmStyles.Confirm__list}>
            <li>
              <span>Disputed Outcome</span>
              <span>{ p.currentOutcome }</span>
            </li>
            <li>
              <span>Proposed Outcome</span>
              <span>{ p.isMarketValid ? p.selectedOutcome : 'Invalid' }</span>
            </li>
            <li>
              <span>Dispute Bond</span>
              <span>{ p.disputeBond }</span>
            </li>
            { p.stake &&
              <li>
                <span>Stake</span>
                <span>{ p.stake } REP</span>
              </li>
            }
            <li>
              <span>Gas</span>
              <span>0.0023 ETH (2.8%)</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </article>
)

ReportingDisputeConfirm.propTypes = {
  market: PropTypes.object.isRequired,
  selectedOutcome: PropTypes.string.isRequired,
  stake: PropTypes.string.isRequired,
  isMarketValid: PropTypes.bool,
}

export default ReportingDisputeConfirm
