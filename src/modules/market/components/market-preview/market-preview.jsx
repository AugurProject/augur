import React from 'react'
import PropTypes from 'prop-types'

import MarketBasics from 'modules/market/components/market-basics/market-basics'
import MarketProperties from 'modules/market/components/market-properties/market-properties'

import CommonStyles from 'modules/market/components/common/market-common.styles'
import Styles from 'modules/market/components/market-preview/market-preview.styles'

const MarketPreview = p => (
  <article className={CommonStyles.MarketCommon__container}>
    <MarketBasics {...p} />
    <div className={Styles.MarketPreview__footer}>
      <MarketProperties {...p} />
    </div>
  </article>
)

MarketPreview.propTypes = {
  isLogged: PropTypes.bool.isRequired,
  toggleFavorite: PropTypes.func.isRequired
}

MarketPreview.propTypes = {
  className: PropTypes.string,
  description: PropTypes.string,
  outcomes: PropTypes.array,
  isOpen: PropTypes.bool,
  isFavorite: PropTypes.bool,
  isPendingReport: PropTypes.bool,
  endDate: PropTypes.object,
  tradingFeePercent: PropTypes.object,
  volume: PropTypes.object,
  tags: PropTypes.array,
  onClickToggleFavorite: PropTypes.func
}

export default MarketPreview
