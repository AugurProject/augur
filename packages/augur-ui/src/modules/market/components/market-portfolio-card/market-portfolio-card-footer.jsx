import React from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'

import SingleSlicePieGraph from 'src/modules/market/components/common/single-slice-pie-graph/single-slice-pie-graph'
import { convertUnixToFormattedDate } from 'utils/format-date'
import TimeRemainingIndicatorWrapper
  from 'src/modules/market/components/common/time-remaining-indicator/time-remaining-indicator'
import { createBigNumber } from 'utils/create-big-number'
import moment from 'moment'
import { TYPE_CLAIM_PROCEEDS } from 'modules/market/constants/link-types'
import Styles from 'modules/market/components/market-portfolio-card/market-portfolio-card.styles'
import { constants } from 'services/augurjs'
import { formatEther } from 'utils/format-number'

const MarketPortfolioCardFooter = (p) => {
  const WrappedGraph = TimeRemainingIndicatorWrapper(SingleSlicePieGraph)
  const currentTimestampInSeconds = p.currentTimestamp
  let canClaim = false
  let startTime = null
  let finalTime = null
  let endTimestamp = null
  if (p.finalizationTime) {
    startTime = new Date(p.finalizationTime*1000)
    finalTime = moment(startTime).add(constants.CONTRACT_INTERVAL.CLAIM_PROCEEDS_WAIT_TIME, 'seconds').toDate()
    endTimestamp = createBigNumber(p.finalizationTime).plus(createBigNumber(constants.CONTRACT_INTERVAL.CLAIM_PROCEEDS_WAIT_TIME))
    const timeHasPassed = createBigNumber(currentTimestampInSeconds).minus(endTimestamp)
    canClaim = p.linkType === TYPE_CLAIM_PROCEEDS && timeHasPassed.toNumber() > 0
  }
  const userHasClaimableForkFees = ((p.unclaimedForkEth && p.unclaimedForkEth.value > 0) || (p.unclaimedForkRepStaked && p.unclaimedForkRepStaked.value > 0))

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
          {p.linkType === TYPE_CLAIM_PROCEEDS && userHasClaimableForkFees &&
            <span className={Styles['MarketCard__light-text']}>Outstanding Returns
              <span className={Styles['MarketCard__heavy-text']}>{p.unclaimedForkEth.formattedValue} ETH</span>|
              <span className={Styles['MarketCard__heavy-text']}>{p.unclaimedForkRepStaked.formattedValue} REP</span>
            </span>
          }
          {p.linkType === TYPE_CLAIM_PROCEEDS && !userHasClaimableForkFees &&
            <span className={Styles['MarketCard__light-text']}>Outstanding Returns
              <span className={Styles['MarketCard__heavy-text']}>{formatEther(p.outstandingReturns).formattedValue} ETH</span>
            </span>
          }
          <div className={Styles['MarketCard__action-container']}>
            {p.linkType === TYPE_CLAIM_PROCEEDS && p.finalizationTime && !canClaim &&
              <div className={Styles['MarketCard__proceeds-container']}>
                <span className={Styles['MarketCard__proceeds-text']}>Proceeds Available</span>
                <span className={Styles['MarketCard__proceeds-text-small']}>{convertUnixToFormattedDate(endTimestamp.toNumber()).formattedLocal}</span>
                <span className={Styles['MarketCard__proceeds-clock']}>
                  <WrappedGraph startDate={startTime} endTime={finalTime} currentTimestamp={currentTimestampInSeconds*1000} backgroundColor="#ceccd8" />
                </span>
              </div>
            }
            <button
              className={classNames(Styles['MarketCard__action-footer-light'])}
              onClick={p.buttonAction}
              disabled={p.linkType === TYPE_CLAIM_PROCEEDS && !canClaim && !userHasClaimableForkFees}
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
  linkType: PropTypes.string.isRequired,
  localButtonText: PropTypes.string.isRequired,
  buttonAction: PropTypes.func,
  outstandingReturns: PropTypes.string,
  finalizationTime: PropTypes.number,
  currentTimestamp: PropTypes.number.isRequired,
  unclaimedForkEth: PropTypes.object,
  unclaimedForkRepStaked: PropTypes.object,
}

export default MarketPortfolioCardFooter
