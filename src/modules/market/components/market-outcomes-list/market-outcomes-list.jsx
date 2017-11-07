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
          <OutcomesTable className={Styles['MarketOutcomesList__outcomes-header']} outcomes={p.outcomes} />
          <OutcomesTable className={Styles['MarketOutcomesList__outcomes-body']} outcomes={p.outcomes} />
        </div>
      </section>
    )
  }
}

const OutcomesTable = ({ className, outcomes, selectedShareDenomination }) => (
  <div className={classNames(className, Styles['MarketOutcomesList__outcomes'])}>
    <ul className={Styles['MarketOutcomesList__outcomes-column']}>
      <li className={Styles['MarketOutcomesList__outcomes-heading']}>Outcome</li>
      { outcomes && outcomes.map(outcome => (
        <li>
          { getValue(outcome, 'name') }
          <span className={Styles['MarketOutcomesList__outcomes-percent']}>{ getValue(outcome, 'lastPricePercent.full') }</span>
        </li>
      ))}
    </ul>
    <ul className={Styles['MarketOutcomesList__outcomes-column']}>
      <li className={Styles['MarketOutcomesList__outcomes-heading']}>Bid Qty</li>
      { outcomes && outcomes.map(outcome => (
        <li><ValueDenomination formatted={setShareDenomination(getValue(outcome, 'topBid.shares.formatted'), selectedShareDenomination)} /></li>
      ))}
    </ul>
    <ul className={Styles['MarketOutcomesList__outcomes-column']}>
      <li className={Styles['MarketOutcomesList__outcomes-heading']}>Best Bid</li>
      { outcomes && outcomes.map(outcome => (
        <li><ValueDenomination formatted={getValue(outcome, 'topBid.price.formatted')} /></li>
      ))}
    </ul>
    <ul className={Styles['MarketOutcomesList__outcomes-column']}>
      <li className={Styles['MarketOutcomesList__outcomes-heading']}>Best Ask</li>
      { outcomes && outcomes.map(outcome => (
        <li><ValueDenomination formatted={getValue(outcome, 'topAsk.price.formatted')} /></li>
      ))}
    </ul>
    <ul className={Styles['MarketOutcomesList__outcomes-column']}>
      <li className={Styles['MarketOutcomesList__outcomes-heading']}>Ask Qty</li>
      { outcomes && outcomes.map(outcome => (
        <li><ValueDenomination formatted={setShareDenomination(getValue(outcome, 'topAsk.shares.formatted'), selectedShareDenomination)} /></li>
      ))}
    </ul>
    <ul className={Styles['MarketOutcomesList__outcomes-column']}>
      <li className={Styles['MarketOutcomesList__outcomes-heading']}>Last</li>
      { outcomes && outcomes.map(outcome => (
        <li><ValueDenomination formatted={getValue(outcome, 'lastPrice.formatted')} /></li>
      ))}
    </ul>
  </div>
)
