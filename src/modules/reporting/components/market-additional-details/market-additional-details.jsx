import React from 'react'
import PropTypes from 'prop-types'
import Styles from 'modules/reporting/components/market-additional-details/market-additional-details.style'

const MarketAdditonalDetails = (p) => {
  const { details, resolutionSource } = p.market

  return (
    <article>
      <div className={Styles[`MarketAdditionalDetails__details-wrapper`]}>
        <div className={Styles[`MarketAdditionalDetails__details-container`]}>
          { details &&
            <p>{details}</p>
          }
          <h4>Resolution Source:</h4>
          <span>{resolutionSource ? <a href={resolutionSource} target="_blank" rel="noopener noreferrer">{resolutionSource}</a> : 'Outcome will be determined by news media'}</span>
        </div>
      </div>
    </article>
  )
}

MarketAdditonalDetails.propTypes = {
  market: PropTypes.object.isRequired,
}

export default MarketAdditonalDetails
