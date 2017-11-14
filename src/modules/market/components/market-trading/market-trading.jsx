import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { Link } from 'react-router-dom'

import makePath from 'modules/routes/helpers/make-path'

import getValue from 'utils/get-value'

import { BID, ASK } from 'modules/transactions/constants/types'
import { ACCOUNT_DEPOSIT } from 'modules/routes/constants/views'

import Styles from 'modules/market/components/market-trading/market-trading.styles'

class MarketTrading extends Component {
  constructor(props) {
    super(props)

    this.state = {
      orderPrice: '',
      orderQuantity: '',
      orderEstimate: '',
      selectedNav: BID,
    }
  }

  render() {
    const s = this.state
    const p = this.props

    const hasFunds = getValue(p, 'market.tradeSummary.hasUserEnoughFunds')
    const hasSelectedOutcome = p.selectedOutcomes.length > 0

    let initialMessage = ''

    switch(true) {
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
        <ul className={Styles['Trading__header']}>
          <li className={classNames({ [`${Styles.active}`]: s.selectedNav === BID })}>
            <button onClick={() => this.setState({ selectedNav: BID })}>Buy</button>
          </li>
          <li className={classNames({ [`${Styles.active}`]: s.selectedNav === ASK })}>
            <button onClick={() => this.setState({ selectedNav: ASK })}>Sell</button>
          </li>
        </ul>
        { initialMessage &&
          <p className={Styles['Trading__initial-message']}>{ initialMessage }</p>
        }
        { p.isLogged && !hasFunds &&
          <Link className={Styles['Trading__button--add-funds']} to={makePath(ACCOUNT_DEPOSIT)}>Add Funds</Link>
        }
      </section>
    )
  }
}

export default MarketTrading
