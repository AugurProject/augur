import React from 'react'
import PropTypes from 'prop-types'
import Styles from 'modules/reporting/components/market-additional-details/market-additional-details.style'
import { SCALAR } from 'modules/markets/constants/market-types'

const MarketAdditonalDetails = (p) => {
  const { details, resolutionSource, marketType, minPrice, maxPrice, scalarDenomination } = p.market
  const denomination = scalarDenomination ? ' ' + scalarDenomination : ''
  if (this.additionalDetails && this.additionalDetails.scrollHeight) {
    this.additionalDetails.style.height = `${this.additionalDetails.scrollHeight}px`
  }
  return (
    <article>
      <div className={Styles[`MarketAdditionalDetails__details-wrapper`]}>
        <div className={Styles[`MarketAdditionalDetails__details-container`]}>
          <h4>Resolution Source:</h4>
          <span>{resolutionSource ? <span>{resolutionSource}</span> : 'General knowledge'}</span>
          { details &&
            <textarea
              ref={(additionalDetails) => { this.additionalDetails = additionalDetails }}
              className={Styles[`MarketAdditionalDetails__details-details-text`]}
              disabled
              readOnly
              value={details}
            />
          }
          { marketType === SCALAR &&
            <p className={Styles[`MarketAdditionalDetails__details-helper-text`]}>
              If the real-world outcome for this market is above this market&#39;s maximum value, the maximum value ({maxPrice.toNumber()}{denomination}) should be reported. If the real-world outcome for this market is below this market&#39;s minimum value, the minimum value ({minPrice.toNumber()}{denomination}) should be reported.
            </p>
          }
        </div>
      </div>
    </article>
  )
}

MarketAdditonalDetails.propTypes = {
  market: PropTypes.object.isRequired,
}

export default MarketAdditonalDetails
