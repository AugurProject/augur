import React from 'react'
import PropTypes from 'prop-types'

/*
* Note this component does not update as time progresses.
*
* */
export default function TimeRemainingIndicatorWrapper(BaseCmp) {
  const TimeRemainingIndicator = (props) => {
    const { startDate, endDate, ...otherProps } = props
    const duration = endDate.getTime() - startDate.getTime()
    // Render null if given invalid input
    if (duration < 0) {
      return null
    }

    const currentOffsetFromStart = Date.now() - startDate.getTime()
    // make sure not to divide a negative or else we are always going to be 0 for time elapsed.
    let percentageElapsed = Math.abs(currentOffsetFromStart / duration)

    percentageElapsed = (percentageElapsed > 1) ? 1 : percentageElapsed
    percentageElapsed = (percentageElapsed < 0) ? 0 : percentageElapsed

    return (
      <BaseCmp percentage={percentageElapsed} {...otherProps} />
    )
  }

  TimeRemainingIndicator.propTypes = {
    endDate: PropTypes.instanceOf(Date).isRequired,
    startDate: PropTypes.instanceOf(Date).isRequired,
  }

  return TimeRemainingIndicator
}
