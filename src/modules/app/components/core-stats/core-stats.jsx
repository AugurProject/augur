/* eslint react/no-array-index-key: 0 */  // It's OK in this specific instance since the order NEVER changes

import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import PortfolioNav from 'modules/portfolio/containers/portfolio-nav'
import ValueDenomination from 'modules/common/components/value-denomination/value-denomination'

import makePath from 'modules/routes/helpers/make-path'

import { MY_POSITIONS, MY_MARKETS, MY_REPORTS } from 'modules/routes/constants/views'

const CoreStats = p => (
  <article className="core-stats" >
    {p.coreStats && p.coreStats.map((statGroup, i) => (
      <div
        key={i}
        className="core-stats-group"
      >
        {Object.keys(p.coreStats[i]).map(stat => (
          <div
            key={stat}
            className="core-stat"
          >
            <span
              className="core-stat-label"
              data-tip={p.coreStats[i][stat].title}
            >
              {p.coreStats[i][stat].label}:
            </span>
            {p.coreStats[i][stat].value && p.coreStats[i][stat].value.value ?
              <ValueDenomination
                className={`${p.coreStats[i][stat].colorize ? 'colorize' : ''}`}
                {...p.coreStats[i][stat].value}
              /> :
              <span className="core-stat-value">—</span>
            }
          </div>
        ))}
      </div>
    ))}
    <PortfolioNav
      className={classNames('additional-stats', {
        'display-additional-stats': p.location.pathname === makePath(MY_POSITIONS) ||
          p.location.pathname === makePath(MY_MARKETS) ||
          p.location.pathname === makePath(MY_REPORTS)
      })}
    />
  </article>
)

CoreStats.propTypes = {
  location: PropTypes.object.isRequired,
  coreStats: PropTypes.array
}

export default CoreStats
