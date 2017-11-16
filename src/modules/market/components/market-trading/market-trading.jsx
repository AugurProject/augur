import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { Link } from 'react-router-dom'
import BigNumber from 'bignumber.js'

import MarketTradingForm from 'modules/market/components/market-trading--form/market-trading--form'
import MarketTradingConfirm from 'modules/market/components/market-trading--confirm/market-trading--confirm'

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
      orderType: LIMIT,
      orderPrice: '',
      orderQuantity: '',
      orderEstimate: '',
      selectedNav: BUY,
      isOrderValid: true,
      currentPage: 0,
    }

    this.prevPage = this.prevPage.bind(this)
    this.nextPage = this.nextPage.bind(this)
    this.updateState = this.updateState.bind(this)
  }

  componentWillUpdate(nextProps, nextState) {
    if (this.state.orderQuantity !== nextState.orderQuantity || this.state.orderPrice !== nextState.orderPrice) {
      let orderEstimate = ''
      if (nextState.orderQuantity instanceof BigNumber && nextState.orderPrice instanceof BigNumber) {
        orderEstimate = `${nextState.orderQuantity.times(nextState.orderPrice).toNumber()} ETH`
      }
      this.setState({ orderEstimate })
    }
  }

  prevPage() {
    const newPage = this.state.currentPage <= 0 ? 0 : this.state.currentPage - 1
    this.setState({ currentPage: newPage })
  }

  nextPage() {
    const newPage = this.state.currentPage >= 1 ? 1 : this.state.currentPage + 1
    this.setState({ currentPage: newPage })
  }

  updateState(property, value) {
    this.setState({ [property] : value })
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
        { s.currentPage === 0 &&
          <div>
            <ul className={Styles['Trading__header']}>
              <li className={classNames({ [`${Styles.active}`]: s.selectedNav === BUY })}>
                <button onClick={() => this.setState({ selectedNav: BUY })}>Buy</button>
              </li>
              <li className={classNames({ [`${Styles.active}`]: s.selectedNav === SELL })}>
                <button onClick={() => this.setState({ selectedNav: SELL })}>Sell</button>
              </li>
            </ul>
            { initialMessage &&
              <p className={Styles['Trading__initial-message']}>{ initialMessage }</p>
            }
            { initialMessage && p.isLogged && !hasFunds &&
              <Link className={Styles['Trading__button--add-funds']} to={makePath(ACCOUNT_DEPOSIT)}>Add Funds</Link>
            }
            { !initialMessage &&
              <MarketTradingForm
                market={p.market}
                selectedNav={s.selectedNav}
                orderType={s.orderType}
                orderPrice={s.orderPrice}
                orderQuantity={s.orderQuantity}
                orderEstimate={s.orderEstimate}
                isOrderValid={s.isOrderValid}
                selectedOutcome={p.selectedOutcome}
                nextPage={this.nextPage}
                updateState={this.updateState}
              />
            }
          </div>
        }
        { s.currentPage === 1 &&
          <MarketTradingConfirm
            market={p.market}
            selectedNav={s.selectedNav}
            orderType={s.orderType}
            orderPrice={s.orderPrice}
            orderQuantity={s.orderQuantity}
            orderEstimate={s.orderEstimate}
            selectedOutcome={p.selectedOutcome}
            prevPage={this.prevPage}
            trade={p.selectedOutcome.trade}
          />
        }
      </section>
    )
  }
}

export default MarketTrading
