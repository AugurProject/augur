import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { Link } from 'react-router-dom'
import BigNumber from 'bignumber.js'

import MarketTradingWrapper from 'modules/market/components/market-trading--wrapper/market-trading--wrapper'

import makePath from 'modules/routes/helpers/make-path'

import getValue from 'utils/get-value'

import { BUY, SELL, MARKET, LIMIT } from 'modules/transactions/constants/types'
import { BINARY, CATEGORICAL, SCALAR } from 'modules/markets/constants/market-types'
import { ACCOUNT_DEPOSIT } from 'modules/routes/constants/views'

import FormStyles from 'modules/common/less/form'
import Styles from 'modules/market/components/market-trading/market-trading.styles'

class MarketTrading extends Component {
  constructor(props) {
    super(props)

    this.state = {
      showForm: false,
    }

    this.toggleForm = this.toggleForm.bind(this)
  }

  toggleForm() {
    this.setState({ showForm: !this.state.showForm })
  }

  render() {
    const s = this.state
    const p = this.props

    const hasFunds = getValue(p, 'market.tradeSummary.hasUserEnoughFunds')
    const hasSelectedOutcome = p.selectedOutcomes.length > 0

    let initialMessage = ''

    switch(true) {
      case p.market.marketType === SCALAR:
        initialMessage = false
        break
      case !p.isLogged:
        initialMessage = 'Log in to trade.'
        break
      case p.isLogged && !hasFunds:
        initialMessage = 'Add funds to begin trading.'
        break
      case p.isLogged && hasFunds && !hasSelectedOutcome:
        initialMessage = 'Select an outcome to begin placing an order.'
        break
      default:
        initialMessage = false
    }

    return (
      <section className={Styles.Trading}>
        { (!p.isMobile || (p.isMobile && s.showForm)) &&
          <MarketTradingWrapper
            market={p.market}
            isLogged={p.isLogged}
            selectedOutcomes={p.selectedOutcomes}
            selectedOutcome={p.selectedOutcome}
            initialMessage={initialMessage}
            isMobile={p.isMobile}
            toggleForm={this.toggleForm}
          />
        }
        { p.isMobile && p.selectedOutcomes.length > 0 && initialMessage &&
          <div className={Styles['Trading__initial-message']}>
            <p>{ initialMessage }</p>
          </div>
        }
        { p.isMobile && p.selectedOutcomes.length > 0 && !initialMessage && !s.showForm && // this needs to be changed to use p.selectedOutcome (should only show on mobile when an outcome has been selected)
          <div className={Styles['Trading__button--trade']}>
            <button onClick={this.toggleForm}>Trade</button>
          </div>
        }
      </section>
    )
  }
}

export default MarketTrading
