/* eslint react/no-array-index-key: 0 */  // It's OK in this specific instance as order remains the same

import React from 'react'
import PropTypes from 'prop-types'

import MarketOutcomesBinaryScalar from 'modules/market/components/market-outcomes-binary-scalar/market-outcomes-binary-scalar'
import MarketOutcomesCategorical from 'modules/market/components/market-outcomes-categorical/market-outcomes-categorical'
import MarketLink from 'modules/market/components/market-link/market-link'
import MarketStatusIcon from 'modules/market/components/common/market-status-icon/market-status-icon'

import toggleTag from 'utils/toggle-tag'

import { BINARY, SCALAR } from 'modules/markets/constants/market-types'

import CommonStyles from 'modules/market/components/common/market-common.styles'
import Styles from 'modules/market/components/market-basics/market-basics.styles'

const MarketBasics = p => (
  <article>
    <div className={CommonStyles.MarketCommon__topcontent}>
      <div className={CommonStyles.MarketCommon__header}>
        <ul className={Styles.MarketBasics__tags}>
          <li>Tags</li>
          {(p.tags || []).map((tag, i) => (
            <li key={i}>
              <button onClick={() => toggleTag(tag, p.location, p.history)}>
                {tag}
              </button>
            </li>
          ))}
        </ul>
        <MarketStatusIcon isOpen={p.isOpen} isReported={p.isReported} />
      </div>

      <h1 className={CommonStyles.MarketCommon__description}>
        <MarketLink
          id={p.id}
          formattedDescription={p.formattedDescription}
        >
          {p.description}
        </MarketLink>
      </h1>

      {(p.type === BINARY || p.type === SCALAR) &&
        <MarketOutcomesBinaryScalar outcomes={p.outcomes} min={p.minValue} max={p.maxValue} type={p.type} />
      }

      {p.type === 'categorical' &&
        <MarketOutcomesCategorical outcomes={p.outcomes} />
      }
    </div>
  </article>
)

MarketBasics.propTypes = {
  history: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  isLogged: PropTypes.bool.isRequired,
  toggleFavorite: PropTypes.func
}

export default MarketBasics
