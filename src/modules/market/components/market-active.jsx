import React, { Component } from 'react'
import PropTypes from 'prop-types'

import MarketData from 'modules/market/components/market-data'
import MarketUserData from 'modules/market/components/market-user-data'
import OrderBook from 'modules/order-book/components/order-book'
import OutcomeTrade from 'modules/outcomes/components/outcome-trade'

import { SHARE, MILLI_SHARE, MICRO_SHARE } from 'modules/market/constants/share-denominations'
import { PRICE } from 'modules/order-book/constants/order-book-value-types'
import { BUY, SELL } from 'modules/transactions/constants/types'
import { BIDS, ASKS } from 'modules/order-book/constants/order-book-order-types'
import { SCALAR } from 'modules/markets/constants/market-types'

import getValue from 'utils/get-value'

export default class MarketActive extends Component {
  constructor(props) {
    super(props)

    const defaultSelectedOutcome = getValue(this.props, 'market.outcomes')

    this.state = {
      selectedOutcome: defaultSelectedOutcome && defaultSelectedOutcome[0],
      selectedTradeSide: {}
    }

    this.updateSelectedOutcome = this.updateSelectedOutcome.bind(this)
    this.updateSelectedTradeSide = this.updateSelectedTradeSide.bind(this)
    this.determineDefaultShareDenomination = this.determineDefaultShareDenomination.bind(this)
    this.updateTradeFromSelectedOrder = this.updateTradeFromSelectedOrder.bind(this)
  }

  componentWillMount() {
    const marketType = getValue(this.props, 'market.type')

    if (marketType === SCALAR) {
      this.determineDefaultShareDenomination()
    }
  }

  componentWillReceiveProps(nextProps) {
    const selectedOutcomeID = getValue(this.state, 'selectedOutcome.id')
    const nextPropsOutcome = nextProps.market.outcomes.find(outcome => outcome.id === selectedOutcomeID)

    if (JSON.stringify(nextPropsOutcome) !== JSON.stringify(this.state.selectedOutcome)) {
      this.setState({ selectedOutcome: nextPropsOutcome })
    }

    if (!selectedOutcomeID) {
      const availableDefaultOutcome = getValue(nextProps, 'market.outcomes')
      if (availableDefaultOutcome && availableDefaultOutcome[0]) {
        this.setState({ selectedOutcome: availableDefaultOutcome[0] })
      }
    }
  }

  updateSelectedOutcome(selectedOutcome) {
    this.setState({ selectedOutcome })
  }

  updateSelectedTradeSide(selectedTradeSide, id) {
    this.setState({
      selectedTradeSide: {
        ...this.state.selectedTradeSide,
        [id]: selectedTradeSide
      }
    })
  }

  updateTradeFromSelectedOrder(outcomeID, orderIndex, side, orderValueType) {
    const outcomes = getValue(this.props, 'market.outcomes')

    if (outcomes) {
      const outcome = outcomes.find(outcome => outcome.id === outcomeID)
      const orderBookSide = getValue(outcome, `orderBook.${side === BUY ? BIDS : ASKS}`)
      const order = (orderBookSide && orderBookSide[orderIndex]) || null
      const price = getValue(order, 'price.value') || ''
      const { trade } = outcome
      const tradeSide = side === BUY ? SELL : BUY

      if (orderValueType === PRICE) {
        trade.updateTradeOrder(0, null, tradeSide) // Clear Shares
        if (price === '') {
          trade.updateTradeOrder(null, price, tradeSide)
          trade.updateTradeOrder(null, null, tradeSide)
        } else {
          trade.updateTradeOrder(null, price, tradeSide)
        }
      } else {
        const shares = trade.totalSharesUpToOrder(orderIndex, side)

        trade.updateTradeOrder(shares, price, tradeSide)
      }

      this.updateSelectedTradeSide(tradeSide, outcomeID)
    }
  }

  // NOTE -- only called if a market is of type SCALAR from `componentWillMount`
  determineDefaultShareDenomination() {
    const marketID = getValue(this.props, 'market.id')
    const shareDenomination = getValue(this.props, `scalarShareDenomination.markets.${marketID}`)

    if (!shareDenomination) {
      const maxPrice = getValue(this.props, 'market.maxPrice')

      if (maxPrice >= 10000000) {
        this.props.scalarShareDenomination.updateSelectedShareDenomination(marketID, MICRO_SHARE)
      } else if (maxPrice >= 10000) {
        this.props.scalarShareDenomination.updateSelectedShareDenomination(marketID, MILLI_SHARE)
      } else {
        this.props.scalarShareDenomination.updateSelectedShareDenomination(marketID, SHARE)
      }
    }
  }

  render() {
    const p = this.props
    const s = this.state

    const marketID = getValue(p, 'market.id')
    const tradeSummary = getValue(p, 'market.tradeSummary')
    const submitTrade = getValue(p, 'market.onSubmitPlaceTrade')
    const marketType = getValue(p, 'market.type')
    const minPrice = getValue(p, 'market.minPrice')
    const maxPrice = getValue(p, 'market.maxPrice')

    const selectedShareDenomination = getValue(p, `scalarShareDenomination.markets.${marketID}`)
    const shareDenominations = getValue(p, 'scalarShareDenomination.denominations')
    const updateSelectedShareDenomination = getValue(p, 'scalarShareDenomination.updateSelectedShareDenomination')

    return (
      <article className="market-active">
        <div className="market-group">
          <MarketData
            {...p}
            marketID={marketID}
            marketType={marketType}
            selectedOutcome={s.selectedOutcome}
            updateSelectedOutcome={this.updateSelectedOutcome}
            selectedShareDenomination={selectedShareDenomination}
            shareDenominations={shareDenominations}
            updateSelectedShareDenomination={updateSelectedShareDenomination}
            tradeSummary={tradeSummary}
            submitTrade={(id) => { submitTrade(id) }}
            selectedTradeSide={s.selectedTradeSide}
            updateSelectedTradeSide={this.updateSelectedTradeSide}
            updateTradeFromSelectedOrder={this.updateTradeFromSelectedOrder}
            outcomeTradeNavItems={p.outcomeTradeNavItems}
            minLimitPrice={minPrice}
            maxLimitPrice={maxPrice}
          />
          <OrderBook
            marketType={marketType}
            outcome={s.selectedOutcome}
            selectedTradeSide={s.selectedTradeSide}
            updateTradeFromSelectedOrder={this.updateTradeFromSelectedOrder}
            selectedShareDenomination={selectedShareDenomination}
          />
        </div>
        {p.isLogged &&
          <div className="market-group">
            <MarketUserData
              {...p}
              marketType={marketType}
              navItems={p.marketUserDataNavItems}
              selectedShareDenomination={selectedShareDenomination}
            />
            <OutcomeTrade
              marketType={marketType}
              selectedOutcome={s.selectedOutcome}
              tradeSummary={tradeSummary}
              submitTrade={(id) => { submitTrade(id) }}
              selectedTradeSide={s.selectedTradeSide}
              selectedShareDenomination={selectedShareDenomination}
              updateSelectedTradeSide={this.updateSelectedTradeSide}
              outcomeTradeNavItems={p.outcomeTradeNavItems}
              minLimitPrice={minPrice}
              maxLimitPrice={maxPrice}
            />
          </div>
        }
      </article>
    )
  }
}

MarketActive.propTypes = {
  market: PropTypes.shape({
    outcomes: PropTypes.array
  }),
  scalarShareDenomination: PropTypes.shape({
    updateSelectedShareDenomination: PropTypes.func
  })
}
