import React from 'react';
import ReportEthics from 'modules/my-reports/components/report-ethics';
import ValueDenomination from 'modules/common/components/value-denomination';
import { BINARY, CATEGORICAL, SCALAR } from 'modules/markets/constants/market-types';

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
    <ReportEthics isUnethical={p.isUnethical} />
  </article>
);

ConsensusOutcome.propTypes = {
  type: React.PropTypes.string,
  isIndeterminate: React.PropTypes.bool,
  isUnethical: React.PropTypes.bool,
  outcomeName: React.PropTypes.string,
  outcomeID: React.PropTypes.string,
  percentCorrect: React.PropTypes.object
};

export default ConsensusOutcome;
