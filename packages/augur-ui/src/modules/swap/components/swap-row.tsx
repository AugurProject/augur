import React from 'react';

import { FormattedNumber } from 'modules/types';
import { createBigNumber } from 'utils/create-big-number';

import Styles from 'modules/swap/components/swap-row.styles.less';

interface SwapBlockProps {
  token: string;
  label: string;
  balance: FormattedNumber;
  amount: FormattedNumber;
  setMaxAmount?: Function;
  setToken?: Function;
  setAmount?: Function;
  logo?: React.ReactFragment;
}

export const SwapRow = ({
  token,
  label,
  balance,
  amount,
  setMaxAmount,
  setAmount,
  setToken,
  logo = null,
}: SwapBlockProps) => (
  <div className={Styles.SwapRow}>
    <div>
      <div>{label}</div>
      <div
        onClick={
          setMaxAmount
            ? () => setMaxAmount(createBigNumber(balance.value))
            : null
        }
      >
        Balance: {balance.formattedValue}
      </div>
    </div>

    <div>
      {!setAmount && <div>{amount.formattedValue}</div>}
      {setAmount && (
        <input
          placeholder='0'
          type='number'
          value={amount.formattedValue}
          onChange={e =>
            setAmount(
              createBigNumber(e.target.value),
              createBigNumber(balance.value)
            )
          }
        />
      )}
      <div>
        <div onClick={setToken ? () => setToken() : null}>
          {logo} {token}
        </div>
      </div>
    </div>
  </div>
);
