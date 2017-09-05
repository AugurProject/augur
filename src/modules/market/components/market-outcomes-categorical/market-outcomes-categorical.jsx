import React from 'react'
import PropTypes from 'prop-types'

import Styles from 'modules/market/components/market-outcomes-categorical/market-outcomes-categorical.styles'

const MarketOutcomesCategorical = p => (
  <div className={Styles.MarketOutcomesCategorical}>
    <ul className={Styles.MarketOutcomesCategorical__outcomes}>
      {(p.outcomes || []).map((outcome, i) => (
        <li key={outcome.id} className={Styles.MarketOutcomesCategorical__outcome}>
          <span className={Styles['MarketOutcomesCategorical__outcome-name']}>{outcome.name}</span>
          <span className={Styles['MarketOutcomesCategorical__outcome-value']}>60%</span>
        </li>
      ))}
    </ul>
  </div>
  )

MarketOutcomesCategorical.propTypes = {
  outcomes: PropTypes.array.isRequired,
  max: PropTypes.string,
  min: PropTypes.string,
  type: PropTypes.string
}

export default MarketOutcomesCategorical
