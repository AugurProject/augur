import React from 'react'
import PropTypes from 'prop-types'

import { SCALAR } from 'modules/markets/constants/market-types'

import Styles from 'modules/create-market/components/create-market-preview-range/create-market-preview-range.styles'

const MarketPreviewRange = (p) => {
  let minValue = '0%';
  let maxValue = '100%';

  if (p.newMarket.type === SCALAR) {
    minValue = p.newMarket.scalarSmallNum ? p.newMarket.scalarSmallNum : 'min';
    maxValue = p.newMarket.scalarBigNum ? p.newMarket.scalarBigNum : 'max';
  }

  return (
    <div className={Styles.MarketPreviewRange}>
      <div className={Styles.MarketPreviewRange__range} />
      <span className={Styles.MarketPreviewRange__min}>
        {minValue}
      </span>
      <span className={Styles.MarketPreviewRange__max}>
        {maxValue}
      </span>
    </div>
  )
}

MarketPreviewRange.propTypes = {
  newMarket: PropTypes.object.isRequired,
}

export default MarketPreviewRange
