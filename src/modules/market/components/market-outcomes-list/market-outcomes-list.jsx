import React, { Component } from 'react'
import classNames from 'classnames'

import MarketOutcomesListOutcome from 'modules/market/components/market-outcomes-list--outcome/market-outcomes-list--outcome'
import { ChevronDown } from 'modules/common/components/icons/icons'
import toggleHeight from 'utils/toggle-height/toggle-height'
import ValueDenomination from 'modules/common/components/value-denomination/value-denomination'

import getValue from 'utils/get-value'
import setShareDenomination from 'utils/set-share-denomination'

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
          <div className={Styles['MarketOutcomesList__table-wrapper']}>
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
                  <MarketOutcomesListOutcome key={outcome.id} outcome={outcome} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }
}
