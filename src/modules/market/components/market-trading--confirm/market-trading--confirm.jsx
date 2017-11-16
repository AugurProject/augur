import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import { CreateMarketEdit } from 'modules/common/components/icons/icons'

import ValueDenomination from 'modules/common/components/value-denomination/value-denomination'

import getValue from 'utils/get-value'

import Styles from 'modules/market/components/market-trading--confirm/market-trading--confirm.styles'

class MarketTradingConfirm extends Component {
  constructor(props) {
    super(props)

    this.state = {
    }
  }

  render() {
    const s = this.state
    const p = this.props

    const tradingFees = '0.0023'
    const feePercent = '2.8'
    const gasFees = getValue(p, 'tradeOrder.gasFees')
    const potentialEthProfit = getValue(p, 'trade.potentialEthProfit')
    const potentialProfitPercent = getValue(p, 'trade.potentialProfitPercent')
    const potentialEthLoss = getValue(p, 'trade.potentialEthLoss')
    const potentialLossPercent = getValue(p, 'trade.potentialLossPercent')
    const totalCost = getValue(p, 'trade.totalCost')

    return (
      <section className={Styles.TradingConfirm}>
        <div className={Styles.TradingConfirm__header}>
          <h2>Confirm { p.selectedNav } order?</h2>
          <button onClick={p.prevPage}>{ CreateMarketEdit }</button>
        </div>
        <ul className={Styles.TradingConfirm__details}>
          <li><span>Outcome</span><span>{ p.selectedOutcome.name }</span></li>
          <li><span>Quantity</span><span>{ p.orderQuantity } Shares</span></li>
          <li><span>Limit Price</span><span>{ p.orderPrice } ETH</span></li>
          <li>
            <span>Fee</span>
            <span>{tradingFees} <span>ETH ({feePercent}%)</span></span>
          </li>
        </ul>
        <ul className={Styles.TradingConfirm__total}>
          <li>
            <span>Total Cost</span>
            <span><ValueDenomination formatted={totalCost.formatted} /> <span>ETH</span></span>
          </li>
        </ul>
        <ul className={Styles.TradingConfirm__potential}>
          <li>
            <span>Potential Profit</span>
            <span><ValueDenomination formatted={potentialEthProfit.formatted} /> <span>ETH ({potentialProfitPercent.formatted}%)</span></span>
          </li>
          <li>
            <span>Potential Loss</span>
            <span><span><ValueDenomination formatted={potentialEthLoss.formatted} /> <span>ETH ({potentialLossPercent.formatted}%)</span></span></span>
          </li>
        </ul>
        <div className={Styles.TradingConfirmation__actions}>
          <button
            className={Styles['TradingConfirmation__button--back']}
            onClick={p.prevPage}
          >Back</button>
          <button
            className={Styles['TradingConfirmation__button--submit']}
            onClick={e => console.log('submit order')}
          >Confirm</button>
        </div>
      </section>
    )
  }
}

export default MarketTradingConfirm
