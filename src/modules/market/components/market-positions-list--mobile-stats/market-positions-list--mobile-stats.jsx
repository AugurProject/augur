/* eslint-disable react/no-array-index-key */

import React from 'react'

import ValueDenomination from 'modules/common/components/value-denomination/value-denomination'
import getValue from 'utils/get-value'

import Styles from 'modules/market/components/market-positions-list--mobile-stats/market-positions-list--mobile-stats.styles'
import CommonStyles from 'modules/market/components/market-positions-list--mobile/market-positions-list--mobile.styles'

const MobileStats = (p) => {
  const topBidShares = getValue(p, 'outcome.topBid.shares.formatted')
  const topAskShares = getValue(p, 'outcome.topAsk.shares.formatted')

  const topBidPrice = getValue(p, 'outcome.topBid.price.formatted')
  const topAskPrice = getValue(p, 'outcome.topAsk.price.formatted')

  return (
    <div className={CommonStyles.MarketPositionsListMobile__wrapper}>
      <h2 className={CommonStyles.MarketPositionsListMobile__heading}>Stats</h2>
      <ul className={Styles.MobileStats}>
        <li><span>Best Bid</span> <ValueDenomination formatted={topBidPrice} /></li>
        <li><span>Bid QTY</span> <ValueDenomination formatted={topBidShares} /></li>
        <li><span>Best Ask</span> <ValueDenomination formatted={topAskPrice} /></li>
        <li><span>Ask QTY</span> <ValueDenomination formatted={topAskShares} /></li>
      </ul>
    </div>
  )
}

export default MobileStats
