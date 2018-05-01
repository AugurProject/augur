import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import ReactTooltip from 'react-tooltip'
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
            <div className={Styles['MarketReportingPayouts__progress-bar']}>
              <div
                className={Styles['MarketReportingPayouts__progress-bar-percentage-user']}
                style={{ width: String(outcome.percentageAccount) + '%' }}
                data-tip
                data-for={'tooltip--rep-progress-'+outcome.id+marketId}
              />
              <div
                className={Styles['MarketReportingPayouts__progress-bar-percentage']}
                style={{ width: String(outcome.percentageComplete) + '%' }}
              />
            </div>
            <span className={Styles['MarketReportingPayouts__progress-bar-total-rep-text']}>{currentOutcomeStake}</span>
            <span className={Styles['MarketReportingPayouts__progress-bar-break']}> / </span>
            <span className={Styles['MarketReportingPayouts__progress-bar-goal-text']}>{totalBondSizeCurrent} REP</span>
          </div>
          <ReactTooltip
            id={'tooltip--rep-progress-'+outcome.id+marketId}
            className={TooltipStyles.Tooltip}
            effect="solid"
            place="top"
            offset={{ left: 0, top: 6 }}
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
      outcomeWrapperHeight: this.getInitialHeight(props.isMobile, props.isMobileSmall),
      isOpen: false,
    }

    this.showMore = this.showMore.bind(this)
  }

  componentDidMount() {
    const calculatedHeight = this.getInitialHeight(this.props.isMobile, this.props.isMobileSmall)
    this.setState({ outcomeWrapperHeight: calculatedHeight })
  }

  componentWillReceiveProps(nextProps) { // move to getDerivedStateFromProps in React 16.3
    if (nextProps.isMobile !== this.props.isMobile || nextProps.isMobileSmall !== this.props.isMobileSmall) {
      this.setState({
        outcomeWrapperHeight: this.getInitialHeight(nextProps.isMobile, nextProps.isMobileSmall),
        isOpen: false,
      })
    }
  }

  getInitialHeight(isMobile, isMobileSmall) {
    // + 12 accounts for margins
    const cellHeight = (this.outcomeTable && this.outcomeTable.firstChild && this.outcomeTable.firstChild.clientHeight + 12) || 54

    if (isMobileSmall) {
      return cellHeight * 3
    } else if (isMobile) {
      return cellHeight * 2
    }
    return 0
  }

  showMore() {
    const outcomeWrapperHeight = this.state.isOpen ? this.getInitialHeight(this.props.isMobile, this.props.isMobileSmall) : `${this.outcomeTable.clientHeight}px`

    this.setState({
      outcomeWrapperHeight,
      isOpen: !this.state.isOpen,
    })
  }

  render() {
    const { outcomes, marketId, isMobile, isMobileSmall } = this.props

    const numShown = isMobile && !isMobileSmall ? 4 : 3
    const totalOutcomes = outcomes.length
    const displayShowMore = totalOutcomes > numShown
    const showMoreText = this.state.isOpen ? `- ${totalOutcomes - numShown} less` : `+ ${totalOutcomes - numShown} more`

    const outcomeWrapperStyle = {
      minHeight: this.state.outcomeWrapperHeight,
    }

    return (
      <div className={Styles.MarketReportingPayouts__container}>
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
        <div className={classNames(Styles['MarketReportingPayouts__button-container'])}>
          { displayShowMore &&
            <button
              className={Styles['MarketReportingPayouts__show-more']}
              onClick={this.showMore}
            >
              { showMoreText }
            </button>
          }
        </div>
      </div>
    )
  }
}

MarketReportingPayouts.propTypes = {
  outcomes: PropTypes.array.isRequired,
  marketId: PropTypes.string.isRequired,
  isMobile: PropTypes.bool,
  isMobileSmall: PropTypes.bool,
}

Outcome.propTypes = {
  outcome: PropTypes.object.isRequired,
  className: PropTypes.string,
  marketId: PropTypes.string,
}

export default MarketReportingPayouts
