import React, { Component } from 'react'

import MarketOpenOrdersGroup from 'modules/market/components/market-open-orders-group'
import NullStateMessage from 'modules/common/components/null-state-message'

import { SCALAR } from 'modules/markets/constants/market-types'

import getValue from 'utils/get-value'

export default class MarketOpenOrders extends Component {
  constructor(props) {
    super(props)

    this.state = {
      nullMessage: 'No Current Open Orders',
      hasOrders: false
    }

    this.updateHasOrders = this.updateHasOrders.bind(this)
  }

  componentWillMount() {
    this.updateHasOrders(this.props)
  }

  componentWillReceiveProps(nextProps) {
    this.updateHasOrders(nextProps)
  }

  updateHasOrders(props) {
    this.setState({ hasOrders: !!(props.outcomes || []).find(outcome => outcome.userOpenOrders && outcome.userOpenOrders.length) })
  }

  render() {
    const p = this.props
    const s = this.state

    return (
      <article className="market-open-orders">
        {!s.hasOrders ?
          <NullStateMessage message={s.nullMessage} /> :
          <div>
            <div className="market-open-orders-header">
              <span>{!p.marketType === SCALAR ? 'Outcomes' : 'Outcome'}</span>
              <span>Type</span>
              <span>Shares</span>
              <span>Price</span>
              <span>Action</span>
            </div>
            <div className="market-content-scrollable" >
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
            </div>
          </div>
        }
      </article>
    )
  }
}
