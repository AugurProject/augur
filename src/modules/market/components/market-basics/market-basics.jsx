/* eslint react/no-array-index-key: 0 */  // It's OK in this specific instance as order remains the same

import React from 'react'
import PropTypes from 'prop-types'

import MarketOutcomesBinaryScalar from 'modules/market/components/market-outcomes-binary-scalar/market-outcomes-binary-scalar'
import MarketOutcomesCategorical from 'modules/market/components/market-outcomes-categorical/market-outcomes-categorical'
import MarketLink from 'modules/market/components/market-link/market-link'
import { MarketStatusOpen, MarketStatusReported, MarketStatusClosed } from 'modules/common/components/icons/icons'

import toggleTag from 'utils/toggle-tag'

import { BINARY, SCALAR } from 'modules/markets/constants/market-types'

import Styles from 'modules/market/components/market-basics/market-basics.styles'

const MarketBasics = (p) => {

  let marketStatusIcon

  switch (true) {
    case p.isOpen && p.isReported:
      marketStatusIcon = MarketStatusReported
      break
    case p.isOpen:
      marketStatusIcon = MarketStatusOpen
      break
    default:
      marketStatusIcon = MarketStatusClosed
  }

  return (
    <article className={Styles.MarketBasics}>
      <div className={Styles.MarketBasics__content}>
        <div className={Styles.MarketBasics__header}>
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

          <span className={Styles.MarketBasics__status}>
            {marketStatusIcon}
          </span>
        </div>

        <h1 className={Styles.MarketBasics__description}>
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
}

MarketBasics.propTypes = {
  history: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  isLogged: PropTypes.bool.isRequired,
  toggleFavorite: PropTypes.func
}

export default MarketBasics
