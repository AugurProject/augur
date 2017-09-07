/* eslint react/no-array-index-key: 0 */  // It's OK in this specific instance as order remains the same

import React from 'react'
import PropTypes from 'prop-types'

import Styles from 'modules/market/components/market-outcomes-categorical/market-outcomes-categorical.styles'

const CategoricalOutcome = ({ outcome }) => (
  <div className={Styles.MarketOutcomesCategorical__outcome}>
    <span className={Styles['MarketOutcomesCategorical__outcome-name']}>{outcome.name}</span>
    <span className={Styles['MarketOutcomesCategorical__outcome-value']}>60%</span>
  </div>
)

const renderCategoricalOutcomes = (outcomes) => {
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

const MarketOutcomesCategorical = p => (
  <div className={Styles.MarketOutcomesCategorical}>
    <div className={Styles.MarketOutcomesCategorical__outcomes}>
      {p.outcomes && renderCategoricalOutcomes(p.outcomes)}
    </div>
  </div>
)

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
