import React from 'react';
import classnames from 'classnames';
import { SCALAR } from 'modules/markets/constants/market-types';

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
            value={p.reportedOutcomeID}
            disabled={p.isReported || p.isIndeterminate}
            onChange={p.onOutcomeChange}
          />
        </label>
      </div>
    }
    {p.type !== SCALAR &&
      <div className="reportable-outcomes">
        {(p.reportableOutcomes || []).map(outcome => (
          <label
            key={outcome.id}
            className={classnames('outcome-option', { disabled: p.isReported || p.isIndeterminate })}
            htmlFor="outcome-option-radio"
          >
            <input
              type="radio"
              className="outcome-option-radio"
              name="outcome-option-radio"
              value={outcome.id}
              checked={p.reportedOutcomeID === outcome.id}
              disabled={p.isReported || p.isIndeterminate}
              onChange={p.onOutcomeChange}
            />
            {outcome.name}
          </label>
        ))}
      </div>
    }
  </article>
);

OutcomeOptions.propTypes = {
  className: React.PropTypes.string,
  type: React.PropTypes.string,
  reportableOutcomes: React.PropTypes.array,
  reportedOutcomeID: React.PropTypes.string,
  isReported: React.PropTypes.bool,
  isIndeterminate: React.PropTypes.bool,
  onOutcomeChange: React.PropTypes.func
};

export default OutcomeOptions;
