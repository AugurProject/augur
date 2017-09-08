import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import makePath from 'modules/routes/helpers/make-path'
import makeQuery from 'modules/routes/helpers/make-query'

import { MARKET } from 'modules/routes/constants/views'
import { MARKET_ID_PARAM_NAME, MARKET_DESCRIPTION_PARAM_NAME } from 'modules/routes/constants/param-names'

const MarketLink = p => (
  <span>
    {
      (p.id && p.formattedDescription) ?
        <Link
          className={p.className}
          to={{
            pathname: makePath(MARKET),
            search: makeQuery({
              [MARKET_DESCRIPTION_PARAM_NAME]: p.formattedDescription,
              [MARKET_ID_PARAM_NAME]: p.id
            })
          }}
        >
          {p.children}
        </Link>
      :
        p.children
    }
  </span>
)

MarketLink.propTypes = {
  id: PropTypes.string.isRequired,
  formattedDescription: PropTypes.string.isRequired,
  className: PropTypes.string
}

export default MarketLink
