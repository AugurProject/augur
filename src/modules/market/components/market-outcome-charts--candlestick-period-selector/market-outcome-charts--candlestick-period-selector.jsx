import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import { ChevronUp, ChevronDown } from 'modules/common/components/icons'

import { isEmpty } from 'lodash'

import { RANGES, PERIODS } from 'modules/market/constants/permissible-periods'

import Styles from 'modules/market/components/market-outcome-charts--candlestick-period-selector/market-outcome-charts--candlestick-period-selector.styles'

export default class PeriodSelector extends Component {
  static propTypes = {
    priceTimeSeries: PropTypes.array.isRequired,
    updateSelectedPeriod: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props)

    this.state = {
      selectedRange: -1,
      selectedPeriod: -1,
      permissibleRanges: [],
      permissiblePeriods: [],
      isModalActive: false,
    }

    this.updatePermissibleValues = this.updatePermissibleValues.bind(this)
    this.validateAndUpdateSelection = this.validateAndUpdateSelection.bind(this)
  }

  componentWillMount() {
    this.updatePermissibleValues(this.props.priceTimeSeries, this.state.selectedRange, this.state.selectedPeriod)
  }

  componentWillUpdate(nextProps, nextState) {
    if (
      this.props.priceTimeSeries.length !== nextProps.priceTimeSeries.length ||
      this.state.selectedRange !== nextState.selectedRange ||
      this.state.selectedPeriod !== nextState.selectedPeriod
    ) {
      this.updatePermissibleValues(nextProps.priceTimeSeries, nextState.selectedRange, nextState.selectedPeriod)
    }
  }

  updatePermissibleValues(priceTimeSeries, selectedRange, selectedPeriod) {
    // NOTE --  fundamental assumption is that the RANGES and PERIODS arrays have
    //          the same number of values that also directly correspond to each other

    const seriesRange = !isEmpty(priceTimeSeries) ?
      priceTimeSeries[priceTimeSeries.length - 1].timestamp - priceTimeSeries[0].timestamp :
      null

    let permissibleRanges = []
    let permissiblePeriods = []

    if (seriesRange !== null) {
      // Permissible ranges based on series
      permissibleRanges = RANGES.reduce((p, currentRange, i) => {
        // Lower Bound + initial upper
        if (i === 0) {
          return [currentRange.range]
        }

        // Upper Bound
        if (currentRange.range === null) { // null is a special case that denotes 'Full range'
          if (seriesRange > RANGES[i - 1].range) return [...p, currentRange.range]
        } else if (currentRange.range <= seriesRange) {
          return [...p, currentRange.range]
        }

        return p
      }, [])

      // Permissible periods based on series
      permissiblePeriods = PERIODS.reduce((p, currentPeriod, i) => {
        if (permissibleRanges.indexOf(selectedRange) === 0) {
          if (i === 0) return [currentPeriod.period]

          return p
        } else if (currentPeriod.period === selectedRange) {
          return [PERIODS[i - 2].period, PERIODS[i - 1].period]
        }

        return p
      }, [])
    }

    this.setState({
      permissibleRanges,
      permissiblePeriods,
    }, () => this.validateAndUpdateSelection(permissibleRanges, permissiblePeriods, selectedRange, selectedPeriod))
  }

  validateAndUpdateSelection(permissibleRanges, permissiblePeriods, selectedRange, selectedPeriod) {
    // All we're doing here is validating selections relative to each other + setting defaults
    // Establishment of permissible bounds happens elsewhere
    let updatedSelectedRange
    let updatedSelectedPeriod

    // No valid options to select
    if (isEmpty(permissibleRanges)) {
      updatedSelectedRange = -1
      updatedSelectedPeriod = -1
    } else {
      // Update Range Selection
      if (
        selectedRange === -1
      ) {
        updatedSelectedRange = permissibleRanges[permissibleRanges.length - 1]
      } else {
        updatedSelectedRange = selectedRange
      }

      // Update Period Selection
      if (
        (
          selectedPeriod === -1 &&
          permissiblePeriods.length !== 0
        ) ||
        permissiblePeriods.indexOf(selectedPeriod) === -1
      ) {
        updatedSelectedPeriod = permissiblePeriods[permissiblePeriods.length - 1]
      } else {
        updatedSelectedPeriod = selectedPeriod
      }
    }

    this.setState({
      selectedRange: updatedSelectedRange,
      selectedPeriod: updatedSelectedPeriod,
    })

    this.props.updateSelectedPeriod({
      selectedRange: updatedSelectedRange,
      selectedPeriod: updatedSelectedPeriod,
    })
  }

  render() {
    const s = this.state

    const selectedPeriodLabel = (PERIODS.find(period => period.period === s.selectedPeriod) || {}).label || null
    const selectedRangeLabel = (RANGES.find(range => range.range === s.selectedRange) || {}).label || null

    return (
      <section className={Styles.PeriodSelector}>
        <button
          className={Styles.PeriodSelector__button}
          onClick={() => this.setState({ isModalActive: !s.isModalActive })}
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
          className={classNames(
            Styles.PeriodSelector__modal,
            {
              [Styles['PeriodSelector__modal--active']]: s.isModalActive,
            },
          )
          }
        >
          <div className={Styles.PeriodSelector__column}>
            <h1>Range</h1>
            <ul>
              {RANGES.map(range => (
                <li
                  key={range.range}
                  className={Styles.PeriodSelector__value}
                >
                  <button
                    className={
                      classNames({
                        [Styles['PeriodSelector__value--active']]: range.range === s.selectedRange,
                      })
                    }
                    disabled={s.permissibleRanges.indexOf(range.range) === -1}
                    onClick={() => {
                      this.setState({
                        selectedRange: range.range === s.selectedRange ? -1 : range.range,
                      })
                    }}
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
              {PERIODS.map(period => (
                <li
                  key={period.period}
                  className={Styles.PeriodSelector__value}
                >
                  <button
                    className={
                      classNames({
                        [Styles['PeriodSelector__value--active']]: period.period === s.selectedPeriod,
                      })
                    }
                    disabled={s.permissiblePeriods.indexOf(period.period) === -1}
                    onClick={() => {
                      this.setState({
                        selectedPeriod: period.period === s.selectedPeriod ? -1 : period.period,
                      })
                    }}
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
