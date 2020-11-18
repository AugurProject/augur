import React from 'react';
import { FormattedNumber } from 'modules/types';
import { createBigNumber } from 'utils/create-big-number';
import { FormDropdown, TextInput } from 'modules/common/form';
import { NameValuePair } from 'modules/portfolio/types';

import Styles from 'modules/swap/components/swap-row.styles.less';

interface SwapBlockProps {
  token: string;
  label: string;
  balance: FormattedNumber;
  amount: FormattedNumber;
  tokenOptions: NameValuePair[];
  setToken: Function;
  setMaxAmount?: Function;
  setAmount?: Function;
}

export const SwapRow = ({
  token,
  label,
  balance,
  amount,
  setMaxAmount,
  setAmount,
  setToken,
  tokenOptions,
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
        <TextInput
          placeholder={'0.0000'}
          value={String(amount.formattedValue)}
          onChange={value => {
            setAmount(createBigNumber(value), createBigNumber(balance.value));
          }}
          errorMessage={''}
          innerLabel={' '}
        />
      )}
      <div>
        <FormDropdown
          id='currency'
          options={tokenOptions}
          defaultValue={token}
          disabled={false}
          onChange={token => setToken(token)}
        />
      </div>
    </div>
  </div>
);
