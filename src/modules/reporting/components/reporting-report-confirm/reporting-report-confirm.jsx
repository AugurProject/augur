import React from 'react'
import PropTypes from 'prop-types'

import FormStyles from 'modules/common/less/form'
import ConfirmStyles from 'modules/common/less/confirm-table'

const ReportingReportConfirm = p => (
  <article className={FormStyles.Form__fields}>
    <div className={ConfirmStyles.Confirm}>
      <h2 className={ConfirmStyles.Confirm__heading}>Confirm Report</h2>
      <div className={ConfirmStyles['Confirm__wrapper--wide']}>
        <div className={ConfirmStyles.Confirm__creation}>
          <ul className={ConfirmStyles.Confirm__list}>
            <li>
              <span>Market</span>
              <span>{ p.isMarketValid ? 'Valid' : 'Invalid' }</span>
            </li>
            { p.isMarketValid &&
              <li>
                <span>Outcome</span>
                <span>{ p.selectedOutcome }</span>
              </li>
            }
            <li>
              <span>Stake</span>
              <span>{ p.stake } REP</span>
            </li>
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

ReportingReportConfirm.propTypes = {
  market: PropTypes.object.isRequired,
  selectedOutcome: PropTypes.string.isRequired,
  stake: PropTypes.string.isRequired,
  isMarketValid: PropTypes.bool,
}

export default ReportingReportConfirm
