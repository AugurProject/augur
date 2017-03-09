import React from 'react';
import { SUCCESS } from 'modules/transactions/constants/statuses';

const TransactionStatus = p => (
  <span className="status">
    {p.status !== SUCCESS && p.status}
    {p.status === SUCCESS &&
      `${p.status} (${p.confirmations} confirmations)`
    }
  </span>
);

TransactionStatus.propTypes = {
  className: React.PropTypes.string,
  status: React.PropTypes.string,
  confirmations: React.PropTypes.number
};

export default TransactionStatus;
