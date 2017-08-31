import React from 'react'
import PropTypes from 'prop-types'
import ValueDenomination from 'modules/common/components/value-denomination/value-denomination'
import ValueDate from 'modules/common/components/value-date'

const Market = p => (
  <article
    className="my-market portfolio-detail"
  >
    <div
      className="portfolio-group portfolio-main-group"
    >
      <span
        className="main-group-title"
      >
        <span>ends: </span>
        <ValueDate {...p.endDate} />
      </span>
    </div>
    <div className="portfolio-group">
      <div className="portfolio-pair total-value">
        <span className="title">fees collected</span>
        <ValueDenomination
          className="colorize"
          {...p.fees}
        />
      </div>
      <div className="portfolio-pair">
        <span className="title">open volume</span>
        <ValueDenomination {...p.openVolume} />
      </div>
      <div className="portfolio-pair">
        <span className="title">volume</span>
        <ValueDenomination {...p.volume} />
      </div>
      <div className="portfolio-pair total-cost">
        <span className="title"># of trades</span>
        <ValueDenomination {...p.numberOfTrades} />
      </div>
      <div className="portfolio-pair total-value">
        <span className="title">avg trade size</span>
        <ValueDenomination {...p.averageTradeSize} />
      </div>
    </div>
  </article>
)

Market.propTypes = {
  endDate: PropTypes.object.isRequired,
  fees: PropTypes.object.isRequired,
  openVolume: PropTypes.object.isRequired,
  volume: PropTypes.object.isRequired,
  numberOfTrades: PropTypes.object.isRequired,
  averageTradeSize: PropTypes.object.isRequired
}

export default Market
