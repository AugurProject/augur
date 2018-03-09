import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import MarketOutcomesListOutcome from 'modules/market/components/market-outcomes-list--outcome/market-outcomes-list--outcome'
import { ChevronDown } from 'modules/common/components/icons'
import toggleHeight from 'utils/toggle-height/toggle-height'

import Styles from 'modules/market/components/market-outcomes-list/market-outcomes-list.styles'
import ToggleHeightStyles from 'utils/toggle-height/toggle-height.styles'

export default class MarketOutcomesList extends Component {
  static propTypes = {
    marketId: PropTypes.string.isRequired,
    outcomes: PropTypes.array.isRequired,
    updateSelectedOutcome: PropTypes.func.isRequired,
    isMobile: PropTypes.bool.isRequired,
    selectedOutcome: PropTypes.any,
  }

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
          onClick={() => { !p.isMobile && toggleHeight(this.outcomeList, s.isOpen, () => { this.setState({ isOpen: !s.isOpen }) }) }}
        >
          <h2>Outcomes</h2>
          { !p.isMobile &&
            <span className={classNames({ [`${Styles['is-open']}`]: s.isOpen })}><ChevronDown /></span>
          }
        </button>
        <div
          ref={(outcomeList) => { this.outcomeList = outcomeList }}
          className={classNames(ToggleHeightStyles['open-on-mobile'], ToggleHeightStyles['toggle-height-target'], ToggleHeightStyles['start-open'])}
        >
          <div className={Styles.MarketOutcomesList__table}>
            <ul className={Styles['MarketOutcomesList__table-header']}>
              <li>Outcome</li>
              <li><span>Bid <span />Qty</span></li>
              <li><span>Best <span />Bid</span></li>
              <li><span>Best <span />Ask</span></li>
              <li><span>Ask <span />Qty</span></li>
              <li><span>Last</span></li>
            </ul>
            <div className={Styles['MarketOutcomesList__table-body']}>
              { p.outcomes && p.outcomes.map(outcome => (
                <MarketOutcomesListOutcome
                  key={outcome.id}
                  outcome={outcome}
                  marketId={p.marketId}
                  selectedOutcome={p.selectedOutcome}
                  updateSelectedOutcome={p.updateSelectedOutcome}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    )
  }
}
