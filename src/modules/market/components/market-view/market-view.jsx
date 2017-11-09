import React, { Component } from 'react'

import MarketHeader from 'modules/market/containers/market-header'
import MarketOutcomesChart from 'modules/market/containers/market-outcomes-chart'
import MarketOutcomeCharts from 'modules/market/containers/market-outcome-charts'
import MarketData from 'modules/market/containers/market-data'

import Styles from 'modules/market/components/market-view/market-view.styles'

export default class MarketView extends Component {
  constructor(props) {
    super(props)

    this.state = {
      selectedOutcomes: [],
    }

    this.updateSelectedOutcomes = this.updateSelectedOutcomes.bind(this)
    this.clearSelectedOutcomes = this.clearSelectedOutcomes.bind(this)
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

  clearSelectedOutcomes() {
    this.setState({ selectedOutcomes: [] })
  }

  render() {
    const s = this.state

    return (
      <section>
        <div className={Styles.Market__upper}>
          <MarketHeader
            selectedOutcomes={s.selectedOutcomes}
            updateSelectedOutcomes={this.updateSelectedOutcomes}
            clearSelectedOutcomes={this.clearSelectedOutcomes}
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
        <MarketData
          selectedOutcomes={s.selectedOutcomes}
          updateSelectedOutcomes={this.updateSelectedOutcomes}
        />
      </section>
    )
  }
}
