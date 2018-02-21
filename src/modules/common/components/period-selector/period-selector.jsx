import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import { ChevronUp, ChevronDown } from 'modules/common/components/icons'

import { isEqual } from 'lodash'

import Styles from 'modules/common/components/period-selector/period-selector.styles'

// TODO --
// Select/Update period selection

export default class PeriodSelector extends Component {
  static propTypes = {
    priceTimeSeries: PropTypes.array.isRequired,
    updateSelectedPeriod: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props)

    this.PERIOD = {
      BLOCK: 'Every block',
      MINUTE: 'Every minute',
      HOUR: 'Hourly',
      DAY: 'Daily',
      WEEK: 'Weekly',
      MONTH: 'Monthly',
      YEAR: 'Yearly'
    }

    this.RANGE = {
      MINUTE: 'Past minute',
      HOUR: 'Past hour',
      DAY: 'Past day',
      WEEK: 'Past week',
      MONTH: 'Past month',
      YEAR: 'Past year',
      FULL: 'Full range'
    }

    this.state = {
      selectedPeriod: null, // TODO -- will be index value
      selectedRange: null,
      permissiblePeriods: [],
      permissibleRanges: [],
      active: false
    }

    this.updateAllowableRange = this.updateAllowableRange.bind(this)
  }

  componentWillMount() {
    this.updateAllowableRange(this.props.priceTimeSeries)
  }

  componentWillUpdate(nextProps) {
    if (!isEqual(this.props.priceTimeSeries, nextProps.priceTimeSeries)) this.updateAllowableRange(nextProps.priceTimeSeries)
  }

  updateAllowableRange(priceTimeSeries) {
    // TODO
    // Determine allowable range
    // Determine allowable period
    // Display/Hide options (define allowable items via index (can do conditional on render))
    // Can use min/max math functions or some array method...probably...need to ref the docs
  }

  render() {
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
              [Styles['PeriodSelector__modal--active']]: s.active
            }
          )
          }
        >
          <div className={Styles.PeriodSelector__column}>
            <h1>Period</h1>
            <ul>
              <li className={Styles.PeriodSelector__value}>TODO</li>
              <li className={Styles.PeriodSelector__value}>TODO</li>
              <li className={Styles.PeriodSelector__value}>TODO</li>
              <li className={Styles.PeriodSelector__value}>TODO</li>
              <li className={Styles.PeriodSelector__value}>TODO</li>
            </ul>
          </div>
          <div className={Styles.PeriodSelector__column}>
            <h1>Range</h1>
            <ul>
              <li className={Styles.PeriodSelector__value}>TODO</li>
              <li className={Styles.PeriodSelector__value}>TODO</li>
              <li className={Styles.PeriodSelector__value}>TODO</li>
              <li className={Styles.PeriodSelector__value}>TODO</li>
              <li className={Styles.PeriodSelector__value}>TODO</li>
            </ul>
          </div>
        </div>
      </section>
    )
  }
}
