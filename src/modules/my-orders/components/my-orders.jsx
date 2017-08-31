import React from 'react'
import PropTypes from 'prop-types'

import MarketOpenOrdersGroup from 'modules/market/components/market-open-orders-group'

import { SCALAR } from 'modules/markets/constants/market-types'

import getValue from 'utils/get-value'

const MyOrders = p => (
  <article className="my-orders market-open-orders">
    <div className="market-open-orders-header">
      <span>{!p.marketType === SCALAR ? 'Outcomes' : 'Outcome'}</span>
      <span>Type</span>
      <span>Shares</span>
      <span>Price</span>
      <span>Action</span>
    </div>
    {(p.outcomes || []).map((outcome, index) => {
      const lastPricePercent = getValue(outcome, 'lastPricePercent.rounded')

      return (
        <MarketOpenOrdersGroup
          key={outcome.name}
          id={outcome.id}
          name={outcome.name}
          marketType={p.marketType}
          lastPricePercent={lastPricePercent}
          userOpenOrders={outcome.userOpenOrders}
          orderCancellation={p.orderCancellation}
          selectedShareDenomination={p.selectedShareDenomination}
        />
      )
    })}
  </article>
)

MyOrders.propTypes = {
  outcomes: PropTypes.array.isRequired,
  marketType: PropTypes.string.isRequired,
  orderCancellation: PropTypes.object.isRequired
}

export default MyOrders
