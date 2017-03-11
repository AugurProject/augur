import React from 'react';
import ValueDenomination from 'modules/common/components/value-denomination';
import { SUCCESS } from 'modules/transactions/constants/statuses';

const TransactionStatus = p => (
  <span className="status">
    {p.status}
    {p.status === SUCCESS &&
      <span className="confirmations">
        <ValueDenomination {...p.confirmations} />
      </span>
    }
  </span>
);

TransactionStatus.propTypes = {
  className: React.PropTypes.string,
  status: React.PropTypes.string,
  confirmations: React.PropTypes.object
};

export default TransactionStatus;
