import React from 'react';
import PropTypes from 'prop-types';

import NullStateMessage from 'modules/common/components/null-state-message';
import MyPositionsMarket from 'modules/my-positions/components/my-positions-market';
import TransactionsLoadingActions from 'modules/transactions/components/transactions-loading-actions';

const MyPositions = p => (
  <article className="my-positions">
    <div className="view-header">
      <div className="view-header-group" />
      <div className="view-header-group">
        <TransactionsLoadingActions
          loadMoreTransactions={p.loadMoreTransactions}
          loadAllTransactions={p.loadAllTransactions}
          transactionsLoading={p.transactionsLoading}
          hasAllTransactionsLoaded={p.hasAllTransactionsLoaded}
          triggerTransactionsExport={p.triggerTransactionsExport}
        />
      </div>
    </div>
    {p.markets && p.markets.length ?
      p.markets.map(market => (
        <MyPositionsMarket
          key={market.id}
          market={market}
          closePositionStatus={p.closePositionStatus}
          isTradeCommitLocked={p.isTradeCommitLocked}
          scalarShareDenomination={p.scalarShareDenomination}
          orderCancellation={p.orderCancellation}
        />
      )) :
      <NullStateMessage
        message="No Positions Held"
      />
    }
  </article>
);

MyPositions.propTypes = {
  markets: PropTypes.array.isRequired,
  isTradeCommitLocked: PropTypes.bool,
  closePositionStatus: PropTypes.object.isRequired,
  scalarShareDenomination: PropTypes.object.isRequired,
  orderCancellation: PropTypes.object.isRequired
};

export default MyPositions;
