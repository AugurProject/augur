import React from 'react'
import PropTypes from 'prop-types'
import ValueDenomination from 'modules/common/components/value-denomination/value-denomination'
import { BINARY, CATEGORICAL, SCALAR } from 'modules/markets/constants/market-types'

const ConsensusOutcome = p => (
  <article className="consensus-outcome">
    {p.isIndeterminate && `Indeterminate`}
    {!p.isIndeterminate && p.type === BINARY && p.outcomeName &&
      <span>
        {p.outcomeName} (<ValueDenomination {...p.percentCorrect} />)
      </span>
    }
    {!p.isIndeterminate && p.type === CATEGORICAL && p.outcomeName}
    {!p.isIndeterminate && p.type === SCALAR && p.outcomeID}
  </article>
)

ConsensusOutcome.propTypes = {
  type: PropTypes.string,
  isIndeterminate: PropTypes.bool,
  outcomeName: PropTypes.string,
  outcomeID: PropTypes.string,
  percentCorrect: PropTypes.object
}

export default ConsensusOutcome
