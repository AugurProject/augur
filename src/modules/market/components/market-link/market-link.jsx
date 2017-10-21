import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import makePath from 'modules/routes/helpers/make-path'
import makeQuery from 'modules/routes/helpers/make-query'

import { MARKET, REPORTING_REPORT } from 'modules/routes/constants/views'
import { MARKET_ID_PARAM_NAME, MARKET_DESCRIPTION_PARAM_NAME } from 'modules/routes/constants/param-names'

const MarketLink = p => {

  // TODO: This code currently only provides for links/buttons to the Market page and the Reporting form page.
  // When the button code is refactored to account for all possible market states, this will need to be
  // refactored as well.
  let path = makePath(MARKET)

  if (p.linkType && p.linkType === 'Report') {
    path = makePath(REPORTING_REPORT)
  }

  return (
    <span>
      {
        (p.id && p.formattedDescription) ?
          <Link
            className={p.className}
            to={{
              pathname: path,
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
}

MarketLink.propTypes = {
  id: PropTypes.string.isRequired,
  formattedDescription: PropTypes.string.isRequired,
  className: PropTypes.string,
  linkType: PropTypes.string,
}

export default MarketLink
