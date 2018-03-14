import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { getDaysRemaining } from 'utils/format-date'

import Styles from 'modules/forking/components/forking-progress-bar/forking-progress-bar.styles'

class ForkingProgressBar extends Component {
  constructor(props) {
    super(props)

    this.state = {}
  }

  render() {
    const forkingPeriodInDays = 60

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
}

ForkingProgressBar.propTypes = {
  forkEndTime: PropTypes.string.isRequired,
  currentTime: PropTypes.number.isRequired,
}

export default ForkingProgressBar
