import { augur } from 'services/augurjs'
import React from 'react'
import PropTypes from 'prop-types'
import { getDaysRemaining } from 'utils/format-date'

import Styles from 'modules/forking/components/forking-progress-bar/forking-progress-bar.styles'

const SECONDS_PER_DAY = 3600 * 24

const ForkingProgressBar = (p) => {
  const forkingPeriodInDays = augur.constants.CONTRACT_INTERVAL.FORK_DURATION_SECONDS / SECONDS_PER_DAY

  const daysRemaining = getDaysRemaining(p.forkEndTime, p.currentTime)

  const percentagePassed = (100 * (forkingPeriodInDays - daysRemaining)) / forkingPeriodInDays

  const percentageCompleteWidth = {
    width: `${percentagePassed}%`,
  }

  return (
    <article>
      <div className={Styles.ForkingProgressBar}>
        <div className={Styles.ForkingProgressBar__graph}>
          <div className={percentagePassed <= 90 ? Styles.ForkingProgressBar__current : Styles.ForkingProgressBar__current_overflow}>
            <div style={percentageCompleteWidth}>
              <span>{ daysRemaining } {daysRemaining === 1 ? 'day' : 'days'} left</span>
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}

ForkingProgressBar.propTypes = {
  forkEndTime: PropTypes.string.isRequired,
  currentTime: PropTypes.number.isRequired,
}

export default ForkingProgressBar
