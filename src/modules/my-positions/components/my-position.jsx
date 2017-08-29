import React from 'react';
import PropTypes from 'prop-types';

import ValueDenomination from 'modules/common/components/value-denomination/value-denomination';
import MarketTradeCloseDialog from 'modules/market/components/market-trade-close-dialog';

import { SCALAR } from 'modules/markets/constants/market-types';
import { POSITION } from 'modules/market/constants/trade-close-type';

import getValue from 'utils/get-value';
import setShareDenomination from 'utils/set-share-denomination';

const MyPosition = (p) => {
  const marketID = getValue(p, 'marketID');
  const outcomeID = getValue(p, 'id');

  const selectedShareDenomination = getValue(p, `scalarShareDenomination.markets.${marketID}`);
  const quantityOfShares = setShareDenomination(getValue(p, 'position.qtyShares.formatted'), selectedShareDenomination);

  const isClosable = getValue(p, 'position.isClosable');
  const closePosition = getValue(p, 'position.closePosition');

  const status = getValue(p, `closePositionStatus.${marketID}.${outcomeID}`);

  return (
    <div className="my-position portfolio-detail">
      <div className="portfolio-group main-group">
        {p.type === SCALAR ?
          <span className="main-group-title">{p.lastPricePercent.rounded}</span> :
          <span className="main-group-title">{p.name}</span>
        }
        <div className="portfolio-pair realized-net">
          <span className="title">shares</span>
          <ValueDenomination
            {...p.qtyShares}
            denomination=""
          />
        </div>
      </div>
      <div className="portfolio-group">
        <div className="portfolio-pair purchase-price">
          <span className="title">average price of open position</span>
          <ValueDenomination {...p.purchasePrice} />
        </div>
        <div className="portfolio-pair last-price">
          <span className="title">last trade price</span>
          <ValueDenomination {...p.lastPrice} />
        </div>
      </div>
      <div className="portfolio-group">
        <div className="portfolio-pair realized-net">
          <span className="title">realized P/L</span>
          <ValueDenomination {...p.realizedNet} />
        </div>
        <div className="portfolio-pair unrealized-net">
          <span className="title">unrealized P/L</span>
          <ValueDenomination {...p.unrealizedNet} />
        </div>
        <div className="portfolio-pair total-net">
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
          status={status}
        />
      </div>
    </div>
  );
};

MyPosition.propTypes = {
  marketID: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  scalarShareDenomination: PropTypes.object.isRequired,
  position: PropTypes.object.isRequired,
  closePositionStatus: PropTypes.object.isRequired,
  lastPricePercent: PropTypes.object.isRequired,
  name: PropTypes.string.isRequired,
  qtyShares: PropTypes.object.isRequired,
  purchasePrice: PropTypes.object.isRequired,
  lastPrice: PropTypes.object.isRequired,
  realizedNet: PropTypes.object.isRequired,
  unrealizedNet: PropTypes.object.isRequired,
  totalNet: PropTypes.object.isRequired
};

export default MyPosition;
