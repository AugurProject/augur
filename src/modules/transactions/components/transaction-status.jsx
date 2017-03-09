import React from 'react';
import { SUCCESS } from 'modules/transactions/constants/statuses';

const TransactionMessage = p => (
  <span className="status">
    {p.status !== SUCCESS && p.status}
    {p.status === SUCCESS &&
      `${p.status} (${p.confirmations} confirmations)`
    }
  </span>
);

TransactionMessage.propTypes = {
  className: React.PropTypes.string,
  status: React.PropTypes.string,
  confirmations: React.PropTypes.number
};

export default TransactionMessage;
