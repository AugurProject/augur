import React from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'

import { convertUnixToFormattedDate } from 'utils/format-date'

import { TYPE_CLAIM_PROCEEDS } from 'modules/market/constants/link-types'
import Styles from 'modules/market/components/market-portfolio-card/market-portfolio-card.styles'

const MarketPortfolioCardFooter = p => (
  <div>
    <section
      className={classNames(
        Styles['MarketCard__tablesection-footer'],
        Styles['MarketCard__tablesection-footer-light'],
      )}
    >
      <div
        className={classNames(
          Styles['MarketCard__headingcontainer-footer'],
          Styles['MarketCard__headingcontainer-footer-light'],
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
              <span className={Styles['MarketCard__proceeds-text-small']}>{convertUnixToFormattedDate(p.finalizationTime).formattedLocal}</span>
            </div>
          }
          <button
            className={classNames(Styles['MarketCard__action-footer'], Styles['MarketCard__action-footer-light'])}
            id={p.id}
            onClick={p.buttonAction}
          >
            { p.localButtonText }
          </button>
        </div>
      </div>
    </section>
  </div>
)

MarketPortfolioCardFooter.propTypes = {
  marketId: PropTypes.string.isRequired,
  linkType: PropTypes.string.isRequired,
  localButtonText: PropTypes.string.isRequired,
  buttonAction: PropTypes.func,
  outstandingReturns: PropTypes.number,
  finalizationTime: PropTypes.number,
}

export default MarketPortfolioCardFooter
