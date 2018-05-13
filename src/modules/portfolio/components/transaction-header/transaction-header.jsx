import React from 'react'
import PropTypes from 'prop-types'

import Styles from 'modules/portfolio/components/transaction-header/transaction-header.styles'

const TransactionHeader = ({ transaction }) => (
  <div>
    <h5 className={Styles.TransactionHeader__status}>{ transaction.status }</h5>
    <h3 className={Styles.TransactionHeader__message}>{ transaction.message || transaction.type }</h3>
    <h4 className={Styles.TransactionHeader__description}>{ transaction.description }</h4>
    <h4 className={Styles.TransactionHeader__date}>{ transaction.timestamp.full }</h4>
  </div>
)

TransactionHeader.propTypes = {
  transaction: PropTypes.object.isRequired,
}

export default TransactionHeader
