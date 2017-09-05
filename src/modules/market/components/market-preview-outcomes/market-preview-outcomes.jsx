import React from 'react'
import PropTypes from 'prop-types'

import Styles from 'modules/market/components/market-preview-outcomes/market-preview-outcomes.styles'

const MarketOutcomes = (p) => {
  const calculatePosition = () => {
    const lastPrice = p.outcomes[0] && p.outcomes[0].lastPricePercent.full

    if (p.type === 'binary') {
      return lastPrice
    }

    return `${(lastPrice / (p.max - p.min)) * 100}%`
  }

  const currentValuePosition = {
    left: calculatePosition()
  }

  const minValue = p.min && p.type !== 'binary' ? p.min : '0%'
  const maxValue = p.min && p.type !== 'binary' ? p.max : '100%'

  return (
    <div className={Styles.MarketOutcomes}>
      <div className={Styles.MarketOutcomes__range} />
      <span className={Styles.MarketOutcomes__min}>{minValue}</span>
      <span className={Styles.MarketOutcomes__max}>{maxValue}</span>
      <span className={Styles.MarketOutcomes__current} style={currentValuePosition}>
        <span className={Styles['MarketOutcomes__current-value']}>
          {p.outcomes[0] && p.outcomes[0].lastPricePercent.formatted}
        </span>
        <span className={Styles['MarketOutcomes__current-denomination']}>
          {p.outcomes[0] && p.outcomes[0].lastPricePercent.denomination}
        </span>
      </span>
    </div>
  )
}

MarketOutcomes.propTypes = {
  outcomes: PropTypes.array.isRequired,
  max: PropTypes.string,
  min: PropTypes.string,
  type: PropTypes.string
}

export default MarketOutcomes
