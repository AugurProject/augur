import React from 'react'
import PropTypes from 'prop-types'
import ReactTooltip from 'react-tooltip'

import ValueDenomination from 'modules/common/components/value-denomination/value-denomination'
import ValueDate from 'modules/common/components/value-date'

const MyReport = p => (
  <article
    className="my-report portfolio-detail"
  >
    <div className="portfolio-group portfolio-main-group">
      <div className="portfolio-pair">
        <span className="main-group-title">outcome: </span>
        <span className="report-main-group-title-outcome">
          {p.outcome && p.outcomePercentage && p.outcomePercentage.value &&
            <span>{p.outcome}  (<ValueDenomination {...p.outcomePercentage} />)</span>
          }
          {p.outcome && !p.outcomePercentage &&
            <span>{p.outcome}</span>
          }
          {!p.outcome &&
            <span>&mdash;</span>
          }
        </span>
      </div>
      <div className="portfolio-pair">
        <span className="report-main-group-title">reported: </span>
        <span className="report-main-group-title-outcome">
          {!!p.isSubmitted &&
            <span className="report-revealed">
              {p.reported || <span>&mdash;</span>}
            </span>
          }
          {!p.isSubmitted &&
            <span>{p.reported || <span>&mdash;</span>}</span>
          }
          {!!p.outcome && p.isReportEqual &&
            <i
              className="fa fa-check-circle report-equal"
              data-tip="Your report matches the consensus outcome"
            />
          }
          {!!p.outcome && !p.isReportEqual &&
            <i
              className="fa fa-times-circle report-unequal"
              data-tip="Your report does not match the consensus outcome"
            />
          }
        </span>
      </div>
      <div className="portfolio-pair">
        <span className="report-main-group-title">cycle: </span>
        <span className="report-main-group-title-outcome">
          {p.period ?
            <span>
              {p.period}
            </span> :
            <span>&mdash;</span>
          }
        </span>
      </div>
    </div>
    <div className="portfolio-group">
      {/*
      <div className="portfolio-pair">
        <span className="title">fees gain/loss</span>
        <ValueDenomination
          className="colorize"
          {...p.feesEarned}
        />
      </div>
      */}
      <div className="portfolio-pair">
        <span className="title">rep gain/loss</span>
        <ValueDenomination
          className="colorize"
          {...p.repEarned}
        />
      </div>
      <div className="portfolio-pair">
        <span className="title">ended</span>
        <ValueDate {...p.endDate} />
      </div>
    </div>
    <ReactTooltip type="light" effect="solid" place="top" />
  </article>
)

MyReport.propTypes = {
  outcome: PropTypes.string,
  outcomePercentage: PropTypes.object,
  reported: PropTypes.string,
  repEarned: PropTypes.object,
  period: PropTypes.number,
  isSubmitted: PropTypes.bool,
  isReportEqual: PropTypes.bool,
  universe: PropTypes.object.isRequired,
  endDate: PropTypes.object.isRequired
}

export default MyReport
