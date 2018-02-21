import React, { Component } from 'react'
import PropTypes from 'prop-types'

import MarketTradingWrapper from 'modules/market/components/market-trading--wrapper/market-trading--wrapper'
import { Check, Close } from 'modules/common/components/icons'
import { isEqual } from 'lodash'

import BigNumber from 'bignumber.js'

import { SCALAR } from 'modules/markets/constants/market-types'

import Styles from 'modules/market/components/market-trading/market-trading.styles'

class MarketTrading extends Component {
  static propTypes = {
    market: PropTypes.object.isRequired,
    availableFunds: PropTypes.instanceOf(BigNumber).isRequied,
    isLogged: PropTypes.bool.isRequired,
    selectedOutcomes: PropTypes.array.isRequired,
    isMobile: PropTypes.bool.isRequired,
  }

  constructor(props) {
    super(props)

    this.state = {
      showForm: false,
      showOrderPlaced: false,
      selectedOutcome: null
    }

    this.toggleForm = this.toggleForm.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    if (!isEqual(this.props.selectedOutcomes, nextProps.selectedOutcomes)) {
      if (nextProps.selectedOutcomes.length === 1) {
        this.setState({
          selectedOutcome: nextProps.market.outcomes.find(outcome => outcome.id === nextProps.selectedOutcomes[0])
        })
      } else {
        this.setState({
          selectedOutcome: null
        })
      }
    }
  }

  toggleForm() {
    this.setState({ showForm: !this.state.showForm })
  }

  render() {
    const s = this.state
    const p = this.props

    const hasFunds = p.availableFunds.gt(0)
    const hasSelectedOutcome = s.selectedOutcome !== null

    let initialMessage = ''

    switch (true) {
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
            selectedOutcome={s.selectedOutcome}
            initialMessage={initialMessage}
            isMobile={p.isMobile}
            toggleForm={this.toggleForm}
            availableFunds={p.availableFunds}
          />
        }
        { p.isMobile && hasSelectedOutcome && initialMessage &&
          <div className={Styles['Trading__initial-message']}>
            <p>{ initialMessage }</p>
          </div>
        }
        { p.isMobile && hasSelectedOutcome && !initialMessage && !s.showForm && // this needs to be changed to use p.selectedOutcome (should only show on mobile when an outcome has been selected)
          <div className={Styles['Trading__button--trade']}>
            <button onClick={this.toggleForm}>Trade</button>
          </div>
        }
        { s.showOrderPlaced &&
          <div className={Styles['Trading__button--order-placed']}>
            <span>{ Check } Order placed!</span>
            <button onClick={e => this.setState({ showOrderPlaced: false })}>{ Close }</button>
          </div>
        }
      </section>
    )
  }
}

export default MarketTrading
