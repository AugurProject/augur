import React from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'

import SingleSlicePieGraph from 'src/modules/market/components/common/single-slice-pie-graph/single-slice-pie-graph'
import { convertUnixToFormattedDate } from 'utils/format-date'
import TimeRemainingIndicatorWrapper
  from 'src/modules/market/components/common/time-remaining-indicator/time-remaining-indicator'

import { TYPE_CLAIM_PROCEEDS } from 'modules/market/constants/link-types'
import Styles from 'modules/market/components/market-portfolio-card/market-portfolio-card.styles'
import { constants } from 'services/augurjs'
import moment from 'moment'

const MarketPortfolioCardFooter = (p) => {
  const WrappedGraph = TimeRemainingIndicatorWrapper(SingleSlicePieGraph)
  const showTimestamp = p.linkType === TYPE_CLAIM_PROCEEDS && !p.isClaimable
  const finalDate = new Date(p.finalizationTime*1000)
  const startTime = moment(p.finalDate).subtract(constants.CONTRACT_INTERVAL.CLAIM_PROCEEDS_WAIT_TIME, 'seconds').toDate()
  return (
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
            {showTimestamp &&
              <div className={Styles['MarketCard__proceeds-container']}>
                <span className={Styles['MarketCard__proceeds-text']}>Proceeds Available</span>
                <span className={Styles['MarketCard__proceeds-text-small']}>{convertUnixToFormattedDate(p.finalizationTime).formattedLocal}</span>
                <span className={Styles['MarketCard__proceeds-clock']}>
                  <WrappedGraph startDate={startTime} endTime={finalDate} currentTimestamp={p.currentTimestamp} />
                </span>
              </div>
            }
            <button
              className={classNames(Styles['MarketCard__action-footer'], Styles['MarketCard__action-footer-light'])}
              onClick={p.buttonAction}
              disabled={p.linkType === TYPE_CLAIM_PROCEEDS ? !p.isClaimable : false}
            >
              { p.localButtonText }
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}

MarketPortfolioCardFooter.propTypes = {
  isClaimable: PropTypes.bool,
  linkType: PropTypes.string.isRequired,
  localButtonText: PropTypes.string.isRequired,
  buttonAction: PropTypes.func,
  outstandingReturns: PropTypes.number,
  finalizationTime: PropTypes.number,
  currentTimestamp: PropTypes.number.isRequired,
  endTime: PropTypes.object,
}

export default MarketPortfolioCardFooter
