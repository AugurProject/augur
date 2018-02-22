import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import { ChevronUp, ChevronDown } from 'modules/common/components/icons'

// import { isEqual, isEmpty } from 'lodash'

// import { RANGE_STEPS } from 'modules/market/constants/permissible-periods'

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

    this.RANGES = [
      'Past minute',
      'Past hour',
      'Past day',
      'Past week',
      'Past month',
      'Past year',
      'Full range'
    ]

    this.PERIODS = [
      'Every block',
      'Every minute',
      'Hourly',
      'Daily',
      'Weekly',
      'Monthly',
      'Yearly'
    ]

    this.state = {
      // selectedPeriod: null,
      // selectedRange: null,
      // permissibleValues: [],
      isModalActive: false
    }

    // this.updatePermissibleRange = this.updatePermissibleRange.bind(this)
  }

  componentWillMount() {
    // this.updatePermissibleRange(this.props.priceTimeSeries)
  }

  componentWillUpdate(nextProps) {
    // if (!isEqual(this.props.priceTimeSeries, nextProps.priceTimeSeries)) this.updatePermissibleRange(nextProps.priceTimeSeries)
  }

  // updatePermissibleRange(priceTimeSeries, selectedPeriod, selectedRange) {
  //   // NOTE --  fundamental assumption is that the RANGES and PERIODS arrays have
  //   //          the same number of values that also directly correspond to each other
  //
  //   const seriesRange = !isEmpty(priceTimeSeries) ? priceTimeSeries[priceTimeSeries.length - 1][0] - priceTimeSeries[0][0] : null
  //
  //   const permissibleValues = RANGE_STEPS.reduce((p, currentRange, i) => {
  //     if (i === 0) return i
  //
  //     if (currentRange === null) {
  //       if (seriesRange >= RANGE_STEPS[i - 1]) return i
  //
  //       return p
  //     }
  //
  //     if (seriesRange >= RANGE_STEPS[i - 1] && seriesRange < currentRange) {
  //       return i
  //     }
  //
  //     return p
  //   }, [])
  //
  //   this.setState({ permissibleValues })
  // }

  render() {
    // TODO
    // Display/Hide options (define allowable items via index (can do conditional on render))
    // Can use min/max math functions or some array method...probably...need to ref the docs

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
              <li className={Styles.PeriodSelector__value}>
                <button>TODO</button>
              </li>
              <li className={Styles.PeriodSelector__value}>
                <button>TODO</button>
              </li>
              <li className={Styles.PeriodSelector__value}>
                <button>TODO</button>
              </li>
              <li className={Styles.PeriodSelector__value}>
                <button>TODO</button>
              </li>
              <li className={Styles.PeriodSelector__value}>
                <button>TODO</button>
              </li>
            </ul>
          </div>
          <div className={Styles.PeriodSelector__column}>
            <h1>Range</h1>
            <ul>
              <li className={Styles.PeriodSelector__value}>
                <button>TODO</button>
              </li>
              <li className={Styles.PeriodSelector__value}>
                <button>TODO</button>
              </li>
              <li className={Styles.PeriodSelector__value}>
                <button>TODO</button>
              </li>
              <li className={Styles.PeriodSelector__value}>
                <button>TODO</button>
              </li>
              <li className={Styles.PeriodSelector__value}>
                <button>TODO</button>
              </li>
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
