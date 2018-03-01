import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import { BINARY, CATEGORICAL, SCALAR } from 'modules/markets/constants/market-types'
import { BINARY_INDETERMINATE_OUTCOME_ID, CATEGORICAL_SCALAR_INDETERMINATE_OUTCOME_ID } from 'modules/markets/constants/market-outcomes'

const OutcomeOptions = p => (
  <article className="outcome-options">
    {p.type === SCALAR &&
      <div className="reportable-outcomes">
        <label
          key="scalar-outcome"
          className="outcome-option"
          htmlFor="outcome-scalar-input"
        >
          <input
            type="text"
            className="outcome-option-input"
            name="outcome-scalar-input"
            value={p.reportedOutcomeId}
            disabled={p.isReported || p.isIndeterminate}
            onChange={p.onOutcomeChange}
          />
        </label>
      </div>
    }
    {p.type !== SCALAR &&
      <div className="reportable-outcomes">
        {(p.reportableOutcomes || []).map(outcome => (
          <span key={outcome.id}>
            {((p.type === BINARY && outcome.id !== BINARY_INDETERMINATE_OUTCOME_ID) || (p.type === CATEGORICAL && outcome.id !== CATEGORICAL_SCALAR_INDETERMINATE_OUTCOME_ID)) &&
              <label
                className={classNames('outcome-option', { disabled: p.isReported || p.isIndeterminate })}
                htmlFor="outcome-option-radio"
              >
                <input
                  type="radio"
                  className="outcome-option-radio"
                  name="outcome-option-radio"
                  value={outcome.id}
                  checked={p.reportedOutcomeId === outcome.id}
                  disabled={p.isReported || p.isIndeterminate}
                  onChange={p.onOutcomeChange}
                />
                {outcome.name}
              </label>
            }
          </span>
        ))}
      </div>
    }
  </article>
)

OutcomeOptions.propTypes = {
  className: PropTypes.string,
  type: PropTypes.string,
  reportableOutcomes: PropTypes.array,
  reportedOutcomeId: PropTypes.string,
  isReported: PropTypes.bool,
  isIndeterminate: PropTypes.bool,
  onOutcomeChange: PropTypes.func,
}

export default OutcomeOptions
