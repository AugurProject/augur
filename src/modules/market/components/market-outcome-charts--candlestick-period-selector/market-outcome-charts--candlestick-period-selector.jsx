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

  componentWillUpdate(nextProps) {
    if (!isEqual(this.props.priceTimeSeries, nextProps.priceTimeSeries)) this.updatePermissibleValues(nextProps.priceTimeSeries)
  }

  updatePermissibleValues(priceTimeSeries, selectedPeriod, selectedRange) {
    // NOTE --  fundamental assumption is that the RANGES and PERIODS arrays have
    //          the same number of values that also directly correspond to each other

    const seriesRange = !isEmpty(priceTimeSeries) ?
      priceTimeSeries[priceTimeSeries.length - 1][0] - priceTimeSeries[0][0] :
      null

    let permissibleRanges = []
    let permissiblePeriods = []

    if (seriesRange !== null) {
      permissibleRanges = RANGES.reduce((p, currentRange, i) => {
        const updatedPermissibleRange = p

        // Set lower bound
        if (updatedPermissibleRange[0] == null) {
          if (selectedPeriod !== null && currentRange.range > selectedPeriod) {
            updatedPermissibleRange[0] = currentRange.range
          } else if (i === 0) {
            updatedPermissibleRange[0] = currentRange.range
          }
        }

        // Set upper bound
        if (currentRange.range <= seriesRange && currentRange.range > selectedPeriod) updatedPermissibleRange[1] = currentRange.range

        return updatedPermissibleRange
      }, [])

      permissiblePeriods = PERIODS.reduce((p, currentPeriod, i) => {
        const updatedPermissiblePeriod = p

        // Set Lower Bound
        if (i === 0) updatedPermissiblePeriod[0] = currentPeriod.period

        // Set Upper Bound
        if (selectedRange !== null && currentPeriod.period < selectedRange) {
          updatedPermissiblePeriod[1] = currentPeriod.period
        } else if (currentPeriod < permissibleRanges[1]) {
          updatedPermissiblePeriod[1] = currentPeriod.period
        }

        return updatedPermissiblePeriod
      }, [])
    }

    this.setState({ permissibleRanges, permissiblePeriods })
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
          onClick={() => this.setState({ active: !s.active })}
        >
          <span>Period|Range</span>
          {s.active ?
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
                <li
                  className={
                    classNames(
                      Styles.PeriodSelector__value,
                      {
                        [Styles['PeriodSelector__value--disabled']]: s.permissiblePeriods[0] == null || period.period < s.permissiblePeriods[0] || period.period > s.permissiblePeriods[1],
                        [Styles['PeriodSelector__value--active']]: period.period === s.selectedPeriod
                      }
                    )
                  }
                >
                  <button>
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
                <li
                  className={
                    classNames(
                      Styles.PeriodSelector__value,
                      {
                        [Styles['PeriodSelector__value--disabled']]: s.permissibleRanges[0] == null || range.range < s.permissibleRanges[0] || range.range > s.permissibleRanges[1],
                        [Styles['PeriodSelector__value--active']]: range.period === s.selectedRange
                      }
                    )
                  }
                >
                  <button>
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

// {
//   this.PERIODS.map((period, i) => {
//     return (
//       <li
//         className={
//           classNames(
//             Styles.PeriodSelector__value,
//             {
//               [Styles['PeriodSelector__value--disabled']]: i >= s.permissibleValues
//             }
//           )
//         }
//       >
//         <button>TODO</button>
//       </li>
//     )
//   })
// }
