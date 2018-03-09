import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import MarketTradingWrapper from 'modules/trade/components/trading--wrapper/trading--wrapper'
import { Check, Close } from 'modules/common/components/icons'
import { isEqual } from 'lodash'
import makePath from 'modules/routes/helpers/make-path'

import BigNumber from 'bignumber.js'

import { ACCOUNT_DEPOSIT } from 'modules/routes/constants/views'

import Styles from 'modules/trade/components/trading/trading.styles'

class MarketTrading extends Component {
  static propTypes = {
    market: PropTypes.object.isRequired,
    availableFunds: PropTypes.instanceOf(BigNumber).isRequired,
    isLogged: PropTypes.bool.isRequired,
    selectedOutcomes: PropTypes.array.isRequired,
    isMobile: PropTypes.bool.isRequired,
    selectedOrderProperties: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props)

    this.state = {
      showForm: false,
      showOrderPlaced: false,
      selectedOutcome: (props.selectedOutcomes.length && props.market.outcomes) ? props.market.outcomes.find(outcome => outcome.id === props.selectedOutcomes[0]) : null,
    }

    this.toggleForm = this.toggleForm.bind(this)
    this.toggleShowOrderPlaced = this.toggleShowOrderPlaced.bind(this)
    this.showOrderPlaced = this.showOrderPlaced.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    if ((!isEqual(this.props.selectedOutcomes, nextProps.selectedOutcomes) || (!!this.state.selectedOutcome && !isEqual(this.state.selectedOutcome.id, nextProps.selectedOutcomes[0])) || !isEqual(this.props.market.outcomes, nextProps.market.outcomes)) && (nextProps.market && nextProps.market.outcomes)) {
      if (nextProps.selectedOutcomes.length === 1) {
        this.setState({
          selectedOutcome: nextProps.market.outcomes.find(outcome => outcome.id === nextProps.selectedOutcomes[0]),
        })
      } else {
        this.setState({ selectedOutcome: null })
      }
    }
  }

  toggleForm() {
    this.setState({ showForm: !this.state.showForm })
  }

  toggleShowOrderPlaced() {
    this.setState({ showOrderPlaced: !this.state.showOrderPlaced })
  }

  showOrderPlaced() {
    this.setState({ showOrderPlaced: true })
  }

  render() {
    const s = this.state
    const p = this.props

    const hasFunds = p.availableFunds.gt(0)
    const hasSelectedOutcome = s.selectedOutcome !== null

    let initialMessage = ''

    switch (true) {
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
            selectedOrderProperties={p.selectedOrderProperties}
            initialMessage={initialMessage}
            isMobile={p.isMobile}
            toggleForm={this.toggleForm}
            showOrderPlaced={this.showOrderPlaced}
            availableFunds={p.availableFunds}
            clearTradeInProgress={p.clearTradeInProgress}
          />
        }
        { p.isMobile && hasSelectedOutcome && initialMessage &&
          <div className={Styles['Trading__initial-message']}>
            <p>{ initialMessage }</p>
            {!hasFunds &&
              <Link
                to={makePath(ACCOUNT_DEPOSIT)}
              >
                <span className={Styles['Trading__deposit-button']}>Add Funds</span>
              </Link>
            }
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
            <button onClick={e => this.toggleShowOrderPlaced()}>{ Close }</button>
          </div>
        }
      </section>
    )
  }
}

export default MarketTrading
