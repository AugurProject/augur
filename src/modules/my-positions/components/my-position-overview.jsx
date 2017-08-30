import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import makePath from 'modules/app/helpers/make-path'
import makeQuery from 'modules/app/helpers/make-query'

import { MARKET } from 'modules/app/constants/views'
import { MARKET_DESCRIPTION_PARAM_NAME, MARKET_ID_PARAM_NAME } from 'modules/app/constants/param-names'

const PositionsMarketOverview = p => (
  <article className="my-positions-overview portfolio-market-overview">
    <Link
      to={{
        pathname: makePath(MARKET),
        search: makeQuery({
          [MARKET_DESCRIPTION_PARAM_NAME]: p.formattedDescription,
          [MARKET_ID_PARAM_NAME]: p.id
        })
      }}
    >
      <span className="my-positions-market-description">{p.description}</span>
    </Link>
  </article>
)

PositionsMarketOverview.propTypes = {
  description: PropTypes.string.isRequired
}

export default PositionsMarketOverview
