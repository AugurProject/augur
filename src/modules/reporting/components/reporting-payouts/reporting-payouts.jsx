import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import ReactTooltip from 'react-tooltip'
import { createBigNumber } from 'utils/create-big-number'
import { formatAttoRep } from 'utils/format-number'
import Styles from 'modules/reporting/components/reporting-payouts/reporting-payouts.styles'
import TooltipStyles from 'modules/common/less/tooltip'
import { ExclamationCircle } from 'modules/common/components/icons'

const Outcome = ({ className, outcome, marketId }) => {
  const totalBondSizeCurrent = formatAttoRep(outcome.bondSizeCurrent, { decimals: 4, roundUp: true }).formatted
  const currentOutcomeStake = formatAttoRep(outcome.stakeCurrent, { decimals: 4, roundUp: true }).formatted
  const currentStakeRep = formatAttoRep(outcome.accountStakeCurrent, { decimals: 4, roundUp: true })
  const currentAccountStake = currentStakeRep.formatted === '-' ? '0' : currentStakeRep.formatted
  const outcomeName = outcome.name === 'Indeterminate' ? 'Invalid' : outcome.name
  const bnPct = createBigNumber(outcome.percentageAccount)
  const offset = outcome.percentageAccount === 0 ? 0 : createBigNumber(120).minus(bnPct).toNumber()

  return (
    <div className={className || Styles.MarketReportingPayouts__outcome}>
      <div className={Styles['MarketReportingPayouts__outcome-name']}>
        { outcome.potentialFork &&
          <span className={Styles.MarketReportingPayouts__alert_icon}>
            {ExclamationCircle}
          </span>
        }
        <span className={Styles['MarketReportingPayouts__outcome-name-text']}>
          {outcomeName}
        </span>
      </div>
      { outcome.tentativeWinning &&
        <div className={Styles['MarketReportingPayouts__winning-outcome-message']}>
          tentative winning outcome
        </div>
      }
      { !outcome.tentativeWinning &&
        <div>
          <div
            className={Styles['MarketReportingPayouts__progress-bar-container']}
          >
            <div
              className={Styles['MarketReportingPayouts__progress-bar']}
              data-tip
              data-for={'tooltip--rep-progress-'+outcome.id+marketId}
            >
              <div className={Styles['MarketReportingPayouts__progress-bar-percentage-user']} style={{ width: String(outcome.percentageAccount) + '%' }} />
              <div className={Styles['MarketReportingPayouts__progress-bar-percentage']} style={{ width: String(outcome.percentageComplete) + '%' }} />
            </div>
            <span className={Styles['MarketReportingPayouts__progress-bar-total-rep-text']}>{currentOutcomeStake}</span>
            <span className={Styles['MarketReportingPayouts__progress-bar-goal-text']}> &#124; {totalBondSizeCurrent} REP</span>
          </div>
          <ReactTooltip
            id={'tooltip--rep-progress-'+outcome.id+marketId}
            className={TooltipStyles.Tooltip}
            effect="solid"
            place="top"
            offset={{ left: offset, top: 6 }}
            type="light"
          >
            <p>{currentAccountStake} REP Staked
            </p>
          </ReactTooltip>
        </div>
      }
    </div>
  )
}

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
    const { outcomes, marketId } = this.props

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
            marketId={marketId}
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
                marketId={marketId}
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
  marketId: PropTypes.string.isRequired,
}

Outcome.propTypes = {
  outcome: PropTypes.object.isRequired,
  className: PropTypes.string,
  marketId: PropTypes.string,
}

export default MarketReportingPayouts
