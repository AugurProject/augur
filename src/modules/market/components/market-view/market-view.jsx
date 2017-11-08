import React, { Component } from 'react'

import MarketHeader from 'modules/market/containers/market-header'
import MarketOutcomesChart from 'modules/market/containers/market-outcomes-chart'
import MarketOutcomeCharts from 'modules/market/containers/market-outcome-charts'

import Styles from 'modules/market/components/market-view/market-view.styles'

export default class MarketView extends Component {
  constructor(props) {
    super(props)

    this.state = {
      selectedOutcome: null
    }

    this.updateSelectedOutcome = this.updateSelectedOutcome.bind(this)
  }

  updateSelectedOutcome(selectedOutcome) {
    this.setState({ selectedOutcome })
  }

  render() {
    const s = this.state

    return (
      <section>
        <div className={Styles.Market__upper}>
          <MarketHeader
            selectedOutcome={s.selectedOutcome}
            updateSelectedOutcome={this.updateSelectedOutcome}
          />
          {s.selectedOutcome === null &&
            <MarketOutcomesChart
              selectedOutcome={s.selectedOutcome}
              updateSelectedOutcome={this.updateSelectedOutcome}
            />
          }
          {s.selectedOutcome !== null &&
            <MarketOutcomeCharts
              selectedOutcome={s.selectedOutcome}
            />
          }
        </div>
      </section>
    )
  }
}
