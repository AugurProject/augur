import React from 'react'

import { CreateMarketEdit } from 'modules/common/components/icons'

import ValueDenomination from 'modules/common/components/value-denomination/value-denomination'

import getValue from 'utils/get-value'

import { MARKET, LIMIT } from 'modules/transactions/constants/types'

import Styles from 'modules/market/components/market-trading--confirm/market-trading--confirm.styles'

const MarketTradingConfirm = (p) => {
  const numShares = getValue(p, 'trade.numShares')
  const limitPrice = getValue(p, 'trade.limitPrice')
  const tradingFees = getValue(p, 'trade.totalFee')
  const feePercent = getValue(p, 'trade.totalFeePercent')
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
        { !p.isMobile &&
          <li>
            <span>Outcome</span>
            <span>{ p.selectedOutcome.name }</span>
          </li>
        }
        { p.orderType === MARKET &&
          <li>
            <span>Total Cost</span>
            <span><ValueDenomination formatted={totalCost ? totalCost.formatted : '0'} /> ETH</span>
          </li>
        }
        { p.orderType === LIMIT &&
          <li>
            <span>Quantity</span>
            <span>{ numShares } Shares</span>
          </li>
        }
        { p.orderType === LIMIT &&
          <li>
            <span>Limit Price</span>
            <span>{ limitPrice } ETH</span>
          </li>
        }
        <li>
          <span>Fee</span>
          <span>{tradingFees ? tradingFees.formattedValue : '0'} <span>ETH ({feePercent ? feePercent.formattedValue : '0'}%)</span></span>
        </li>
      </ul>
      { p.orderType === LIMIT &&
        <ul className={Styles.TradingConfirm__total}>
          <li>
            <span>Total Cost</span>
            <span><ValueDenomination formatted={totalCost ? totalCost.formatted : '0'} /> <span>ETH</span></span>
          </li>
        </ul>
      }
      { p.orderType === MARKET &&
        <ul className={Styles.TradingConfirm__total}>
          <li>
            <span>Quantity</span>
            <span>{ p.marketQuantity }</span>
          </li>
        </ul>
      }
      <ul className={Styles.TradingConfirm__potential}>
        <li>
          <span>Potential Profit</span>
          <span><ValueDenomination formatted={potentialEthProfit ? potentialEthProfit.formatted : '0'} /> <span>ETH ({potentialProfitPercent ? potentialProfitPercent.formatted : '0'}%)</span></span>
        </li>
        <li>
          <span>Potential Loss</span>
          <span><span><ValueDenomination formatted={potentialEthLoss ? potentialEthLoss.formatted : '0'} /> <span>ETH ({potentialLossPercent ? potentialLossPercent.formatted : '0'}%)</span></span></span>
        </li>
      </ul>
      <div className={Styles.TradingConfirmation__actions}>
        <button
          className={Styles['TradingConfirmation__button--back']}
          onClick={p.prevPage}
        >Back
        </button>
        <button
          className={Styles['TradingConfirmation__button--submit']}
          onClick={(e) => {
            p.market.onSubmitPlaceTrade(p.selectedOutcome.id, (err, tradeGroupID) => {
              // onSent/onFailed CB
              if (!err) {
                p.showOrderPlaced()
              }
            }, (res) => {
              // onComplete CB
            })
            p.prevPage()
          }}
        >Confirm
        </button>
      </div>
    </section>
  )
}

export default MarketTradingConfirm
