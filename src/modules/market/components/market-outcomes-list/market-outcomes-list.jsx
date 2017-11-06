import React, { Component } from 'react'
import classNames from 'classnames'

import { ChevronDown } from 'modules/common/components/icons/icons'
import toggleHeight from 'utils/toggle-height/toggle-height'

import Styles from 'modules/market/components/market-outcomes-list/market-outcomes-list.styles'
import ToggleHeightStyles from 'utils/toggle-height/toggle-height.styles'

export default class MarketOutcomesList extends Component {
  constructor(props) {
    super(props)

    this.state = {
      isOpen: true,
    }
  }

  render() {
    const s = this.state
    const p = this.props

    return (
      <section className={Styles.MarketOutcomesList}>
        <button
          className={Styles.MarketOutcomesList__heading}
          onClick={() => { toggleHeight(this.outcomeList, s.isOpen, () => { this.setState({ isOpen: !s.isOpen }) }) }}
        >
          <h2>Outcomes</h2>
          <span className={classNames({ [`${Styles['is-open']}`]: s.isOpen })}>{ ChevronDown }</span>
        </button>
        <div
          ref={(outcomeList) => { this.outcomeList = outcomeList }}
          className={classNames(ToggleHeightStyles['toggle-height-target'], ToggleHeightStyles['start-open'])}
        >
          <div className={Styles['MarketOutcomesList__table']}>
            <ul className={Styles['MarketOutcomesList__table-header']}>
              <li>Outcome</li>
              <li>Bid Qty</li>
              <li>Best Bid</li>
              <li>Best Ask</li>
              <li>Ask Qty</li>
              <li>Last</li>
            </ul>
            <div className={Styles['MarketOutcomesList__table-body']}>
              { p.outcomes && p.outcomes.map(outcome => (
                <ul className={Styles['MarketOutcomesList__outcome']}>
                  <li>Hong Kong</li>
                  <li>180</li>
                  <li>0.2250</li>
                  <li>0.3946</li>
                  <li>9</li>
                  <li>0.3937</li>
                </ul>
              ))}
            </div>
          </div>
        </div>
      </section>
    )
  }
}
