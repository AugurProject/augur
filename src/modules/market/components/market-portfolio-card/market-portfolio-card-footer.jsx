import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import makePath from 'modules/routes/helpers/make-path'
import makeQuery from 'modules/routes/helpers/make-query'

import { TYPE_REPORT, TYPE_DISPUTE, TYPE_MIGRATE_REP, TYPE_CALCULATE_PAYOUT } from 'modules/market/constants/link-types'
import { MARKET, REPORT, DISPUTE, MIGRATE_REP } from 'modules/routes/constants/views'
import { MARKET_ID_PARAM_NAME, MARKET_DESCRIPTION_PARAM_NAME } from 'modules/routes/constants/param-names'
import MarketLink from 'modules/market/components/market-link/market-link'

const MarketPortfolioCardFooter = (p) => {
  // let path

  // switch (p.linkType) {
  //   case TYPE_REPORT:
  //     path = makePath(REPORT)
  //     break
  //   case TYPE_DISPUTE:
  //     path = makePath(DISPUTE)
  //     break
  //   case TYPE_MIGRATE_REP:
  //     path = makePath(MIGRATE_REP)
  //     break
  //   default:
  //     path = makePath(MARKET)
  // }

  let localButtonText
  switch (p.linkType) {
    case TYPE_REPORT:
      localButtonText = 'Report'
      break
    case TYPE_DISPUTE:
      localButtonText = 'Dispute'
      break
    case TYPE_CLAIM_PROCEEDS:
      localButtonText = 'Claim'
      break
    case TYPE_MIGRATE_REP:
      localButtonText = 'Migrate REP'
      break
    case TYPE_CALCULATE_PAYOUT: 
      localButtonText = 'Calculate Payout'
      break
    default:
      localButtonText = 'View'
  }

  return (
    <div>
      {p.linkType && p.linkType !== TYPE_CALCULATE_PAYOUT &&
        <section className={Styles['MarketCard__tablesection-mobile']}
        >
          <div className={Styles['MarketCard__headingcontainer-mobile']}
          >
            <MarketLink
              className={Styles['MarketCard__action-mobile']}
              id={p.marketId}
              formattedDescription={p.formattedDescription}
              linkType={linkType}
            >
              { buttonText || localButtonText }
            </MarketLink>
          </div>
        </section>
      }
      {linkType && linkType === TYPE_CALCULATE_PAYOUT &&
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
              { buttonText || localButtonText }
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
  buttonAction: PropTypes.function,
  formattedDescription: PropTypes.string,
}

export default MarketPortfolioCardFooter
