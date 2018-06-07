/* eslint react/no-array-index-key: 0 */ // It's OK in this specific instance as order remains the same

import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import MarketOutcomesBinaryScalar
  from 'modules/market/components/market-outcomes-yes-no-scalar/market-outcomes-yes-no-scalar'
import MarketOutcomesCategorical
  from 'modules/market/components/market-outcomes-categorical/market-outcomes-categorical'
import MarketLink from 'modules/market/components/market-link/market-link'

import toggleTag from 'modules/routes/helpers/toggle-tag'
import toggleCategory from 'modules/routes/helpers/toggle-category'
import { formatDate } from 'utils/format-date'
import getValue from 'utils/get-value'
import { YES_NO, SCALAR, CATEGORICAL } from 'modules/markets/constants/market-types'

import CommonStyles from 'modules/market/components/common/market-common.styles'
import Styles from 'modules/market/components/market-basics/market-basics.styles'
import SingleSlicePieGraph from 'src/modules/market/components/common/single-slice-pie-graph/single-slice-pie-graph'
import TimeRemainingIndicatorWrapper
  from 'src/modules/market/components/common/time-remaining-indicator/time-remaining-indicator'
import { constants } from 'services/augurjs'
import moment from 'moment'
import { compact } from 'lodash'
import { CategoryTagTrail } from 'src/modules/common/components/category-tag-trail/category-tag-trail'

const MarketBasics = ({ category, tags = [], location, history, marketType, ...p }) => {
  let ReportEndingIndicator = () => null
  if ((p.reportingState === constants.REPORTING_STATE.DESIGNATED_REPORTING) && !p.hideReportEndingIndicator) {
    const WrappedGraph = TimeRemainingIndicatorWrapper(SingleSlicePieGraph)
    const endTime = moment(p.endTime.value).add(constants.CONTRACT_INTERVAL.DESIGNATED_REPORTING_DURATION_SECONDS, 'seconds').toDate()
    const displayDate = formatDate(endTime)

    ReportEndingIndicator = () => (
      <div className={Styles.MarketBasics__reportingends}>
        <div>{p.isMobile ? `In Reporting` : `Reporting Ends ${displayDate.formattedLocalShortTime}`}</div>
        <WrappedGraph startDate={p.endTime.value} endTime={endTime} currentTimestamp={p.currentTimestamp} />
      </div>
    )
  }

  const process = (...arr) => compact(arr).map(label => ({
    label,
    onClick: toggleCategory(label, location, history),
  }))

  const categoriesWithClick = process(category)
  const tagsWithClick = compact(tags).map(tag => ({
    label: tag,
    onClick: toggleTag(tag, location, history),
  }))

  return (
    <article className={Styles.MarketBasics}>
      <div
        className={classNames(CommonStyles.MarketCommon__topcontent, { [`${CommonStyles['single-card']}`]: p.cardStyle === 'single-card' })}
      >
        <div className={Styles.MarketBasics__header}>
          <CategoryTagTrail categories={categoriesWithClick} tags={tagsWithClick} />
          {p.showDisputeRound &&
            <div className={Styles['MarketBasics__round-number']}>
              <span className={Styles['MarketBasics__round-label']}>Dispute Round</span>
              <span className={Styles['MarketBasics__round-text']}>
                { getValue(p, 'disputeInfo.disputeRound') }
              </span>
            </div>
          }
          <ReportEndingIndicator />
        </div>
        <h1 className={CommonStyles.MarketCommon__description}>
          <MarketLink
            id={p.id}
            formattedDescription={p.formattedDescription}
          >
            {p.description}
          </MarketLink>
        </h1>

        {(marketType === YES_NO || marketType === SCALAR) &&
        <MarketOutcomesBinaryScalar
          outcomes={p.outcomes}
          min={p.minPrice}
          max={p.maxPrice}
          type={marketType}
          scalarDenomination={p.isMobile ? '' : p.scalarDenomination}
        />
        }

        {marketType === CATEGORICAL &&
        <MarketOutcomesCategorical outcomes={p.outcomes} />
        }
      </div>
    </article>
  )
}

MarketBasics.propTypes = {
  category: PropTypes.string,
  history: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  isLogged: PropTypes.bool.isRequired,
  toggleFavorite: PropTypes.func,
  currentTimestamp: PropTypes.number.isRequired,
  marketType: PropTypes.string,
  hideReportEndingIndicator: PropTypes.bool,
  showDisputeRound: PropTypes.bool,
  tags: PropTypes.arrayOf(PropTypes.string),
}

export default MarketBasics
