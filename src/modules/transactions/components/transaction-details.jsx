import React from 'react';
import classNames from 'classnames';
import ValueDenomination from 'modules/common/components/value-denomination';
import TransactionStatus from 'modules/transactions/components/transaction-status';

function liveDangerously(thisBetterBeSanitized) { return { __html: thisBetterBeSanitized }; }

const TransactionDetails = p => (
  <article className={classNames('transaction-details', p.isVisible && 'visible')}>
    {!!p.message &&
      <span className="message" dangerouslySetInnerHTML={liveDangerously(p.message)} />
    }
    <br />
    {!!p.tradingFees && p.tradingFees.value !== null && p.tradingFees.value !== undefined &&
      <span>
        <ValueDenomination
          className="tradingFees-message"
          {...p.tradingFees}
          prefix="trading fees:"
        />
        <br />
      </span>
    }
    <ul>
      {(p.data.balances || []).map(b => (
        <li key={`${p.id}-${b.change && b.change.full}-${b.balance && b.balance.full}`}>
          {!!b.change &&
            <ValueDenomination
              className="balance-message balance-change"
              {...b.change}
            />
          }
          {!!b.balance &&
            <ValueDenomination
              className="balance-message"
              {...b.balance}
              prefix=" [ balance:" postfix="]"
            />
          }
        </li>
      ))}
    </ul>
    {!!p.freeze &&
      <span className="freeze-message">
        {p.freeze.noFeeCost &&
        <ValueDenomination
          className="freeze-noFeeCost-message"
          {...p.freeze.noFeeCost}
          prefix={p.freeze.verb}
          postfix="+ "
        />
          }
        <ValueDenomination
          className="freeze-tradingFees-message"
          {...p.freeze.tradingFees}
          hidePrefix={!!p.freeze.noFeeCost}
          prefix={p.freeze.verb}
          postfix="in potential trading fees"
        />
        <br />
      </span>
    }
    {!!p.totalCost && p.totalCost.value !== null && p.totalCost.value !== undefined &&
      <span>
        <ValueDenomination
          className="totalCost-message"
          {...p.totalCost}
          prefix="total cost:"
        />
        <br />
      </span>
    }
    {!!p.totalReturn && p.totalReturn.value !== null && p.totalReturn.value !== undefined &&
      <span>
        <ValueDenomination
          className="totalReturn-message"
          {...p.totalReturn}
          prefix="total return:"
        />
        <br />
      </span>
    }
    {!!p.marketCreationFee && p.marketCreationFee.value !== null && p.marketCreationFee !== undefined &&
      <span>
        <ValueDenomination
          className="marketCreationFee-message"
          {...p.marketCreationFee}
          prefix="market creation fee:"
        />
        <br />
      </span>
    }
    {!!p.bond && !!p.bond.value &&
      <span>
        <ValueDenomination
          className="bond-message"
          {...p.bond.value}
          prefix={`${p.bond.label} bond:`}
        />
        <br />
      </span>
    }
    {!!p.gasFees && p.gasFees.value !== null && p.gasFees.value !== undefined &&
      <span>
        <ValueDenomination
          className="gasFees-message"
          {...p.gasFees}
          prefix="gas cost:"
        />
        <br />
      </span>
    }
    <TransactionStatus status={p.status} currentBlockNumber={p.currentBlockNumber} blockNumber={p.blockNumber} />
  </article>
);

export default TransactionDetails;
