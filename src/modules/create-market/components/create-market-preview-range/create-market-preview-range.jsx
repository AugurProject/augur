import React from 'react'
import PropTypes from 'prop-types'
import { BigNumber } from 'utils/create-big-number'

import { SCALAR } from 'modules/markets/constants/market-types'

import Styles from 'modules/create-market/components/create-market-preview-range/create-market-preview-range.styles'

const MarketPreviewRange = (p) => {
  let minValue = '0%'
  let maxValue = '100%'

  const {
    scalarSmallNum,
    scalarBigNum,
  } = p.newMarket

  if (p.newMarket.type === SCALAR) {
    minValue = scalarSmallNum && !(BigNumber.isBigNumber(scalarSmallNum)) ? scalarSmallNum : 'min'
    maxValue = scalarBigNum && !(BigNumber.isBigNumber(scalarSmallNum)) ? scalarBigNum : 'max'

    if (BigNumber.isBigNumber(scalarSmallNum)) {
      minValue = scalarSmallNum.toNumber()
    }

    if (BigNumber.isBigNumber(scalarBigNum)) {
      maxValue = scalarBigNum.toNumber()
    }
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
