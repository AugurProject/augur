import React from 'react'
import classNames from 'classnames'

import MarketLink from 'modules/market/components/market-link/market-link'
import ValueDenomination from 'modules/common/components/value-denomination/value-denomination'

import getValue from 'utils/get-value'
import setShareDenomination from 'utils/set-share-denomination'
import shareDenominationLabel from 'utils/share-denomination-label'

import Styles from 'modules/market/components/market-properties/market-properties.styles'

const MarketProperties = (p) => {
  const shareVolumeRounded = setShareDenomination(getValue(p, 'volume.rounded'), p.selectedShareDenomination)
  const shareDenomination = shareDenominationLabel(p.selectedShareDenomination, p.shareDenominations)

  let buttonText

  switch (true) {
    case p.isReported:
      buttonText = 'Reported'
      break
    case p.isMissedReport:
      buttonText = 'Missed Report'
      break
    case p.isPendingReport:
      buttonText = 'Report'
      break
    case !p.isOpen:
      buttonText = 'View'
      break
    default:
      buttonText = 'Trade'
  }

  return (
    <article className={Styles.MarketProperties}>
      <ul className={Styles.MarketProperties__meta}>
        <li>
          <span>Volume</span>
          <ValueDenomination formatted={shareVolumeRounded} denomination={shareDenomination} />
        </li>
        <li>
          <span>Fee</span>
          <ValueDenomination {...p.takerFeePercent} />
        </li>
        <li>
          <span>Expires</span>
          <span>{ p.endDate.formatted }</span>
        </li>
      </ul>
      <div>
        { p.isLogged && p.toggleFavorite &&
          <button
            className={classNames(Styles.MarketProperties__favorite, { [Styles.favorite]: p.isFavorite })}
            onClick={() => p.toggleFavorite(p.id)}
          >
            <i />
          </button>
        }
        <MarketLink
          className={Styles.MarketProperties__trade}
          id={p.id}
          formattedDescription={p.formattedDescription}
        >
          { buttonText }
        </MarketLink>
      </div>
    </article>
  )
}

export default MarketProperties
