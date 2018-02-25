/* eslint-disable jsx-a11y/no-static-element-interactions */ // Allowed in this case due to desired functionality + component structure

import React from 'react'
import classNames from 'classnames'

import ValueDenomination from 'modules/common/components/value-denomination/value-denomination'
import OutcomeTrade from 'modules/outcomes/components/outcome-trade'

import { BUY, SELL } from 'modules/transactions/constants/types'
import { PRICE, SHARE } from 'modules/order-book/constants/order-book-value-types'
import { SCALAR } from 'modules/markets/constants/market-types'

import getValue from 'utils/get-value'

const Outcome = (p) => {
  const selectedOutcomeId = getValue(p, 'selectedOutcome.id')

  const outcomeName = getValue(p, 'outcome.name')

  const topBidShares = getValue(p, 'outcome.topBid.shares.formatted')
  const topAskShares = getValue(p, 'outcome.topAsk.shares.formatted')

  const topBidPrice = getValue(p, 'outcome.topBid.price.formatted')
  const topAskPrice = getValue(p, 'outcome.topAsk.price.formatted')

  const lastPrice = getValue(p, 'outcome.lastPrice.formatted')
  const lastPricePercent = getValue(p, 'outcome.lastPricePercent.rounded')

  return (
    <article className={classNames('outcome', { selected: selectedOutcomeId === p.outcome.id })}>
      <a
        className={classNames('unstlyed outcome-row-full', { selected: selectedOutcomeId === p.outcome.id })}
        onClick={() => { p.updateSelectedOutcome(p.outcome) }}
      >
        {p.marketType === SCALAR ?
          <ValueDenomination formatted={lastPricePercent} /> :
          <span className="outcome">{outcomeName}</span>
        }
        <button
          className="unstyled"
          onClick={() => {
            p.updateTradeFromSelectedOrder(p.outcome.id, 0, BUY, SHARE)
          }}
        >
          <ValueDenomination formatted={topBidShares} />
        </button>
        <button
          className="unstyled"
          onClick={() => {
            p.updateTradeFromSelectedOrder(p.outcome.id, 0, BUY, PRICE)
          }}
        >
          <ValueDenomination className="emphasized" formatted={topBidPrice} />
        </button>
        <button
          className="unstyled"
          onClick={() => {
            p.updateTradeFromSelectedOrder(p.outcome.id, 0, SELL, PRICE)
          }}
        >
          <ValueDenomination className="emphasized" formatted={topAskPrice} />
        </button>
        <button
          className="unstyled"
          onClick={() => {
            p.updateTradeFromSelectedOrder(p.outcome.id, 0, SELL, SHARE)
          }}
        >
          <ValueDenomination formatted={topAskShares} />
        </button>
        <ValueDenomination formatted={lastPrice} />
      </a>
      <a
        className={classNames('unstlyed outcome-row-condensed', { selected: selectedOutcomeId === p.outcome.id })}
        onClick={() => { p.updateSelectedOutcome(p.outcome) }}
      >
        {p.marketType === SCALAR ?
          <ValueDenomination formatted={lastPricePercent} /> :
          <span className="outcome-summary">
            <span className="outcome-name">{outcomeName}</span>
            <span>Last Price: <ValueDenomination formatted={lastPrice} /></span>
          </span>
        }
        <span className="outcome-best-orders outcome-best-bid">
          <button
            className="unstyled"
            onClick={() => {
              p.updateTradeFromSelectedOrder(p.outcome.id, 0, BUY, SHARE)
            }}
          >
            <span className="outcome-best-container">
              <ValueDenomination className="emphasized" formatted={topBidPrice} />
              <ValueDenomination formatted={topBidShares} />
            </span>
          </button>
        </span>
        <span className="outcome-best-orders outcome-best-ask">
          <button
            className="unstyled"
            onClick={() => {
              p.updateTradeFromSelectedOrder(p.outcome.id, 0, SELL, SHARE)
            }}
          >
            <span className="outcome-best-container">
              <ValueDenomination className="emphasized" formatted={topAskPrice} />
              <ValueDenomination formatted={topAskShares} />
            </span>
          </button>
        </span>
      </a>
      <OutcomeTrade
        marketType={p.marketType}
        selectedOutcome={p.selectedOutcome}
        tradeSummary={p.tradeSummary}
        submitTrade={p.submitTrade}
        selectedTradeSide={p.selectedTradeSide}
        selectedShareDenomination={p.selectedShareDenomination}
        updateSelectedTradeSide={p.updateSelectedTradeSide}
        outcomeTradeNavItems={p.outcomeTradeNavItems}
        minLimitPrice={p.minLimitPrice}
        maxLimitPrice={p.maxLimitPrice}
      />
    </article>
  )
}

export default Outcome
