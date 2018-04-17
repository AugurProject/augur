import React from 'react'
import PropTypes from 'prop-types'
// import ReactTooltip from 'react-tooltip'
// import { Line } from 'rc-progress'

import Bullet from 'modules/common/components/bullet'

const Universe = p => (
  <article className="universe-info">
    <span className="reporting-cycle-info">
      Reporting Period {p.currentReportingWindowAddress} <Bullet /> {Math.round(p.currentReportingPeriodPercentComplete)}% complete <Bullet /> period ends {p.reportingCycleTimeRemaining}
    </span>
    <span
      data-tip
      data-for="universe-id-tooltip"
      data-event="click focus"
      className="universe-description pointer"
    >
      {p.description} <Bullet /> {p.reportingPeriodDurationInSeconds / 3600} hours per period
    </span>
  </article>
)

Universe.propTypes = {
  className: PropTypes.string,
  description: PropTypes.string,
  id: PropTypes.string,
  reportingPeriodDurationInSeconds: PropTypes.number,
  reportingCycleTimeRemaining: PropTypes.string,
  currentReportingPeriodPercentComplete: PropTypes.number,
}

export default Universe

// NOTE -- was directly after parent opening tag
// <Line
//   percent={p.currentReportingPeriodPercentComplete}
//   strokeWidth="1"
//   strokeColor="#5c2634"
// />

// <ReactTooltip
//   id="universe-id-tooltip"
//   type="light"
//   effect="float"
//   place="top"
//   globalEventOff="click"
// >
//   <span className="tooltip-text">
//     Universe ID: {p.id}
//   </span>
// </ReactTooltip>
