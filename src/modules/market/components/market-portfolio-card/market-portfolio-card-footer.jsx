import React from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import makePath from 'modules/routes/helpers/make-path'
import makeQuery from 'modules/routes/helpers/make-query'

import { TYPE_REPORT, TYPE_DISPUTE, TYPE_MIGRATE_REP, TYPE_CALCULATE_PAYOUT, TYPE_CLAIM_PROCEEDS } from 'modules/market/constants/link-types'
import { MARKET, REPORT, DISPUTE, MIGRATE_REP } from 'modules/routes/constants/views'
import { MARKET_ID_PARAM_NAME, MARKET_DESCRIPTION_PARAM_NAME } from 'modules/routes/constants/param-names'
import MarketLink from 'modules/market/components/market-link/market-link'
import Styles from 'modules/market/components/market-portfolio-card/market-portfolio-card.styles'

const MarketPortfolioCardFooter = (p) => {
  return (
    <div>
      {p.linkType && p.displayLink &&
        <section className={Styles['MarketCard__tablesection-mobile']}
        >
          <div className={Styles['MarketCard__headingcontainer-mobile']}
          >
            <MarketLink
              className={Styles['MarketCard__action-mobile']}
              id={p.marketId}
              formattedDescription={p.formattedDescription}
              linkType={p.linkType}
            >
              { p.localButtonText }
            </MarketLink>
          </div>
        </section>
      }
      {p.linkType && !p.displayLink &&
        <section 
          className={classNames(Styles['MarketCard__tablesection-mobile'],
            Styles['MarketCard__tablesection-mobile-light']
          )}
        >
          <div 
            className={classNames(Styles['MarketCard__headingcontainer-mobile'],
              Styles['MarketCard__headingcontainer-mobile-light']
            )}
          >
            <button
              className={classNames(Styles['MarketCard__action-mobile'], Styles['MarketCard__action-mobile-light'])}
              id={p.id}
              onClick={p.buttonAction}
            >
              { p.localButtonText }
            </button>
          </div>
        </section>
      }
    </div>
  )
}

MarketPortfolioCardFooter.propTypes = {
  marketId: PropTypes.string.isRequired,
  linkType: PropTypes.string.isRequired,
  localButtonText: PropTypes.string.isRequired,
  displayLink: PropTypes.bool,
  buttonAction: PropTypes.func,
  formattedDescription: PropTypes.string,
}

export default MarketPortfolioCardFooter
