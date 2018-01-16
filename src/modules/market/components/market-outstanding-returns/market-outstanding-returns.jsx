import React from 'react'
import PropTypes from 'prop-types'

import Styles from 'modules/market/components/market-outstanding-returns/market-outstanding-returns.styles'

const OutstandingReturns = p => (
  <div className={Styles.MarketOutstandingReturns}>
    Outstanding Returns {p.unclaimedCreatorFees.full}
    <div className={Styles.MarketOutstandingReturns__actions}>
      <button
        className={Styles.MarketOutstandingReturns__collect}
        onClick={() => {
          p.collectMarketCreatorFees(p.id)
        }}
      >
        Collect Returns
      </button>
    </div>
  </div>
)

OutstandingReturns.propTypes = {
  unclaimedCreatorFees: PropTypes.object.isRequired
}

export default OutstandingReturns
