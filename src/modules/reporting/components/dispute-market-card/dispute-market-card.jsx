import React from 'react'
import PropTypes from 'prop-types'

import MarketLink from 'modules/market/components/market-link/market-link'
import CommonStyles from 'modules/market/components/common/market-common.styles'
import BasicStyles from 'modules/market/components/market-basics/market-basics.styles'
import MarketProperties from 'modules/market/containers/market-properties'
import MarketReportingPayouts from 'modules/reporting/components/reporting-payouts/reporting-payouts'
import Styles from 'modules/reporting/components/dispute-market-card/dispute-market-card.style'

import { MARKETS } from 'modules/routes/constants/views'
import makePath from 'modules/routes/helpers/make-path'
import toggleTag from 'modules/routes/helpers/toggle-tag'

const DisputeMarketCard = p => (
  <article className={CommonStyles.MarketCommon__container}>
    <div className={CommonStyles.MarketCommon__topcontent}>
      <div className={CommonStyles.MarketCommon__header}>
        <ul className={BasicStyles.MarketBasics__tags}>
          {p.market && p.market.tags.length > 1 &&
            <li>Tags</li>
          }
          {p.market && (p.market.tags || []).map((tag, i) => i !== 0 &&
            <li key={p.market.id + tag}>
              <button onClick={() => toggleTag(tag, { pathname: makePath(MARKETS) }, p.history)}>
                {tag}
              </button>
            </li>)}
        </ul>
        <div className={Styles['DisputeMarket__round-number']}>
          <span className={Styles['DisptueMarket__round-label']}>Dispute Round</span>
          <span className={Styles['DisptueMarket__round-text']}>{p.market.disputeRound}</span>
        </div>
      </div>

      <h1 className={CommonStyles.MarketCommon__description}>
        <MarketLink
          id={p.market.id}
          formattedDescription={p.market.formattedDescription}
        >
          {p.market.description}
        </MarketLink>
      </h1>
      <MarketReportingPayouts outcomes={p.outcomes[p.market.id] || []} />
    </div>
    <div className={CommonStyles.MarketCommon__footer}>
      <MarketProperties
        {...p.market}
        {...p}
      />
    </div>
  </article>
)


DisputeMarketCard.propTypes = {
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  market: PropTypes.object.isRequired,
  disputeRound: PropTypes.number.isRequired,
  isMobile: PropTypes.bool,
}

export default DisputeMarketCard
