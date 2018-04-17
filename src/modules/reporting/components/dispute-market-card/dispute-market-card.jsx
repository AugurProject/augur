import React from 'react'
import PropTypes from 'prop-types'

import MarketLink from 'modules/market/components/market-link/market-link'
import CommonStyles from 'modules/market/components/common/market-common.styles'
import MarketProperties from 'modules/market/containers/market-properties'
import MarketReportingPayouts from 'modules/reporting/components/reporting-payouts/reporting-payouts'
import Styles from 'modules/reporting/components/dispute-market-card/dispute-market-card.style'

import { MARKETS } from 'modules/routes/constants/views'
import makePath from 'modules/routes/helpers/make-path'
import toggleTag from 'modules/routes/helpers/toggle-tag'
import noop from 'src/utils/noop'
import { compact } from 'lodash'
import { CategoryTagTrail } from 'src/modules/common/components/category-tag-trail/category-tag-trail'

const DisputeMarketCard = ({ history, location, market, ...p }) => {
  const process = (...arr) => compact(arr).map(label => ({
    label,
    onClick: noop,
  }))

  const categoriesWithClick = process(market.category)
  const tagsWithClick = compact(market.tags).map(tag => ({
    label: tag,
    onClick: toggleTag(tag, { pathname: makePath(MARKETS) }, history),
  }))

  return (
    <article className={CommonStyles.MarketCommon__container}>
      <div className={CommonStyles.MarketCommon__topcontent}>
        <div className={CommonStyles.MarketCommon__header}>
          <CategoryTagTrail categories={categoriesWithClick} tags={tagsWithClick} />
          <div className={Styles['DisputeMarket__round-number']}>
            <span className={Styles['DisptueMarket__round-label']}>Dispute Round</span>
            <span className={Styles['DisptueMarket__round-text']}>{market && market.disputeInfo &&
            market.disputeInfo.disputeRound
            }
            </span>
          </div>
        </div>

        <h1 className={CommonStyles.MarketCommon__description}>
          <MarketLink
            id={market.id}
            formattedDescription={market.formattedDescription}
          >
            {market.description}
          </MarketLink>
        </h1>
        <MarketReportingPayouts outcomes={p.outcomes[market.id] || []} />
      </div>
      <div className={CommonStyles.MarketCommon__footer}>
        <MarketProperties
          {...market}
          {...p}
        />
      </div>
    </article>
  )
}

DisputeMarketCard.propTypes = {
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  market: PropTypes.object.isRequired,
  isMobile: PropTypes.bool,
}

export default DisputeMarketCard
