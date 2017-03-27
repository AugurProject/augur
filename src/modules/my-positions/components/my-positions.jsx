import React, { PropTypes } from 'react';

import NullStateMessage from 'modules/common/components/null-state-message';

import MyPositionsMarket from 'modules/my-positions/components/my-positions-market';

const MyPositions = p => (
  <article className="my-positions">
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
  markets: PropTypes.array.isRequired
};

export default MyPositions;
