import React from 'react'
import PropTypes from 'prop-types'
import { BigNumber } from 'utils/create-big-number'

import ConfirmStyles from 'modules/common/less/confirm-table'

const ReportingReportConfirm = p => (
  <article className={ConfirmStyles.Confirm}>
    <h2 className={ConfirmStyles.Confirm__heading}>Confirm Report</h2>
    <div className={ConfirmStyles['Confirm__wrapper--wide']}>
      <div className={ConfirmStyles.Confirm__creation}>
        <ul className={ConfirmStyles['Confirm__list--left-align']}>
          <li>
            <span>Outcome</span>
            <span>{ p.isMarketInValid ? 'Market is Invalid' : p.selectedOutcome }</span>
          </li>
          { !p.isOpenReporting &&
          <li>
            <span>Stake</span>
            <span>{ BigNumber.isBigNumber(p.stake) ? p.stake.toNumber() : p.stake } REP</span>
          </li>
          }
          <li>
            <span>Gas</span>
            <span>{ p.gasEstimate } ETH</span>
          </li>
        </ul>
      </div>
    </div>
    { p.isOpenReporting && p.designatedReportNoShowReputationBond && p.reporterGasCost &&
      <div className={ConfirmStyles.Confirm__note_text}>
      If your report is accepted as the winning outcome, you will receive at least {p.designatedReportNoShowReputationBond.formatted} REP and {p.reporterGasCost.formatted} ETH
      </div>
    }
  </article>
)

ReportingReportConfirm.propTypes = {
  market: PropTypes.object.isRequired,
  selectedOutcome: PropTypes.string.isRequired,
  stake: PropTypes.string.isRequired,
  gasEstimate: PropTypes.string.isRequired,
  isMarketInValid: PropTypes.bool,
  isOpenReporting: PropTypes.bool.isRequired,
  designatedReportNoShowReputationBond: PropTypes.object,
  reporterGasCost: PropTypes.object,
}

export default ReportingReportConfirm
