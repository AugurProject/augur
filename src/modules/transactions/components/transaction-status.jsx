import React from 'react';
import ValueDenomination from 'modules/common/components/value-denomination';
import { formatConfirmations } from 'utils/format-number';
import { SUCCESS } from 'modules/transactions/constants/statuses';

const TransactionStatus = p => (
  <span className="status">
    {p.status}
    {p.status === SUCCESS &&
      <span className="confirmations">
        <ValueDenomination {...formatConfirmations(p.currentBlockNumber - p.blockNumber)} />
      </span>
    }
  </span>
);

TransactionStatus.propTypes = {
  className: React.PropTypes.string,
  status: React.PropTypes.string.isRequired,
  currentBlockNumber: React.PropTypes.number,
  blockNumber: React.PropTypes.number
};

export default TransactionStatus;
