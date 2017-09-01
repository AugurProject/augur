import React from 'react'
import PropTypes from 'prop-types'

import MarketBasics from 'modules/market/components/market-basics/market-basics'
import MarketProperties from 'modules/market/components/market-properties/market-properties'
import MarketPreviewOutcomes from 'modules/market/components/market-preview-outcomes/market-preview-outcomes'

import Styles from 'modules/market/components/market-preview/market-preview.styles'

const MarketPreview = p => (
  <article className={Styles.MarketPreview}>
    <MarketBasics {...p} />
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
};

export default MarketPreview
