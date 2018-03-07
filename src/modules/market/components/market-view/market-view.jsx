import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Helmet } from 'react-helmet'

import MarketHeader from 'modules/market/containers/market-header'
import MarketOutcomesChart from 'modules/market/containers/market-outcomes-chart'
import MarketOutcomeCharts from 'modules/market/containers/market-outcome-charts'
import MarketOutcomesAndPositions from 'modules/market/containers/market-outcomes-and-positions'
import MarketTrading from 'modules/market/containers/market-trading'

import parseMarketTitle from 'modules/market/helpers/parse-market-title'

import { CATEGORICAL } from 'modules/markets/constants/market-types'
import { BUY } from 'modules/transactions/constants/types'

import Styles from 'modules/market/components/market-view/market-view.styles'

export default class MarketView extends Component {
  static propTypes = {
    marketId: PropTypes.string.isRequired,
    isConnected: PropTypes.bool.isRequired,
    isMarketLoaded: PropTypes.bool.isRequired,
    loadFullMarket: PropTypes.func.isRequired,
    marketType: PropTypes.string,
  }

  constructor(props) {
    super(props)

    this.DEFAULT_ORDER_PROPERTIES = {
      orderPrice: '',
      orderQuantity: '',
      selectedNav: BUY,
    }

    this.state = {
      selectedOutcomes: props.marketType === CATEGORICAL ? [] : ['1'],
      selectedOrderProperties: this.DEFAULT_ORDER_PROPERTIES,
    }

    this.updateSelectedOutcomes = this.updateSelectedOutcomes.bind(this)
    this.updateSeletedOrderProperties = this.updateSeletedOrderProperties.bind(this)
    this.clearSelectedOutcomes = this.clearSelectedOutcomes.bind(this)
  }

  componentWillMount() {
    if (this.props.isConnected && !this.props.isMarketLoaded) {
      this.props.loadFullMarket()
    }
  }

  componentWillUpdate(nextProps, nextState) {
    if (
      (this.props.isConnected === false && nextProps.isConnected === true) &&
      !!nextProps.marketId
    ) {
      nextProps.loadFullMarket()
    }
  }

  updateSelectedOutcomes(selectedOutcome) {
    const newSelectedOutcomes = [...this.state.selectedOutcomes]
    const selectedOutcomeIndex = newSelectedOutcomes.indexOf(selectedOutcome)

    if (selectedOutcomeIndex !== -1) {
      newSelectedOutcomes.splice(selectedOutcomeIndex, 1)
    } else {
      newSelectedOutcomes.push(selectedOutcome)
    }

    this.setState({ selectedOutcomes: newSelectedOutcomes })
  }

  updateSeletedOrderProperties(selectedOrderProperties) {
    this.setState({
      selectedOrderProperties: {
        ...this.DEFAULT_ORDER_PROPERTIES,
        ...selectedOrderProperties,
      },
    })
  }

  clearSelectedOutcomes() {
    this.setState({ selectedOutcomes: [] })
  }

  render() {
    const p = this.props
    const s = this.state

    return (
      <section>
        <Helmet>
          <title>{parseMarketTitle(p.description)}</title>
        </Helmet>
        <div className={Styles.Market__upper}>
          <MarketHeader
            marketId={p.marketId}
            selectedOutcomes={s.selectedOutcomes}
            updateSelectedOutcomes={this.updateSelectedOutcomes}
            clearSelectedOutcomes={this.clearSelectedOutcomes}
          />
          {(s.selectedOutcomes.length === 0 || s.selectedOutcomes.length !== 1) &&
            <MarketOutcomesChart
              marketId={p.marketId}
              selectedOutcomes={s.selectedOutcomes}
              updateSelectedOutcomes={this.updateSelectedOutcomes}
            />
          }
          {s.selectedOutcomes.length === 1 &&
            <MarketOutcomeCharts
              marketId={p.marketId}
              selectedOutcome={s.selectedOutcomes[0]}
              updateSeletedOrderProperties={this.updateSeletedOrderProperties}
            />
          }
        </div>
        <section className={Styles.Market__details}>
          <div className={Styles['Market__details-outcomes']}>
            <MarketOutcomesAndPositions
              marketId={p.marketId}
              selectedOutcomes={s.selectedOutcomes}
              updateSelectedOutcomes={this.updateSelectedOutcomes}
            />
          </div>
          <div className={Styles['Market__details-trading']}>
            <MarketTrading
              marketId={p.marketId}
              selectedOutcomes={s.selectedOutcomes}
              selectedOrderProperties={s.selectedOrderProperties}
            />
          </div>
        </section>
      </section>
    )
  }
}
