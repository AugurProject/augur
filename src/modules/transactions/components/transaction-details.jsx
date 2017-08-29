import React from 'react';
import ValueDenomination from 'modules/common/components/value-denomination/value-denomination';
import { Link } from 'react-router-dom';

import { SUCCESS } from 'modules/transactions/constants/statuses';

import getValue from 'utils/get-value';
import { formatConfirmations } from 'utils/format-number';

const TransactionDetails = (p) => {
  const TransactionDetails = (p) => {
    const tradingFees = getValue(p, 'tradingFees.value');
    const balances = getValue(p, 'data.balances');
    const totalCost = getValue(p, 'totalCost.value');
    const totalReturn = getValue(p, 'totalReturn.value');
    const marketCreationFee = getValue(p, 'marketCreationFee.value');
    const bond = getValue(p, 'bond.value');
    const gasFees = getValue(p, 'gasFees.value');

    return (
      <div className="transaction-details-content">
        {!!p.topic &&
          <div className="transaction-detail">
            <span className="transaction-detail-title">Topic: </span>
            <span className="transaction-status">{p.topic}</span>
          </div>
        }
        {!!tradingFees &&
          <div className="transaction-detail">
            <ValueDenomination
              className="tradingFees-message"
              {...p.tradingFees}
              prefix="Trading Fees:"
            />
          </div>
        }
        {(balances || []).map(b => (
          <div
            key={`${b.change && b.change.full}-${b.balance && b.balance.full}`}
            className="transaction-detail"
          >
            <span className="transaction-detail-title">Balance Change: </span>
            {!!b.change &&
              <ValueDenomination {...b.change} />
            }
            {!!b.balance &&
              <ValueDenomination
                prefix=" [ balance:" postfix="]"
                {...b.balance}
              />
            }
          </div>
        ))}
        {!!p.freeze &&
          <div className="transaction-detail">
            <span className="transaction-detail-title">{p.freeze.verb} Funds: </span>
            {p.freeze.noFeeCost &&
              <ValueDenomination
                {...p.freeze.noFeeCost}
                postfix="+ "
              />
            }
            <ValueDenomination
              {...p.freeze.tradingFees}
              postfix="in potential trading fees"
            />
          </div>
        }
        {!!totalCost &&
          <div className="transaction-detail">
            <ValueDenomination
              prefix="total cost:"
              {...p.totalCost}
            />
          </div>
        }
        {!!totalReturn &&
          <div className="transaction-detail">
            <ValueDenomination
              prefix="total return:"
              {...p.totalReturn}
            />
          </div>
        }
        {!!marketCreationFee &&
          <div className="transaction-detail">
            <ValueDenomination
              prefix="market creation fee:"
              {...p.marketCreationFee}
            />
          </div>
        }
        {!!bond &&
          <div className="transaction-detail">
            <ValueDenomination
              prefix={`${p.bond.label} bond:`}
              {...p.bond.value}
            />
          </div>
        }
        {!!gasFees &&
          <div className="transaction-detail">
            <ValueDenomination
              prefix="gas cost:"
              {...p.gasFees}
            />
          </div>
        }
        <div className="transaction-detail">
          <span className="transaction-detail-title">Status: </span>
          <span className="transaction-status">{p.status}</span>
        </div>
        {p.status === SUCCESS &&
          <div className="transaction-detail">
            <span className="transaction-detail-title">Confirmations: </span>
            <ValueDenomination
              hideDenomination
              {...formatConfirmations(p.currentBlockNumber - p.blockNumber)}
            />
          </div>
        }
      </div>
    );
  };

  return (
    <article className="transaction-details">
      {p.hash ?
        <a
          to={`https://testnet.etherscan.io/tx/${p.hash}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <TransactionDetails {...p} />
        </a> :
        <TransactionDetails {...p} />
      }
    </article>
  );
};

export default TransactionDetails;
