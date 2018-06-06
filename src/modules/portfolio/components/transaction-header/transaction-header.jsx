import React from 'react'
import PropTypes from 'prop-types'

import MarketLink from 'modules/market/components/market-link/market-link'

import Styles from 'modules/portfolio/components/transaction-header/transaction-header.styles'

const TransactionHeader = ({ transaction }) => {
  const marketId = transaction.transactions && transaction.transactions[0] && transaction.transactions[0].marketId

  return (
    <div>
      <h5 className={Styles.TransactionHeader__status}>{ transaction.status }</h5>
      <h3 className={Styles.TransactionHeader__message}>{ transaction.message || transaction.type }</h3>
      { marketId ?
        <MarketLink id={marketId} formattedDescription={transaction.description}>
          <h4 className={Styles.TransactionHeader__description}>{ transaction.description }</h4>
        </MarketLink>
        : <h4 className={Styles.TransactionHeader__description}>{ transaction.description }</h4>
      }
      <h4 className={Styles.TransactionHeader__date}>{ transaction.timestamp && transaction.timestamp.full }</h4>
    </div>
  )
}
TransactionHeader.propTypes = {
  transaction: PropTypes.object.isRequired,
}

export default TransactionHeader
