import React from 'react';
import Transactions from 'modules/transactions/components/transactions';
import Branch from 'modules/branch/components/branch';

import getValue from 'utils/get-value';

const TransactionsPage = (p) => {
  const hasRep = !!getValue(p, 'loginAccount.rep.value');
  const hasBranch = !!getValue(p, 'branch.id');

  return (
    <section id="transactions_view">
      {hasRep && hasBranch &&
        <Branch {...p.branch} />
      }

      <div className="view-header">
        <h2>Transactions</h2>
      </div>

      <Transactions
        transactions={p.transactions}
        currentBlockNumber={p.currentBlockNumber}
      />
    </section>
  );
};

TransactionsPage.propTypes = {
  branch: React.PropTypes.object,
  currentBlockNumber: React.PropTypes.number,
  loginAccount: React.PropTypes.object,
  transactions: React.PropTypes.array
};

export default TransactionsPage;
