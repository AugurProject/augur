import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import MarketPortfolioCard from 'modules/market/containers/market-portfolio-card'
import NullStateMessage from 'modules/common/components/null-state-message/null-state-message'

import Styles from 'modules/portfolio/components/positions-markets-list/positions-markets-list.styles'

const PositionsMarketsList = p => (
  <div className={classNames(Styles.PositionsMarketsList, { [`${Styles.PositionMarketsListNullState}`]: p.markets.length === 0 })}>
    <div className={Styles.PositionsMarketsList__SortBar}>
      <div className={Styles['PositionsMarketsList__SortBar-title']}>
        {p.title}
      </div>
    </div>
    {p.markets.length ?
      p.markets.map(market =>
        (<MarketPortfolioCard
          key={market.id}
          market={market}
          location={p.location}
          history={p.history}
          linkType={p.linkType}
          positionsDefault={p.positionsDefault}
          claimTradingProceeds={p.claimTradingProceeds}
          isMobile={p.isMobile}
          currentTimestamp={p.currentTimestamp}
        />)):
      <NullStateMessage message="No Markets Available" />}
  </div>
)

PositionsMarketsList.propTypes = {
  title: PropTypes.string.isRequired,
  markets: PropTypes.array.isRequired,
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  linkType: PropTypes.string,
  positionsDefault: PropTypes.bool,
  claimTradingProceeds: PropTypes.func,
  isMobile: PropTypes.bool,
  currentTimestamp: PropTypes.number.isRequired,
}


export default PositionsMarketsList
