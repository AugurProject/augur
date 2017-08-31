import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import MarketBasics from 'modules/market/components/market-basics/market-basics'
import MarketProperties from 'modules/market/components/market-properties/market-properties'
import MarketPreviewOutcomes from 'modules/market/components/market-preview-outcomes/market-preview-outcomes'

import makePath from 'modules/app/helpers/make-path'
import makeQuery from 'modules/app/helpers/make-query'

import { MARKET } from 'modules/app/constants/views'
import { MARKET_ID_PARAM_NAME, MARKET_DESCRIPTION_PARAM_NAME } from 'modules/app/constants/param-names'

import Styles from 'modules/market/components/market-preview/market-preview.styles'

const MarketPreview = p => (
  <article className={Styles.MarketPreview}>
    {p.id && p.formattedDescription &&
      <Link
        className={Styles.MarketPreview__link}
        to={{
          pathname: makePath(MARKET),
          search: makeQuery({
            [MARKET_DESCRIPTION_PARAM_NAME]: p.formattedDescription,
            [MARKET_ID_PARAM_NAME]: p.id
          })
        }}
      />
    }
    <MarketBasics
      {...p}
      toggleFavorite={p.toggleFavorite}
    />
    <MarketPreviewOutcomes outcomes={p.outcomes} />
    <div className={Styles.MarketPreview__footer}>
      <MarketProperties {...p} />
    </div>
  </article>
)

MarketPreview.propTypes = {
  isLogged: PropTypes.bool.isRequired,
  toggleFavorite: PropTypes.func.isRequired
}

// MarketPreview.propTypes = {
//   className: PropTypes.string,
//   description: PropTypes.string,
//   outcomes: PropTypes.array,
//   isOpen: PropTypes.bool,
//   isFavorite: PropTypes.bool,
//   isPendingReport: PropTypes.bool,
//   endDate: PropTypes.object,
//   tradingFeePercent: PropTypes.object,
//   volume: PropTypes.object,
//   tags: PropTypes.array,
//   onClickToggleFavorite: PropTypes.func
// };

export default MarketPreview
