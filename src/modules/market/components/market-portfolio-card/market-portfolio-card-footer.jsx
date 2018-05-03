import React from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'

import { TYPE_CLAIM_PROCEEDS } from 'modules/market/constants/link-types'
import MarketLink from 'modules/market/components/market-link/market-link'
import Styles from 'modules/market/components/market-portfolio-card/market-portfolio-card.styles'

// refactor this
const MarketPortfolioCardFooter = p => (
  <div>
    {p.linkType && p.displayLink &&
    <section className={Styles['MarketCard__tablesection-mobile']}>
      <div className={Styles['MarketCard__headingcontainer-mobile']}>
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
      className={classNames(
        Styles['MarketCard__tablesection-mobile'],
        Styles['MarketCard__tablesection-mobile-light'],
      )}
    >
      <div
        className={classNames(
          Styles['MarketCard__headingcontainer-mobile'],
          Styles['MarketCard__headingcontainer-mobile-light'],
        )}
      >
        {p.linkType === TYPE_CLAIM_PROCEEDS &&
          <div>
            <span className={Styles['MarketCard__light-text']}>Outstanding Returns</span>
            <span className={Styles['MarketCard__heavy-text']}>{p.outstandingReturns}</span>
          </div>
        }
        <div className={Styles['MarketCard__action-container']}>
          {p.linkType === TYPE_CLAIM_PROCEEDS &&
            <div>
              <span className={Styles['MarketCard__proceeds-text']}>Proceeds Available</span>
              <span className={Styles['MarketCard__proceeds-text-small']}>{p.finalizationTime}</span>
            </div>
          }
          <button
            className={classNames(Styles['MarketCard__action-mobile'], Styles['MarketCard__action-mobile-light'])}
            id={p.id}
            onClick={p.buttonAction}
          >
            { p.localButtonText }
          </button>
        </div>
      </div>
    </section>
    }
  </div>
)

MarketPortfolioCardFooter.propTypes = {
  marketId: PropTypes.string.isRequired,
  linkType: PropTypes.string.isRequired,
  localButtonText: PropTypes.string.isRequired,
  displayLink: PropTypes.bool,
  buttonAction: PropTypes.func,
  formattedDescription: PropTypes.string,
  outstandingReturns: PropTypes.number,
  finalizationTime: PropTypes.number,
}

export default MarketPortfolioCardFooter
