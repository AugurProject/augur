import React from 'react';
import classNames from 'classnames';
import ValueDenomination from 'modules/common/components/value-denomination';
import { formatConfirmations } from 'utils/format-number';
import { SUCCESS } from 'modules/transactions/constants/statuses';

const TransactionDetails = p => (
  <article className={classNames('transaction-details', p.isVisible ? 'visible' : 'hidden')}>
    <div className="transaction-details-content">
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
      <span className="transaction-status">
        status: <span className="detail-value">{p.status}</span>
      </span>
      {p.status === SUCCESS &&
        <span className="transaction-confirmations">
          <ValueDenomination {...formatConfirmations(p.currentBlockNumber - p.blockNumber)} />
        </span>
      }
    </div>
  </article>
);

export default TransactionDetails;
