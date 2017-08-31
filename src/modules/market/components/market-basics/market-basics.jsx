/* eslint react/no-array-index-key: 0 */  // It's OK in this specific instance as order remains the same

import React from 'react'
import PropTypes from 'prop-types'

import SVG from 'modules/common/components/svg/svg'

import toggleTag from 'modules/app/helpers/toggle-tag'

import Styles from 'modules/market/components/market-basics/market-basics.styles'

const MarketBasics = (p) => {

  // set market status
  let marketStatus = p.isOpen ? 'open' : 'closed'
  if (marketStatus === 'open' && p.isResported) {
    marketStatus = 'reported'
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
            <SVG id={`market-status--${marketStatus}`} />
          </span>
        </div>

        <h1>{ p.description }</h1>
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
