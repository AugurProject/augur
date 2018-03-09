import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import ReactTooltip from 'react-tooltip'

import getValue from 'utils/get-value'

import Styles from 'modules/reporting/components/reporting-payouts/reporting-payouts.styles'
import TooltipStyles from 'modules/common/less/tooltip'

const Outcome = ({ className, outcome }) => (
  <div className={className || Styles.MarketReportingPayouts__outcome}>
    <div className={Styles['MarketReportingPayouts__outcome-name']}>
      {outcome.name}
    </div>
    { outcome.id === 0 &&
      <div className={Styles['MarketReportingPayouts__winning-outcome-message']}>
        tentative winning outcome
      </div>
    }
    { outcome.id !== 0 &&
      <div>
        <div
          className={Styles["MarketReportingPayouts__progress-bar-container"]}
          data-tip
          data-for={"tooltip--rep-progress-"+outcome.id}
        >
          <div className={Styles["MarketReportingPayouts__progress-bar"]}>
            <div className={Styles["MarketReportingPayouts__progress-bar-percentage-user"]} style={{width: String(outcome.userRep * 100 / outcome.goal ) + '%'}}></div>
            <div className={Styles["MarketReportingPayouts__progress-bar-percentage"]} style={{width: String(outcome.totalRep * 100 / outcome.goal) + '%'}}></div>
          </div>
          <span className={Styles['MarketReportingPayouts__progress-bar-total-rep-text']}>{outcome.totalRep}</span>
          <span className={Styles['MarketReportingPayouts__progress-bar-goal-text']}> &#124; {outcome.goal} REP</span>
        </div>
        <ReactTooltip
          id={"tooltip--rep-progress-"+outcome.id}
          className={TooltipStyles.Tooltip}
          effect="solid"
          place="top"
          offset={{left: 70, top: 6}}
          type="light"
        >
          <p>{outcome.userRep} REP Staked</p>
        </ReactTooltip>
      </div>
    }
  </div>
)

class MarketReportingPayouts extends Component {
  constructor(props) {
    super(props)

    this.state = {
      outcomeWrapperHeight: 0,
      isOpen: false,
    }

    this.showMore = this.showMore.bind(this)
  }

  showMore() {
    const outcomeWrapperHeight = this.state.isOpen ? 0 : `${this.outcomeTable.clientHeight}px`

    this.setState({
      outcomeWrapperHeight,
      isOpen: !this.state.isOpen,
    })
  }

  render() {
    const { outcomes } = this.props
    const totalOutcomes = outcomes.length

    const displayShowMore = totalOutcomes > 3
    const showMoreText = this.state.isOpen ? `- ${totalOutcomes - 3} less` : `+ ${totalOutcomes - 3} more`

    const outcomeWrapperStyle = {
      minHeight: this.state.outcomeWrapperHeight,
    }

    return (
      <div
        className={Styles.MarketReportingPayouts}
        style={outcomeWrapperStyle}
      >
        { outcomes.length > 0 &&
          <Outcome
            className={Styles['MarketReportingPayouts__height-sentinel']}
            outcome={outcomes[0]}
          />
        }
        <div
          className={classNames(Styles['MarketReportingPayouts__outcomes-container'], {
            [`${Styles['show-more']}`]: displayShowMore,
          })}
        >
          { displayShowMore &&
            <button
              className={Styles['MarketReportingPayouts__show-more']}
              onClick={this.showMore}
            >
              { showMoreText }
            </button>
          }
          <div
            ref={(outcomeTable) => { this.outcomeTable = outcomeTable }}
            className={Styles.MarketReportingPayouts__outcomes}
          >
            {outcomes.length > 0 && outcomes.map(outcome => (
              <Outcome
                key={outcome.id}
                outcome={outcome}
              />
            ))}
          </div>
        </div>
      </div>
    )
  }
}

MarketReportingPayouts.propTypes = {
  outcomes: PropTypes.array.isRequired,
}

Outcome.propTypes = {
  outcome: PropTypes.object.isRequired,
  className: PropTypes.string,
}

export default MarketReportingPayouts
