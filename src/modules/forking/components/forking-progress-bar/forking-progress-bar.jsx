import { augur } from 'services/augurjs'
import React from 'react'
import PropTypes from 'prop-types'
import { getDaysRemaining } from 'utils/format-date'

import Styles from 'modules/forking/components/forking-progress-bar/forking-progress-bar.styles'

const SECONDS_PER_DAY = 3600 * 24

const ForkingProgressBar = (p) => {
  const forkingPeriodInDays = augur.rpc.constants.CONTRACT_INTERVAL.FORK_DURATION_SECONDS / SECONDS_PER_DAY

  const daysRemaining = getDaysRemaining(this.props.forkEndTime, this.props.currentTime)

  const percentagePassed = (100 * (forkingPeriodInDays - daysRemaining)) / forkingPeriodInDays

  // Move the label to the left if the bar is pushing the label too far right
  const daysLeftOnRightSide = percentagePassed < 85

  const percentageCompleteWidth = {
    width: `${percentagePassed}%`,
  }

  const percentageCompleteMarginLeft = {
    marginLeft: `${percentagePassed}%`,
  }

  return (
    <article>
      <section className={Styles.ForkingProgressBar}>
        <div className={Styles.ForkingProgressBar__background}>
          <div
            className={Styles.ForkingProgressBar__progress}
            style={percentageCompleteWidth}
          />
          <div
            className={Styles.ForkingProgressBar__days_left_label}
            style={daysLeftOnRightSide ? percentageCompleteMarginLeft : { position: 'absolute' }}
          >
            {daysRemaining} days left
          </div>
        </div>
      </section>
    </article>
  )
}

ForkingProgressBar.propTypes = {
  forkEndTime: PropTypes.string.isRequired,
  currentTime: PropTypes.number.isRequired,
}

export default ForkingProgressBar
