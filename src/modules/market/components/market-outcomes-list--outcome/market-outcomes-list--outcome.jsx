/* eslint-disable jsx-a11y/no-static-element-interactions */ // needed because <button> cannot take the place <ul> in the table structure

import React from 'react'
import classNames from 'classnames'

import ValueDenomination from 'modules/common/components/value-denomination/value-denomination'

import getValue from 'utils/get-value'
import setShareDenomination from 'utils/set-share-denomination'

import Styles from 'modules/market/components/market-outcomes-list--outcome/market-outcomes-list--outcome.styles'

const Outcome = (p) => {
  const outcomeName = getValue(p, 'outcome.name')

  const selectedShareDenomination = getValue(p, `scalarShareDenomination.markets.${p.marketID}`)

  const topBidShares = setShareDenomination(getValue(p, 'outcome.topBid.shares.formatted'), selectedShareDenomination)
  const topAskShares = setShareDenomination(getValue(p, 'outcome.topAsk.shares.formatted'), selectedShareDenomination)

  const topBidPrice = getValue(p, 'outcome.topBid.price.formatted')
  const topAskPrice = getValue(p, 'outcome.topAsk.price.formatted')

  const lastPrice = getValue(p, 'outcome.lastPrice.formatted')
  const lastPricePercent = getValue(p, 'outcome.lastPricePercent.full')

  return (
    <button
      onClick={e => p.updateSelectedOutcomes(p.outcome.id)}
    >
      <ul className={classNames(Styles.Outcome, { [`${Styles.active}`]: p.selectedOutcomes.indexOf(p.outcome.id) > -1 })}>
        <li>{outcomeName} <span className={Styles.Outcome__percent}>{lastPricePercent}</span></li>
        <li><ValueDenomination formatted={topBidShares} /></li>
        <li><ValueDenomination formatted={topBidPrice} /></li>
        <li><ValueDenomination formatted={topAskPrice} /></li>
        <li><ValueDenomination formatted={topAskShares} /></li>
        <li><ValueDenomination formatted={lastPrice} /></li>
      </ul>
    </button>
  )
}

export default Outcome
