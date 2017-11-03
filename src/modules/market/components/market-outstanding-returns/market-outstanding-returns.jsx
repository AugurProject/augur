import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import Styles from 'modules/market/components/market-outstanding-returns/market-outstanding-returns.styles'

const OutstandingReturns = (p) => {
  return (
    <div>
      Outstanding Returns {p.outstandingReturns.formatted}
    </div>
  )
}

export default OutstandingReturns
