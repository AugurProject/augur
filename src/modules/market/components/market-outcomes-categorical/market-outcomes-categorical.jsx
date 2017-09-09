/* eslint react/no-array-index-key: 0 */  // It's OK in this specific instance as order remains the same

import React, { Component } from 'react'
import PropTypes from 'prop-types'

import getValue from 'utils/get-value'

import Styles from 'modules/market/components/market-outcomes-categorical/market-outcomes-categorical.styles'

const OUTCOME_LINE_HEIGHT = '1.5rem'

const CategoricalOutcome = ({ outcome }) => (
  <div className={Styles.MarketOutcomesCategorical__outcome}>
    <div className={Styles['MarketOutcomesCategorical__inner-table']}>
      <div className={Styles['MarketOutcomesCategorical__inner-tr']}>
        <span className={Styles['MarketOutcomesCategorical__outcome-name']}>{outcome.name}</span>
        <span className={Styles['MarketOutcomesCategorical__outcome-value']}>{getValue(outcome, 'lastPricePercent.full')}</span>
      </div>
    </div>
  </div>
)

class MarketOutcomesCategorical extends  Component {
  constructor(props) {
    super(props)

    this.state = {
      outcomeWrapperHeight: OUTCOME_LINE_HEIGHT,
      isOpen: false,
    }

    this.showMore = this.showMore.bind(this)
  }

  renderCategoricalOutcomes(outcomes) {
    const renderedOutcomes = []
    let outcomeSet = []

    outcomes.forEach((outcome, i) => {
      outcomeSet.push(<CategoricalOutcome key={outcome.id} outcome={outcome} />)

      if ((i !== 0 && i % 3 === 2) || i + 1 === outcomes.length) {
        renderedOutcomes.push(
          <div key={i} className={Styles['MarketOutcomesCategorical__outcome-row']}>
            { outcomeSet }
          </div>
        )
        outcomeSet = []
      }
    })

    return renderedOutcomes
  }

  showMore() {
    const outcomeWrapperHeight = this.state.isOpen ? OUTCOME_LINE_HEIGHT : `${this.outcomeTable.clientHeight}px`

    this.setState({
      outcomeWrapperHeight,
      isOpen: !this.state.isOpen
    })
  }

  render() {
    const { outcomes } = this.props
    const totalOutcomes = outcomes.length
    const showMoreText = this.state.isOpen ? `- ${totalOutcomes - 3} less` :  `+ ${totalOutcomes - 3} more`

    const outcomeWrapperStyle = {
      height: this.state.outcomeWrapperHeight,
    }

    return (
      <div className={Styles.MarketOutcomesCategorical} style={outcomeWrapperStyle}>
        <div className={Styles['MarketOutcomesCategorical__outcomes-container']}>
          { totalOutcomes > 3 &&
            <span className={Styles['MarketOutcomesCategorical__show-more']} onClick={this.showMore}>{ showMoreText }</span>
          }
          <div className={Styles.MarketOutcomesCategorical__outcomes} ref={outcomeTable => {this.outcomeTable = outcomeTable}}>
            {outcomes && this.renderCategoricalOutcomes(outcomes)}
          </div>
        </div>
      </div>
    )
  }
}

MarketOutcomesCategorical.propTypes = {
  outcomes: PropTypes.array.isRequired,
  max: PropTypes.string,
  min: PropTypes.string,
  type: PropTypes.string
}

CategoricalOutcome.propTypes = {
  outcome: PropTypes.object.isRequired
}

export default MarketOutcomesCategorical
