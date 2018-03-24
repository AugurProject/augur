import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import MarketLink from 'modules/market/components/market-link/market-link'
import ValueDenomination from 'modules/common/components/value-denomination/value-denomination'

import { TYPE_CLOSED } from 'modules/market/constants/link-types'
import { SCALAR } from 'modules/markets/constants/market-types'

import getValue from 'utils/get-value'
import shareDenominationLabel from 'utils/share-denomination-label'
import { dateHasPassed } from 'utils/format-date'
import Styles from 'modules/market/components/market-properties/market-properties.styles'
import ChevronFlip from 'modules/common/components/chevron-flip/chevron-flip'

const MarketProperties = (p) => {
  const shareVolumeRounded = getValue(p, 'volume.rounded')
  const shareDenomination = shareDenominationLabel(p.selectedShareDenomination, p.shareDenominations)
  const isScalar = p.marketType === SCALAR
  const consensus = getValue(p, isScalar ? 'consensus.winningOutcome' : 'consensus.outcomeName')

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
            <span>{p.endDate && dateHasPassed(p.endDate.timestamp) ? 'Expired' : 'Expires'}</span>
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
          {consensus &&
          <li>
            <span>Winning Outcome</span>
            {consensus}
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
              { p.linkType || 'view'}
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
        <button
          className={Styles[`MarketProperties__additional-details`]}
          onClick={() => p.toggleDetails()}
        >
          Additional Details
          <span className={Styles['MarketProperties__additional-details-chevron']}>
            <ChevronFlip pointDown={p.showingDetails} />
          </span>
        </button>
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
