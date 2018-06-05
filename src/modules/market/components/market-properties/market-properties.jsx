import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import MarketLink from 'modules/market/components/market-link/market-link'
import ValueDenomination from 'modules/common/components/value-denomination/value-denomination'

import { TYPE_CLOSED, TYPE_DISPUTE, TYPE_VIEW, TYPE_CLAIM_PROCEEDS } from 'modules/market/constants/link-types'
import { SCALAR } from 'modules/markets/constants/market-types'

import getValue from 'utils/get-value'
import shareDenominationLabel from 'utils/share-denomination-label'
import { dateHasPassed } from 'utils/format-date'
import Styles from 'modules/market/components/market-properties/market-properties.styles'
import ChevronFlip from 'modules/common/components/chevron-flip/chevron-flip'
import { MODAL_MIGRATE_MARKET } from 'modules/modal/constants/modal-types'

const MarketProperties = (p) => {
  const shareVolumeFormatted = getValue(p, 'volume.formatted')
  const shareDenomination = shareDenominationLabel(p.selectedShareDenomination, p.shareDenominations)
  const isScalar = p.marketType === SCALAR
  let consensus = getValue(p, isScalar ? 'consensus.winningOutcome' : 'consensus.outcomeName')
  const linkType = (p.isForking && p.linkType === TYPE_DISPUTE) ? TYPE_VIEW : p.linkType
  const disableDispute = p.loginAccount.rep === '0' && p.linkType === TYPE_DISPUTE
  if (getValue(p, 'consensus.isInvalid')) {
    consensus = 'Invalid'
  }
  return (
    <article>
      <section className={Styles.MarketProperties}>
        <ul className={Styles.MarketProperties__meta}>
          <li>
            <span>Volume</span>
            <ValueDenomination formatted={shareVolumeFormatted} denomination={shareDenomination} />
          </li>
          <li>
            <span>Fee</span>
            <ValueDenomination {...p.settlementFeePercent} />
          </li>
          <li>
            <span>{p.endTime && dateHasPassed(p.currentTimestamp, p.endTime.timestamp) ? 'Expired' : 'Expires'}</span>
            <span>{ p.isMobile ? p.endTime.formattedLocalShort : p.endTime.formattedLocalShortTime }</span>
          </li>
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
          { (linkType === undefined || (linkType && linkType !== TYPE_CLOSED && linkType !== TYPE_CLAIM_PROCEEDS)) &&
            <MarketLink
              className={classNames(Styles.MarketProperties__trade, { [Styles.disabled]: disableDispute })}
              id={p.id}
              formattedDescription={p.formattedDescription}
              linkType={linkType}
            >
              { linkType || 'view'}
            </MarketLink>
          }
          { linkType && linkType === TYPE_CLOSED &&
            <button
              className={Styles.MarketProperties__trade}
              onClick={e => console.log('call to finalize market')}
            >
              Finalize
            </button>
          }
          { p.isForking && p.isForkingMarketFinalized && p.forkingMarket !== p.id && !p.finalizationTime &&
            <button
              className={Styles.MarketProperties__migrate}
              onClick={() => p.updateModal({
                type: MODAL_MIGRATE_MARKET,
                marketId: p.id,
                marketDescription: p.description,
                canClose: true,
              })}
            >
              Migrate
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
  currentTimestamp: PropTypes.number.isRequired,
  updateModal: PropTypes.func.isRequired,
  linkType: PropTypes.string,
  finalizationTime: PropTypes.number,
  buttonText: PropTypes.string,
  showAdditionalDetailsToggle: PropTypes.bool,
  showingDetails: PropTypes.bool,
  toggleDetails: PropTypes.func,
  isForking: PropTypes.bool,
  isForkingMarketFinalized: PropTypes.bool,
  forkingMarket: PropTypes.string,
}

export default MarketProperties
