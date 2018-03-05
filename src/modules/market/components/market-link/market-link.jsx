import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import makePath from 'modules/routes/helpers/make-path'
import makeQuery from 'modules/routes/helpers/make-query'

import { TYPE_REPORT, TYPE_DISPUTE } from 'modules/market/constants/link-types'
import { MARKET, REPORT, DISPUTE } from 'modules/routes/constants/views'
import { MARKET_ID_PARAM_NAME, MARKET_DESCRIPTION_PARAM_NAME } from 'modules/routes/constants/param-names'

const MarketLink = (p) => {
  let path

  switch (p.linkType) {
    case TYPE_REPORT:
      path = makePath(REPORT)
      break
    case TYPE_DISPUTE:
      path = makePath(DISPUTE)
      break
    default:
      path = makePath(MARKET)
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
                [MARKET_ID_PARAM_NAME]: p.id,
              }),
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
  linkType: PropTypes.string,
  className: PropTypes.string,
}

export default MarketLink
