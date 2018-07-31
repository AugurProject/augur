/* eslint-disable jsx-a11y/no-static-element-interactions */ // needed because <button> cannot take the place <ul> in the table structure

import React from 'react'
import classNames from 'classnames'

import ValueDenomination from 'modules/common/components/value-denomination/value-denomination'

import getValue from 'utils/get-value'

import Styles from 'modules/market/components/market-outcomes-list--outcome/market-outcomes-list--outcome.styles'

const Outcome = (p) => {
  const outcomeName = getValue(p, 'outcome.name')

  const topBidShares = getValue(p, 'outcome.topBid.shares.formatted')
  const topAskShares = getValue(p, 'outcome.topAsk.shares.formatted')

  const topBidPrice = getValue(p, 'outcome.topBid.price.formatted')
  const topAskPrice = getValue(p, 'outcome.topAsk.price.formatted')

  const lastPrice = getValue(p, 'outcome.lastPrice.formatted')
  const lastPricePercent = getValue(p, 'outcome.lastPricePercent.full')

  return (
    <ul
      className={classNames(Styles.Outcome, { [`${Styles.active}`]: p.selectedOutcome === p.outcome.id })}
      onClick={e => p.updateSelectedOutcome(p.outcome.id)}
      role="menu"
    >
      <li>{outcomeName} <span className={Styles.Outcome__percent}>{lastPricePercent}</span></li>
      <li><ValueDenomination formatted={topBidShares} /></li>
      <li><ValueDenomination formatted={topBidPrice} /></li>
      <li><ValueDenomination formatted={topAskPrice} /></li>
      <li><ValueDenomination formatted={topAskShares} /></li>
      <li><ValueDenomination formatted={lastPrice} /></li>
    </ul>
  )
}

export default Outcome
