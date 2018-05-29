import React from 'react'
import PropTypes from 'prop-types'

import ConfirmStyles from 'modules/common/less/confirm-table'

const MigrateRepConfirm = p => (
  <article className={ConfirmStyles.Confirm}>
    <h2 className={ConfirmStyles.Confirm__heading}>Confirm Migration</h2>
    <div className={ConfirmStyles['Confirm__wrapper--wide']}>
      <div className={ConfirmStyles.Confirm__creation}>
        <ul className={ConfirmStyles['Confirm__list--left-align']}>
          <li>
            <span>Outcome</span>
            <span>{ p.selectedOutcomeName === 'Indeterminate' ? 'Invalid' : p.selectedOutcomeName }</span>
          </li>
          <li>
            <span>Migrating</span>
            <span>{ p.repAmount } REP</span>
          </li>
          <li>
            <span>Gas</span>
            <span>{ p.gasEstimate } ETH</span>
          </li>
        </ul>
      </div>
    </div>
    <div className={ConfirmStyles.Confirm__note_text}>After migrating your REP, select which universe to view on the Account: Universe page.</div>
  </article>
)

MigrateRepConfirm.propTypes = {
  market: PropTypes.object.isRequired,
  selectedOutcomeName: PropTypes.string.isRequired,
  repAmount: PropTypes.string.isRequired,
  gasEstimate: PropTypes.string.isRequired,
  isMarketInValid: PropTypes.bool,
}

export default MigrateRepConfirm
