import React from 'react'
import PropTypes from 'prop-types'

import MarketPortfolioCard from 'modules/market/components/market-portfolio-card/market-portfolio-card'

const Positions = p => (
  <article className="my-positions">
    {p.markets.map(market => (
      <MarketPortfolioCard
        key={market.id}
        market={market}
        closePositionStatus={p.closePositionStatus}
        isTradeCommitLocked={p.isTradeCommitLocked}
        scalarShareDenomination={p.scalarShareDenomination}
        orderCancellation={p.orderCancellation}
        location={p.location}
        history={p.history}
      />
    ))}
  </article>
)

Positions.propTypes = {
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  markets: PropTypes.array.isRequired,
  isTradeCommitLocked: PropTypes.bool,
  closePositionStatus: PropTypes.object.isRequired,
  scalarShareDenomination: PropTypes.object.isRequired,
  orderCancellation: PropTypes.object.isRequired,
  registerBlockNumber: PropTypes.number
}

export default Positions
