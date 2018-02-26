import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import MarketLink from 'modules/market/components/market-link/market-link'
import ValueDenomination from 'modules/common/components/value-denomination/value-denomination'

import { TYPE_REPORT, TYPE_DISPUTE, TYPE_TRADE, TYPE_CLOSED } from 'modules/market/constants/link-types'

import getValue from 'utils/get-value'
import shareDenominationLabel from 'utils/share-denomination-label'
import { dateHasPassed } from 'utils/format-date'
import Styles from 'modules/market/components/market-properties/market-properties.styles'
import CaretDropdown from 'modules/common/components/caret-dropdown/caret-dropdown'

const MarketProperties = (p) => {
  const shareVolumeRounded = getValue(p, 'volume.rounded')
  const shareDenomination = shareDenominationLabel(p.selectedShareDenomination, p.shareDenominations)

  let buttonText

  switch (p.linkType) {
    case TYPE_REPORT:
      buttonText = 'Report'
      break
    case TYPE_DISPUTE:
      buttonText = 'Dispute'
      break
    case TYPE_TRADE:
      buttonText = 'Trade'
      break
    default:
      buttonText = 'View'
  }

  return (
    <article>
      <section className={Styles.MarketProperties}>
        <ul className={Styles.MarketProperties__meta}>
          <li>
            <span>Volume</span>
            <ValueDenomination formatted={shareVolumeRounded} denomination={shareDenomination} />
          </li>
          <li>
            <span>Fee</span>
            <ValueDenomination {...p.settlementFeePercent} />
          </li>
          <li>
            <span>{dateHasPassed(p.endDate.timestamp) ? 'Expired' : 'Expires'}</span>
            <span>{ p.isMobile ? p.endDate.formattedShort : p.endDate.formatted }</span>
          </li>
          {p.outstandingReturns &&
          <li>
            <span>Collected Returns</span>
            <ValueDenomination
              formatted={p.marketCreatorFeesCollected.rounded}
              denomination={p.marketCreatorFeesCollected.denomination}
            />
          </li>
          }
        </ul>
        <div className={Styles.MarketProperties__actions}>
          { p.isLogged && p.toggleFavorite &&
            <button
              className={classNames(Styles.MarketProperties__favorite, { [Styles.favorite]: p.isFavorite })}
              onClick={() => p.toggleFavorite(p.id)}
            >
              {p.isFavorite ?
                <i className="fa fa-star" /> :
                <i className="fa fa-star-o" />
              }
            </button>
          }
          { (p.linkType === undefined || (p.linkType && p.linkType !== TYPE_CLOSED)) &&
            <MarketLink
              className={Styles.MarketProperties__trade}
              id={p.id}
              formattedDescription={p.formattedDescription}
              linkType={p.linkType}
            >
              { p.buttonText || buttonText }
            </MarketLink>
          }
          { p.linkType && p.linkType === TYPE_CLOSED &&
            <button
              className={Styles.MarketProperties__trade}
              onClick={e => console.log('call to finalize market')}
            >
              Finalize
            </button>
          }
        </div>
      </section>
      { p.showAdditionalDetailsToggle &&
        <section>
          <div className={Styles[`MarketProperties__button-wrapper`]}>
            <div>
              additional details
              <button
                className={Styles[`MarketProperties__details-button`]}
                onClick={() => p.toggleDetails()}
              >
                <CaretDropdown flipped={p.showingDetails} />
              </button>
            </div>
          </div>
        </section>
      }
    </article>
  )
}

MarketProperties.propTypes = {
  linkType: PropTypes.string,
  buttonText: PropTypes.string,
  showAdditionalDetailsToggle: PropTypes.bool,
  showingDetails: PropTypes.bool,
  toggleDetails: PropTypes.func,
}

export default MarketProperties
