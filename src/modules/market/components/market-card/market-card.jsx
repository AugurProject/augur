import React from 'react'
import classNames from 'classnames'

import MarketStatusIcon from 'modules/market/components/common/market-status-icon/market-status-icon'

import CommonStyles from 'modules/market/components/common/market-common.styles'
import Styles from 'modules/market/components/market-card/market-card.styles'

const MarketCard = p => (
  <article className={CommonStyles.MarketCommon__container}>
    <div
      className={classNames(
        CommonStyles.MarketCommon__topcontent,
        Styles.MarketCard__topcontent
      )}
    >
      <div className={CommonStyles.MarketCommon__header}>
        <h1 className={CommonStyles.MarketCommon__description}>
          Market Title
        </h1>
        <MarketStatusIcon isOpen isReported />
      </div>
      <div className={Styles.MarketCard__topstats}>
        <span className={Styles.MarketCard__statlabel}>
          Realized P/L
        </span>
        <span className={Styles.MarketCard__stat}>
          <span className={Styles.MarketCard__statvalue}>
            0
          </span>
          ETH
        </span>
        <span className={Styles.MarketCard__statlabel}>
          Unrealized P/L
        </span>
        <span className={Styles.MarketCard__stat}>
          <span className={Styles.MarketCard__statvalue}>
            0
          </span>
          ETH
        </span>
        <span className={Styles.MarketCard__statlabel}>
          Total P/L
        </span>
        <span className={Styles.MarketCard__stat}>
          <span className={Styles.MarketCard__statvalue}>
            0
          </span>
          ETH
        </span>
      </div>
    </div>
  </article>
)

export default MarketCard
