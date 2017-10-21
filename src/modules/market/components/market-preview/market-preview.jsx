import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import MarketBasics from 'modules/market/components/market-basics/market-basics'
import MarketProperties from 'modules/market/components/market-properties/market-properties'

import CommonStyles from 'modules/market/components/common/market-common.styles'
import Styles from 'modules/market/components/market-preview/market-preview.styles'

const MarketPreview = p => (
  <article className={classNames(CommonStyles.MarketCommon__container, {[`${CommonStyles['single-card']}`] : p.style === 'single-card'} )}>
    <MarketBasics {...p} />
    <div className={classNames(Styles.MarketPreview__footer, {[`${Styles['single-card']}`] : p.style === 'single-card'} )}>
      <MarketProperties {...p} />
    </div>
  </article>
)

MarketPreview.propTypes = {
  isLogged: PropTypes.bool.isRequired,
  toggleFavorite: PropTypes.func,
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
  onClickToggleFavorite: PropTypes.func,
  style: PropTypes.string,
}

export default MarketPreview
