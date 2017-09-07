import React from 'react'
import PropTypes from 'prop-types'

import Styles from 'modules/market/components/market-outcomes-categorical/market-outcomes-categorical.styles'

const CategoricalOutcome = ({outcome}) => (
  <div className={Styles.MarketOutcomesCategorical__outcome}>
    <span className={Styles['MarketOutcomesCategorical__outcome-name']}>{outcome.name}</span>
    <span className={Styles['MarketOutcomesCategorical__outcome-value']}>60%</span>
  </div>
)

const renderCategoricalOutcomes = (outcomes) => {
  let renderedOutcomes = [];
  let outcomeSet = [];

  outcomes.map((outcome, i) => {
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

const MarketOutcomesCategorical = (p) => {
  const firstThreeOutcomes = p.outcomes.slice(0, 3)
  const remainingOutcomes = p.outcomes.slice(3, p.outcomes.length)

  return (
    <div className={Styles.MarketOutcomesCategorical}>
      <div className={Styles.MarketOutcomesCategorical__outcomes}>
        {p.outcomes && renderCategoricalOutcomes(p.outcomes)}
      </div>
    </div>
  )
}

MarketOutcomesCategorical.propTypes = {
  outcomes: PropTypes.array.isRequired,
  max: PropTypes.string,
  min: PropTypes.string,
  type: PropTypes.string
}

export default MarketOutcomesCategorical
