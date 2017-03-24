import React, { PropTypes } from 'react';

import ValueDenomination from 'modules/common/components/value-denomination';
import MarketTradeCloseDialog from 'modules/market/components/market-trade-close-dialog';

import { SCALAR } from 'modules/markets/constants/market-types';
import { POSITION } from 'modules/market/constants/trade-close-type';

import getValue from 'utils/get-value';
import setShareDenomination from 'utils/set-share-denomination';

const Position = (p) => {
  const marketID = getValue(p, 'marketID');
  const outcomeID = getValue(p, 'id');

  const selectedShareDenomination = getValue(p, `scalarShareDenomination.markets.${marketID}`);
  const quantityOfShares = setShareDenomination(getValue(p, 'position.qtyShares.formatted'), selectedShareDenomination);

  const isClosable = getValue(p, 'position.isClosable');
  const isFullyClosable = getValue(p, 'position.isFullyClosable');
  const closePosition = getValue(p, 'position.closePosition');

  const status = getValue(p, `closePositionStatus.${marketID}.${outcomeID}`);

  return (
    <div className="my-position">
      <div className="my-position-group main-group">
        {p.type === SCALAR ?
          <span className="my-position-name">{p.lastPricePercent.rounded}</span> :
          <span className="my-position-name">{p.name}</span>
        }
        <div className="my-position-pair realized-net">
          <span className="title">shares</span>
          <ValueDenomination
            {...p.qtyShares}
            denomination=""
          />
        </div>
      </div>
      <div className="my-position-group">
        <div className="my-position-pair purchase-price">
          <span className="title">average price of open position</span>
          <ValueDenomination {...p.purchasePrice} />
        </div>
        <div className="my-position-pair last-price">
          <span className="title">last trade price</span>
          <ValueDenomination {...p.lastPrice} />
        </div>
      </div>
      <div className="my-position-group">
        <div className="my-position-pair realized-net">
          <span className="title">realized P/L</span>
          <ValueDenomination {...p.realizedNet} />
        </div>
        <div className="my-position-pair unrealized-net">
          <span className="title">unrealized P/L</span>
          <ValueDenomination {...p.unrealizedNet} />
        </div>
        <div className="my-position-pair total-net">
          <span className="title">total P/L</span>
          <ValueDenomination {...p.totalNet} />
        </div>
      </div>
      <div className="close-trades">
        <MarketTradeCloseDialog
          closeType={POSITION}
          marketID={marketID}
          outcomeID={outcomeID}
          quantityOfShares={quantityOfShares}
          closePosition={closePosition}
          isClosable={isClosable}
          isFullyClosable={isFullyClosable}
          status={status}
          isTradeCommitLocked={p.isTradeCommitLocked}
        />
      </div>
    </div>
  );
};

Position.propTypes = {
  name: PropTypes.string,
  type: PropTypes.string,
  qtyShares: PropTypes.object,
  gainPercent: PropTypes.object,
  lastPrice: PropTypes.object,
  lastPricePercent: PropTypes.object,
  purchasePrice: PropTypes.object,
  realizedNet: PropTypes.object,
  unrealizedNet: PropTypes.object,
  totalNet: PropTypes.object
};

export default Position;
