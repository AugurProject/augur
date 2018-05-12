import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import { ChevronUp, ChevronDown } from 'modules/common/components/icons'

import { RANGES, PERIODS } from 'modules/market/constants/permissible-periods'

import Styles from 'modules/market/components/market-outcome-charts--candlestick-period-selector/market-outcome-charts--candlestick-period-selector.styles'
import { limitPeriodByRange } from 'src/modules/market/helpers'

export default class PeriodSelector extends Component {
  static propTypes = {
    updateSelectedPeriod: PropTypes.func.isRequired,
    updateSelectedRange: PropTypes.func.isRequired,
    selectedPeriod: PropTypes.number,
    selectedRange: PropTypes.number,
  }

  constructor(props) {
    super(props)

    this.state = {
      isModalActive: false,
    }

    this.handleWindowOnClick = this.handleWindowOnClick.bind(this)
    this.selectRange = this.selectRange.bind(this)
    this.selectPeriod = this.selectPeriod.bind(this)
  }

  componentDidMount() {
    window.addEventListener('click', this.handleWindowOnClick)
  }

  componentWillUnmount() {
    window.removeEventListener('click', this.handleWindowOnClick)
  }

  handleWindowOnClick(event) {
    if (this.periodSelector && !this.periodSelector.contains(event.target)) {
      this.setState({ isModalActive: false })
    }
  }

  selectRange(range) {
    const {
      selectedRange,
      updateSelectedRange,
    } = this.props


    updateSelectedRange(range.duration === selectedRange ? -1 : range.duration)
    this.setState({
      isModalActive: false,
    })
  }

  selectPeriod(period) {
    const {
      selectedPeriod,
      updateSelectedPeriod,
    } = this.props


    updateSelectedPeriod(period.duration === selectedPeriod ? -1 : period.duration)
    this.setState({
      isModalActive: false,
    })
  }

  render() {
    const {
      selectedPeriod,
      selectedRange,
    } = this.props

    const s = this.state

    const selectedPeriodLabel = (PERIODS.find(period => period.duration === selectedPeriod) || {}).label || null
    const selectedRangeLabel = (RANGES.find(range => range.duration === selectedRange) || {}).label || null

    const periodsToDisplay = limitPeriodByRange(selectedRange)


    return (
      <section className={Styles.PeriodSelector}>
        <button
          className={Styles.PeriodSelector__button}
          onClick={(e) => {
            e.stopPropagation()
            this.setState({ isModalActive: !s.isModalActive })
          }}
        >
          <span>
            {
              selectedRangeLabel && selectedPeriodLabel ?
                `${selectedRangeLabel}, ${selectedPeriodLabel}` :
                'Range, Period'
            }
          </span>
          {s.isModalActive ?
            <ChevronUp /> :
            <ChevronDown />
          }
        </button>
        <div
          ref={(periodSelector) => { this.periodSelector = periodSelector }}
          className={classNames(
            Styles.PeriodSelector__modal,
            {
              [Styles['PeriodSelector__modal--active']]: s.isModalActive,
            },
          )}
          role="button"
        >
          <div className={Styles.PeriodSelector__column}>
            <h1>Range</h1>
            <ul>
              {RANGES.map(range => (
                <li
                  key={range.duration}
                  className={Styles.PeriodSelector__value}
                >
                  <button
                    className={
                      classNames({
                        [Styles['PeriodSelector__value--active']]: range.duration === selectedRange,
                      })
                    }
                    onClick={() => this.selectRange(range)}
                  >
                    {range.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div className={Styles.PeriodSelector__column}>
            <h1>Period</h1>
            <ul>
              {periodsToDisplay.map(period => (
                <li
                  key={period.duration}
                  className={Styles.PeriodSelector__value}
                >
                  <button
                    className={
                      classNames({
                        [Styles['PeriodSelector__value--active']]: period.duration === selectedPeriod,
                      })
                    }
                    onClick={() => this.selectPeriod(period)}
                  >
                    {period.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    )
  }
}
