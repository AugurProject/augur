import React, { Component } from 'react'
import PropTypes from 'prop-types'

import MarketLink from 'modules/market/components/market-link/market-link'
import CommonStyles from 'modules/market/components/common/market-common.styles'
import BasicStyles from 'modules/market/components/market-basics/market-basics.styles'
import MarketProperties from 'modules/market/components/market-properties/market-properties'

import { TYPE_DISPUTE } from 'modules/market/constants/link-types'
import { MARKETS } from 'modules/routes/constants/views'
import makePath from 'modules/routes/helpers/make-path'
import toggleTag from 'modules/routes/helpers/toggle-tag'

export default class DisputeMarketCard extends Component {
  static propTypes = {
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    market: PropTypes.object.isRequired,
    isMobile: PropTypes.bool,
  }

  constructor(props) {
    super(props)
    this.state = {
      linkType: TYPE_DISPUTE
    }
  }

  render() {
    const p = this.props
    const s = this.state

    return (
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
          </div>

          <h1 className={CommonStyles.MarketCommon__description}>
            <MarketLink
              id={p.market.id}
              formattedDescription={p.market.formattedDescription}
            >
              {p.market.description}
            </MarketLink>
          </h1>
        </div>
        <div className={CommonStyles.MarketCommon__footer}>
          <MarketProperties
            {...p.market}
            linkType={s.linkType}
          />
        </div>
      </article>
    )
  }
}
