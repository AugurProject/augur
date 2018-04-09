import React from 'react'
import PropTypes from 'prop-types'

import FormStyles from 'modules/common/less/form'
import ConfirmStyles from 'modules/common/less/confirm-table'

const ReportingDisputeConfirm = p => (
  <article>
    <div className={ConfirmStyles.Confirm}>
      <h2 className={ConfirmStyles.Confirm__heading}>Confirm Dispute</h2>
      <div className={ConfirmStyles['Confirm__wrapper--wide']}>
        <div className={ConfirmStyles.Confirm__creation}>
          <ul className={ConfirmStyles['Confirm__list--left-align']}>
            <li>
              <span>Proposed Outcome</span>
              <span>{ !p.isMarketInValid ? p.selectedOutcome : 'Invalid' }</span>
            </li>
            { p.stake &&
              <li>
                <span>Stake</span>
                <span>{ p.stake } REP</span>
              </li>
            }
            <li>
              <span>Gas</span>
              <span>{ p.gasEstimate } ETH</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </article>
)

ReportingDisputeConfirm.propTypes = {
  market: PropTypes.object.isRequired,
  selectedOutcome: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  stake: PropTypes.number.isRequired,
  gasEstimate: PropTypes.string.isRequired,
  isMarketInValid: PropTypes.bool,
}

export default ReportingDisputeConfirm
