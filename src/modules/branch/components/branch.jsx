import React from 'react'
import PropTypes from 'prop-types'
import ReactTooltip from 'react-tooltip'
import { Line } from 'rc-progress'

import Bullet from 'modules/common/components/bullet'

const Branch = p => (
  <article className="branch-info">
    <Line
      percent={p.currentReportingPeriodPercentComplete}
      strokeWidth="1"
      strokeColor="#5c2634"
    />
    <span className="reporting-cycle-info">
      Reporting Period {p.currentReportingWindowAddress} <Bullet /> {Math.round(p.currentReportingPeriodPercentComplete)}% complete <Bullet /> period ends {p.reportingCycleTimeRemaining}
    </span>
    <span
      data-tip
      data-for="branch-id-tooltip"
      data-event="click focus"
      className="branch-description pointer"
    >
      {p.description} <Bullet /> {p.reportingPeriodDurationInSeconds / 3600} hours per period
    </span>
    <ReactTooltip
      id="branch-id-tooltip"
      type="light"
      effect="float"
      place="top"
      globalEventOff="click"
    >
      <span className="tooltip-text">
        Branch ID: {p.id}
      </span>
    </ReactTooltip>
  </article>
)

Branch.propTypes = {
  className: PropTypes.string,
  description: PropTypes.string,
  id: PropTypes.string,
  reportingPeriodDurationInSeconds: PropTypes.number,
  reportingCycleTimeRemaining: PropTypes.string,
  currentReportingPeriodPercentComplete: PropTypes.number
}

export default Branch
