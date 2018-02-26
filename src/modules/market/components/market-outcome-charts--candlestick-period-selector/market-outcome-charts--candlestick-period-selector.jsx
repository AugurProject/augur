import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import { ChevronUp, ChevronDown } from 'modules/common/components/icons'

import { isEqual, isEmpty } from 'lodash'

import { RANGES, PERIODS } from 'modules/market/constants/permissible-periods'

import Styles from 'modules/market/components/market-outcome-charts--candlestick-period-selector/market-outcome-charts--candlestick-period-selector.styles'

// TODO --
// Select/Update period selection

export default class PeriodSelector extends Component {
  static propTypes = {
    priceTimeSeries: PropTypes.array.isRequired,
    updateSelectedPeriod: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props)

    this.state = {
      selectedPeriod: null,
      selectedRange: null,
      permissibleRanges: [],
      permissiblePeriods: [],
      isModalActive: false
    }

    this.updatePermissibleValues = this.updatePermissibleValues.bind(this)
  }

  componentWillMount() {
    this.updatePermissibleValues(this.props.priceTimeSeries)
  }

  componentWillUpdate(nextProps, nextState) {
    if (
      !isEqual(this.props.priceTimeSeries, nextProps.priceTimeSeries) ||
      this.state.selectedPeriod !== nextState.selectedPeriod ||
      this.state.selectedRange !== nextState.selectedRange
    ) {
      this.updatePermissibleValues(nextProps.priceTimeSeries)
    }
  }

  updatePermissibleValues(priceTimeSeries, selectedPeriod, selectedRange) {
    // NOTE --  fundamental assumption is that the RANGES and PERIODS arrays have
    //          the same number of values that also directly correspond to each other

    const seriesRange = !isEmpty(priceTimeSeries) ?
      priceTimeSeries[priceTimeSeries.length - 1][0] - priceTimeSeries[0][0] :
      null

    console.log('seriesRange -- ', seriesRange)

    let permissibleRanges = []
    let permissiblePeriods = []

    if (seriesRange !== null) {
      // Going to do this in two steps (easier to reason about)

      // Permissible based on series range
      permissibleRanges = RANGES.reduce((p, currentRange, i) => {
        const updatedPermissibleRange = p

        // Lower Bound + initial upper
        if (i === 0) {
          updatedPermissibleRange[0] = currentRange.range
          updatedPermissibleRange[1] = currentRange.range

          return updatedPermissibleRange
        }

        console.log(currentRange.range, seriesRange, currentRange.range <= seriesRange)

        // Upper Bound
        if (currentRange.range === null) { // Null is a special case that denotes 'Full Range'
          if (seriesRange > RANGES[i - 1].range) updatedPermissibleRange[1] = currentRange.range
        } else if (currentRange.range <= seriesRange) {
          updatedPermissibleRange[1] = currentRange.range
        }

        return updatedPermissibleRange
      }, [])

      // Permissible based on selection
    }

    console.log('updatedValues -- ', permissibleRanges, permissiblePeriods)

    this.setState({ permissibleRanges, permissiblePeriods }, () => this.updateSelection())
  }

  updateSelection(period, range) {
    // TODO
  }

  render() {
    // TODO
    // Display/Hide options (define allowable items via index (can do conditional on render))
    // Can use min/max math functions or some array method...probably...need to ref the docs

    const p = this.props
    const s = this.state

    return (
      <section className={Styles.PeriodSelector}>
        <button
          className={Styles.PeriodSelector__button}
          onClick={() => this.setState({ isModalActive: !s.isModalActive })}
        >
          <span>Period|Range</span>
          {s.isModalActive ?
            <ChevronUp /> :
            <ChevronDown />
          }
        </button>
        <div
          className={classNames(
            Styles.PeriodSelector__modal,
            {
              [Styles['PeriodSelector__modal--active']]: s.isModalActive
            }
          )
          }
        >
          <div className={Styles.PeriodSelector__column}>
            <h1>Period</h1>
            <ul>
              {PERIODS.map(period => (
                <li className={Styles.PeriodSelector__value}>
                  <button
                    className={
                      classNames({
                        [Styles['PeriodSelector__value--active']]: period.period === s.selectedPeriod
                      })
                    }
                    disabled={s.permissibleRanges[0] == null || period.period < s.permissiblePeriods[0] || period.period > s.permissiblePeriods[1]}
                  >
                    {period.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div className={Styles.PeriodSelector__column}>
            <h1>Range</h1>
            <ul>
              {RANGES.map(range => (
                <li className={Styles.PeriodSelector__value}>
                  <button
                    className={
                      classNames({
                        [Styles['PeriodSelector__value--active']]: range.range === s.selectedRange
                      })
                    }
                    disabled={s.permissibleRanges[0] == null || range.range < s.permissibleRanges[0] || range.range > s.permissibleRanges[1]}
                  >
                    {range.label}
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

// permissibleRanges = RANGES.reduce((p, currentRange, i) => {
//   const updatedPermissibleRange = p
//
//   // Set lower bound
//   if (updatedPermissibleRange[0] == null) {
//     if (selectedPeriod !== null && currentRange.range > selectedPeriod) {
//       updatedPermissibleRange[0] = currentRange.range
//     } else if (i === 0) {
//       updatedPermissibleRange[0] = currentRange.range
//     }
//   }
//
//   // Set upper bound
//   if (currentRange.range <= seriesRange && currentRange.range > selectedPeriod) updatedPermissibleRange[1] = currentRange.range
//
//   return updatedPermissibleRange
// }, [])
//
// permissiblePeriods = PERIODS.reduce((p, currentPeriod, i) => {
//   const updatedPermissiblePeriod = p
//
//   // Set Lower Bound
//   if (i === 0) updatedPermissiblePeriod[0] = currentPeriod.period
//
//   // Set Upper Bound
//   if (selectedRange !== null && currentPeriod.period < selectedRange) {
//     updatedPermissiblePeriod[1] = currentPeriod.period
//   } else if (currentPeriod < permissibleRanges[1]) {
//     updatedPermissiblePeriod[1] = currentPeriod.period
//   }
//
//   return updatedPermissiblePeriod
// }, [])
