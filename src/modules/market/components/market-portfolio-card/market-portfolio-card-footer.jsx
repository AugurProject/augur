import React from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'

import SingleSlicePieGraph from 'src/modules/market/components/common/single-slice-pie-graph/single-slice-pie-graph'
import { convertUnixToFormattedDate, formatDate } from 'utils/format-date'
import TimeRemainingIndicatorWrapper
  from 'src/modules/market/components/common/time-remaining-indicator/time-remaining-indicator'
import moment from 'moment'
import { TYPE_CLAIM_PROCEEDS } from 'modules/market/constants/link-types'
import Styles from 'modules/market/components/market-portfolio-card/market-portfolio-card.styles'
import { constants } from 'services/augurjs'
import { formatEther } from 'utils/format-number'

const MarketPortfolioCardFooter = (p) => {
  const WrappedGraph = TimeRemainingIndicatorWrapper(SingleSlicePieGraph)
  const showTimestamp = p.linkType === TYPE_CLAIM_PROCEEDS
  const startTime = new Date(p.finalizationTime*1000)
  const finalTime = moment(startTime).add(constants.CONTRACT_INTERVAL.CLAIM_PROCEEDS_WAIT_TIME, 'seconds').toDate()
  const canClaim = p.linkType === TYPE_CLAIM_PROCEEDS && p.currentTimestamp - formatDate(finalTime).timestamp > 0
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
              <span className={Styles['MarketCard__heavy-text']}>{formatEther(p.outstandingReturns).formattedValue} ETH</span>
            </div>
          }
          <div className={Styles['MarketCard__action-container']}>
            {showTimestamp &&
              <div className={Styles['MarketCard__proceeds-container']}>
                <span className={Styles['MarketCard__proceeds-text']}>Proceeds Available</span>
                <span className={Styles['MarketCard__proceeds-text-small']}>{convertUnixToFormattedDate(p.finalizationTime).formattedLocal}</span>
                <span className={Styles['MarketCard__proceeds-clock']}>
                  <WrappedGraph startDate={startTime} endTime={finalTime} currentTimestamp={p.currentTimestamp} />
                </span>
              </div>
            }
            <button
              className={classNames(Styles['MarketCard__action-footer-light'])}
              onClick={p.buttonAction}
              disabled={p.linkType === TYPE_CLAIM_PROCEEDS && !canClaim}
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
  disableButton: PropTypes.bool,
  linkType: PropTypes.string.isRequired,
  localButtonText: PropTypes.string.isRequired,
  buttonAction: PropTypes.func,
  outstandingReturns: PropTypes.number,
  finalizationTime: PropTypes.number,
  currentTimestamp: PropTypes.number.isRequired,
  endTime: PropTypes.object,
}

export default MarketPortfolioCardFooter
