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
          {p.market.tags.length > 1 &&
            <li>Tags</li>
          }
          {(p.market.tags || []).map((tag, i) => i !== 0 &&
            <li key={p.market.id + tag}>
              <button onClick={() => toggleTag(tag, { pathname: makePath(MARKETS) }, p.history)}>
                {tag}
              </button>
            </li>)}
        </ul>
        <div className={Styles['DisputeMarket__round-number']}>
          <span className={Styles['DisptueMarket__round-label']}>Dispute Round</span>
          <span className={Styles['DisptueMarket__round-text']}>{p.disputeRound}</span>
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

      {/*
      Binary: Tenative, others (Yes, No, Invalid)
      Categorical: Tentative, others (others + Invalid)
      Scalar: Tentative -> outcomes I currently have stake in -> outcomes that have current stake -> outcomes that have stake + ( Invalid promissed last spot)
      */}
      <MarketReportingPayouts outcomes={[
        {id: 1, name: "Outcome 1", totalRep: 500, userRep: 250, goal: 1000},
        {id: 2, name: "Outcome 2", totalRep: 450, userRep: 250, goal: 1000},
        {id: 3, name: "Outcome 3", totalRep: 300, userRep: 0, goal: 1000},
        {id: 4, name: "Outcome 4", totalRep: 400, userRep: 0, goal: 1000},
        {id: 5, name: "Outcome 5", totalRep: 100, userRep: 0, goal: 1000},
        {id: 6, name: "Outcome 6", totalRep: 300, userRep: 0, goal: 1000},
        {id: 7, name: "Outcome 7", totalRep: 400, userRep: 0, goal: 1000},
        {id: 8, name: "Outcome 8", totalRep: 300, userRep: 0, goal: 1000},
        {id: 9, name: "Outcome 9", totalRep: 400, userRep: 0, goal: 1000},
      ]} />

    </div>
    <div className={CommonStyles.MarketCommon__footer}>
      <MarketProperties {...p.market} />
    </div>
  </article>
)


DisputeMarketCard.propTypes = {
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  market: PropTypes.object.isRequired,
  isMobile: PropTypes.bool,
  disputeRound: PropTypes.number.isRequired,
}

export default DisputeMarketCard
