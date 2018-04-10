import React from 'react'
import PropTypes from 'prop-types'

import { BINARY } from 'modules/markets/constants/market-types'

import getValue from 'utils/get-value'
import CustomPropTypes from 'utils/custom-prop-types'
import { createBigNumber } from 'utils/create-big-number'

import Styles from 'modules/market/components/market-outcomes-binary-scalar/market-outcomes-binary-scalar.styles'

const MarketOutcomes = (p) => {
  const scalarDenomination = !p.scalarDenomination ? '' : p.scalarDenomination
  const calculatePosition = () => {
    const lastPrice = getValue(p.outcomes[0], 'lastPricePercent.fullPrecision') || 0

    if (p.type === BINARY) {
      return lastPrice
    }
    return `${(createBigNumber(lastPrice).dividedBy(p.max.minus(p.min))).times(createBigNumber(100))}`
  }

  const currentValuePosition = {
    left: calculatePosition(),
  }

  const minValue = !isNaN(p.min) && p.type !== BINARY ? `${p.min} ${scalarDenomination}` : '0 %'
  const maxValue = !isNaN(p.max) && p.type !== BINARY ? `${p.max} ${scalarDenomination}` : '100 %'

  const lastPriceDenomination = p.type !== BINARY ? '' : getValue(p.outcomes[0], 'lastPricePercent.denomination')

  return (
    <div className={Styles.MarketOutcomes}>
      <div className={Styles.MarketOutcomes__range} />
      <span className={Styles.MarketOutcomes__min}>
        {minValue}
      </span>
      <span className={Styles.MarketOutcomes__max}>
        {maxValue}
      </span>
      <span
        className={Styles.MarketOutcomes__current}
        style={currentValuePosition}
      >
        <span className={Styles['MarketOutcomes__current-value']}>
          {getValue(p.outcomes[0], 'lastPricePercent.formatted')}
        </span>
        <span className={Styles['MarketOutcomes__current-denomination']}>
          {lastPriceDenomination}
        </span>
      </span>
    </div>
  )
}

MarketOutcomes.propTypes = {
  outcomes: PropTypes.array.isRequired,
  max: CustomPropTypes.bigNumber,
  min: CustomPropTypes.bigNumber,
  type: PropTypes.string,
  scalarDenomination: PropTypes.string,
}

export default MarketOutcomes
